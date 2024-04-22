from app.interfaces.alchemy import AlchemyInterface
import configparser
from app.db.schema import Station, StationLocation, Messages, QRZProfiles
from geopy.distance import great_circle
import plotly.graph_objects as go
import requests
from bs4 import BeautifulSoup
from http.cookiejar import CookieJar
from random import choice
from datetime import datetime
import re
import pandas as pd
import numpy as np
import os
import sys

sys.path.append(os.path.join(os.path.dirname(os.getcwd())))


class Recolector:
    def __init__(self, target):
        self.c_parser = configparser.ConfigParser()
        self.c_parser.read("./config.ini")
        self.target = target
        self.alchemy_interface = AlchemyInterface({"db": dict(self.c_parser["db"])})
        self.qrz = QRZ(self.alchemy_interface)
        self.recolection = {}

    def set_target(self, target):
        self.target = target

    def report(self):
        report = {}
        if not self.recolection:
            print("Cannot create report without recolecting first")
            return None
        for key, value in self.recolection.items():
            if isinstance(value, pd.DataFrame):
                report[key] = value.to_dict()
            elif isinstance(value, (list, tuple, dict)):
                report[key] = value
            elif not value:
                continue
            else:
                print("Invalid recolection type")
        return report

    def get_station_info(self):
        station_info = self.alchemy_interface.select_obj(
            Station, ["station_id"], df=False, **{"station_id": self.target}
        )
        print("This is", station_info)
        return station_info

    def recolect(
        self,
        timestamps=False,
        locations=False,
        loc_temporal=False,
        comments=False,
        qrz=False,
    ):
        if timestamps or locations or loc_temporal:
            self.station_locations = self.alchemy_interface.select_obj(
                StationLocation, "*", df=True, **{"station": self.target}
            )
        if timestamps:
            self.recolection["timestamps"] = self.analyze_timestamps(
                self.station_locations["timestamp"]
            )
        if locations:
            self.recolection["locations"] = self.analyze_locations(
                self.station_locations[["latitude", "longitude"]].values.tolist()
            )
        if loc_temporal:
            self.recolection["loc_temporal"] = self.analyze_loc_temporal(
                self.station_locations[["latitude", "longitude", "timestamp"]]
            )
        if comments:
            self.station_messages_src = self.alchemy_interface.select_obj(
                Messages, "*", df=True, **{"src_station": self.target}
            )
            self.recolection["comments"] = self.analyze_comment(
                self.station_messages_src["comment"]
            )
        if qrz:
            qrz_data = self.qrz.get_station(self.target)
            self.recolection["qrz"] = qrz_data

    def analyze_timestamps(self, timestamps):
        if timestamps.empty:
            return None
        timestamps = pd.to_datetime(timestamps)

        # Frequency calculations
        time_diffs = timestamps.diff()
        median_freq = time_diffs.median()
        std_diff = time_diffs.std()

        time_diffs = time_diffs.reindex(timestamps.index, method="ffill")

        max_accepted_gap = median_freq + std_diff * 2
        gaps = timestamps[time_diffs > max_accepted_gap]

        mean_freq = time_diffs.mean()
        min_freq = time_diffs.min()
        max_freq = time_diffs.max()
        start_date = timestamps.min()
        end_date = timestamps.max()
        num_timestamps = len(timestamps)
        total_duration = end_date - start_date

        analysis_results = {
            "mean_frequency": mean_freq,
            "median_frequency": median_freq,
            "min_frequency": min_freq,
            "max_frequency": max_freq,
            "start_date": start_date,
            "end_date": end_date,
            "gaps": gaps,
            "num_timestamps": num_timestamps,
            "recorded_time": total_duration,
        }

        return analysis_results

    def analyze_locations(self, locations):
        if not locations:
            return None
        locations_np = np.array(locations)

        # Calculate the total distance and average distance between points
        distances = [
            great_circle(locations_np[i], locations_np[i + 1]).kilometers
            for i in range(len(locations_np) - 1)
        ]
        total_distance = sum(distances)
        average_distance = np.mean(distances) if distances else 0
        std_dev_distance = np.std(distances) if distances else 0

        # Calculate the midpoint
        def calculate_midpoint(locs):
            lat = locs[:, 0]
            lon = locs[:, 1]
            return np.mean(lat), np.mean(lon)

        midpoint = calculate_midpoint(locations_np)

        # Calculate bounding box
        northernmost = max(locations, key=lambda x: x[0])
        southernmost = min(locations, key=lambda x: x[0])
        easternmost = max(locations, key=lambda x: x[1])
        westernmost = min(locations, key=lambda x: x[1])

        max_distance_from_mid = max(
            great_circle(midpoint, loc).kilometers for loc in locations
        )

        latitudes = locations_np[:, 0]
        longitudes = locations_np[:, 1]
        approx_area = (
            great_circle(
                (latitudes.min(), longitudes.min()), (latitudes.min(), longitudes.max())
            ).kilometers
            * great_circle(
                (latitudes.min(), longitudes.min()), (latitudes.max(), longitudes.min())
            ).kilometers
        )

        return {
            "locations": locations,
            "timestamps": self.station_locations["timestamp"],
            "total_distance_km": total_distance,
            "average_distance_km": average_distance,
            "std_dev_distance_km": std_dev_distance,
            "midpoint": midpoint,
            "northernmost": northernmost,
            "southernmost": southernmost,
            "easternmost": easternmost,
            "westernmost": westernmost,
            "max_distance_from_midpoint_km": max_distance_from_mid,
            "approximate_area_sq_km": approx_area,
        }

    def plot_map(self):
        if self.recolection.get("locations") is None:
            print("There is no location data to plot")
            return
        analysis = self.recolection["locations"]
        midpoint = analysis["midpoint"]
        northernmost = analysis["northernmost"]
        southernmost = analysis["southernmost"]
        easternmost = analysis["easternmost"]
        westernmost = analysis["westernmost"]

        lon_box = [
            westernmost[1],
            easternmost[1],
            easternmost[1],
            westernmost[1],
            westernmost[1],
        ]
        lat_box = [
            northernmost[0],
            northernmost[0],
            southernmost[0],
            southernmost[0],
            northernmost[0],
        ]

        fig = go.Figure()

        fig.add_trace(
            go.Scattermapbox(
                lon=lon_box,
                lat=lat_box,
                mode="lines",
                line=go.scattermapbox.Line(color="grey"),
                name="Bounding Box",
            )
        )

        for point, name in zip(
            [northernmost, southernmost, easternmost, westernmost, midpoint],
            ["Northernmost", "Southernmost", "Easternmost", "Westernmost", "Midpoint"],
        ):
            fig.add_trace(
                go.Scattermapbox(
                    lon=[point[1]],
                    lat=[point[0]],
                    mode="markers",
                    marker=go.scattermapbox.Marker(size=5, color="black"),
                )
            )

        fig.update_layout(
            mapbox_style="open-street-map",
            mapbox={"center": {"lon": midpoint[1], "lat": midpoint[0]}, "zoom": 10},
        )
        lats, lons = zip(*analysis["locations"])
        hovertexts = [
            f"Latitude: {lat}<br>Longitude: {lon}<br>Timestamp: {timestamp}"
            for lat, lon, timestamp in zip(lats, lons, analysis["timestamps"])
        ]
        fig.add_trace(
            go.Scattermapbox(
                lon=lons,
                lat=lats,
                mode="markers+lines",
                line=go.scattermapbox.Line(color="black"),
                marker=go.scattermapbox.Marker(size=10, color="blue"),
                hoverinfo="text",
                hovertext=hovertexts,
            )
        )

        fig.update_layout(
            hovermode="closest",
            showlegend=False,
            coloraxis_showscale=False,
            paper_bgcolor="black",
            geo_bgcolor="rgba(0, 0, 0, 0)",
            mapbox_style="dark",
            mapbox_accesstoken=self.c_parser["mapbox"]["token"],
            margin={"l": 0, "r": 0, "t": 0, "b": 0},
        )

        return fig

    def analyze_loc_temporal(self, locations_timestamp):
        if locations_timestamp.empty:
            return None
        locations_timestamp["timestamp"].apply(lambda x: pd.to_datetime(x))
        coordinates = list(
            zip(locations_timestamp["latitude"], locations_timestamp["longitude"])
        )
        locations_timestamp = locations_timestamp.assign(coordinate=coordinates)
        locations_timestamp["time_elapsed"] = (
            locations_timestamp.groupby("coordinate")["timestamp"]
            .diff()
            .fillna(pd.Timedelta(seconds=0))
        )

        total_time_elapsed = locations_timestamp.groupby("coordinate")[
            "time_elapsed"
        ].sum()

        visit_frequency = locations_timestamp["coordinate"].value_counts()

        first_visit = locations_timestamp.groupby("coordinate")["timestamp"].min()
        last_visit = locations_timestamp.groupby("coordinate")["timestamp"].max()

        total_stay_duration = last_visit - first_visit

        results_df = pd.DataFrame(
            {
                "total_time_elapsed": total_time_elapsed,
                "visit_frequency": visit_frequency,
                "first_visit": first_visit,
                "last_visit": last_visit,
                "total_stay_duration": total_stay_duration,
            }
        )

        return results_df

    def analyze_comment(self, comments):
        unique_comments_freq = comments.value_counts()

        pattern = re.compile(
            r"\b((https?|ftp):\/\/)?([\w-]+(\.[a-zA-Z-]+)+)([\/\w-]*)*(\?\w+=\w+(&\w+=\w+)*)?\b"
        )

        def get_url(x):
            if not x:
                return None
            match = pattern.search(x)
            return match.group(0) if match else None

        urls = comments.apply(lambda x: get_url(x))
        has_url = urls.apply(lambda x: x is not None)

        results_list = []
        for comment, freq, has_url_val, url in zip(
            unique_comments_freq.index, unique_comments_freq.values, has_url, urls
        ):
            result_dict = {
                "Comment": comment,
                "Freq": freq,
                "has_url": has_url_val,
                "URL": url,
            }
            results_list.append(result_dict)
        return results_list


class QRZ:
    def __init__(self, alchemy_interface):
        config = configparser.ConfigParser()
        config.read("./config.ini")
        self.account_usage = {}
        for section in config.sections():
            if section.startswith("qrz_"):
                self.account_usage[
                    (config[section]["username"], config[section]["password"])
                ] = 0
        if len(self.account_usage.items()) == 0:
            raise ValueError("Config file does not contain any valid 'qrz' account")
        self.base_url = "https://www.qrz.com/"
        jar = CookieJar()
        self.session = requests.Session()
        self.alchemy_interface = alchemy_interface
        self.session.cookies = jar
        self.is_logged = False

    def prettify(self, text):
        return text.lower().replace(" ", "_").replace("?", "").replace("#", "")

    def format_date(self, date, format):
        date = datetime.strptime(date, format)
        return date.isoformat()

    def roll_accounts(self):
        # choose a random username and password that has an account usage of less than 25
        choices = [item[0] for item in self.account_usage.items() if item[1] < 25]
        if not choices:
            return None
        login = choice(choices)
        self.account_usage[login] += 1
        return login

    def login(self):
        self.login_data = self.roll_accounts()
        if not self.login_data:
            return None
        response = self.session.post(
            "https://www.qrz.com/login",
            data={"username": self.login_data[0], "password": self.login_data[1]},
        )
        if response.status_code == 200:
            self.is_logged = True
        return True

    def check_database(self, station):
        data = self.alchemy_interface.select_obj(
            QRZProfiles, "*", df=False, **{"station": station}
        )
        return data[1][1] if len(data) > 1 else False

    def get_station(self, station):
        if data := self.check_database(station):
            return data
        if not self.login():
            print("Daily limit reached for all accounts")
            return None
        self.response = self.session.get(self.base_url + "db/" + station)
        station_info = {}
        if self.response.status_code != 200:
            print("Could not fetch page: ", self.response.status_code)
            return None
        if "Too many lookups" in self.response.text:
            print("Daily limit reached")
            self.account_usage[self.login_data] = 25
            return self.get_station(station)

        if "no results" in self.response.text:
            print("No results found for station: ", station)
            return None

        soup = BeautifulSoup(self.response.content, "html.parser")
        try:
            station_info["name"] = " ".join(
                soup.find_all("span", {"style": "color: black; font-weight: bold"})[0]
                .getText()
                .split()
            )
        except Exception:
            pass

        station_info["img"] = (
            soup.find("div", id="calldata").find("img", id="mypic").get("src")
        )
        print(station_info["img"])
        if (
            station_info["img"]
            == "https://s3.amazonaws.com/files.qrz.com/static/qrz/qrz_com200x150.jpg"
        ):
            station_info["img"] = "../assets/image-not-available.png"

        station_info["biography"] = soup.find("divalue", id="biodata")
        rows = []
        for _, row in enumerate(soup.find("table", id="detbox").find_all("tr")):
            row_content = [el.text.strip() for el in row.find_all("td")]
            if row_content:
                rows.append(row_content)
        table_data = rows[1:]

        geo = {}
        for item in table_data:
            if item[0].lower() in [
                "longitude",
                "grid_square",
                "geo source",
                "latitude",
            ]:
                geo[self.prettify(item[0])] = item[1]
            elif item[0].lower() == "othercallsigns":
                table_alias = soup.find("th", string="Alias").parent.parent.parent
                aliases = {}
                for row in table_alias.find_all("tr"):
                    if row.find_all("td"):
                        alias = row.find_all("td")[0]
                        aliases[alias.text] = (
                            alias.find("a")["href"] if alias.find("a") else None
                        )
                if aliases:
                    station_info["alias"] = aliases
                continue
            else:
                if len(item) > 1:
                    station_info[self.prettify(item[0])] = item[1]
        if geo.get("longitude") and geo.get("latitude"):
            station_info["longitude"] = float(geo["longitude"].split()[0])
            station_info["latitude"] = float(geo["latitude"].split()[0])

        station_info["address"] = ", ".join(
            list(soup.find_all("p", {"class": "m0"})[0].stripped_strings)[
                4 if station_info.get("nickname") else 2 :
            ]
        )

        for extra_field in ["qsl_by_mail", "uses_lotw", "qsl_by_eqsl"]:
            if extra_field in station_info:
                station_info[extra_field] = station_info[extra_field][:3].strip()

        qrz_data = {}
        for _, (field, value) in enumerate(station_info.items()):
            try:
                if not re.search(
                    "[a-zA-Z0-9]{1,3}[0-9][a-zA-Z0-9]{0,3}[a-zA-Z]", field
                ):
                    qrz_data[field] = value
            except Exception:
                print("Error parsing field: ", field)

        qrz_data["date_joined"] = self.format_date(
            qrz_data["date_joined"], "%Y-%m-%d %H:%M:%S"
        )
        qrz_data["last_update"] = self.format_date(
            qrz_data["last_update"], "%Y-%m-%d %H:%M:%S"
        )
        profile = QRZProfiles(station=station, data=qrz_data)
        self.alchemy_interface.insert_alchemy_obj(profile)
        return qrz_data
