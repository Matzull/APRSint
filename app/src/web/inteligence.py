import pandas as pd
import numpy as np
import os
import sys

sys.path.append(os.path.join(os.path.dirname(os.getcwd())))
from app.interfaces.alchemy import AlchemyInterface
import configparser
from app.db.schema import StationLocation, Messages
from geopy.distance import great_circle
import plotly.graph_objects as go
import re

# station_info = self.alchemy_interface.select_obj(
#     Station, "*", df=True, **{"station_id": self.target}
# )


class Recolector:
    def __init__(self, target):
        self.c_parser = configparser.ConfigParser()
        self.c_parser.read("./config.ini")
        self.config = {"db": dict(self.c_parser["db"])}
        self.target = target
        self.alchemy_interface = AlchemyInterface(self.config)

    def set_target(self, target):
        self.target = target

    def report(self):
        report = {}
        if not self.recolection:
            print("Cannot create report without recolecting first")
            return
        for key, value in self.recolection.items():
            if isinstance(value, pd.DataFrame):
                report[key] = value.to_dict()
            elif isinstance(value, dict):
                report[key] = value
            elif isinstance(value, list):
                report[key] = value
            else:
                print("Invalid recolection type")
        return report

    def recolect(
        self, timestamps=False, locations=False, loc_temporal=False, comments=False
    ):
        recolection = {}
        if timestamps or locations or loc_temporal:
            self.station_locations = self.alchemy_interface.select_obj(
                StationLocation, "*", df=True, **{"station": self.target}
            )
        if timestamps:
            recolection["timestamps"] = self.analyze_timestamps(
                self.station_locations["timestamp"]
            )
        if locations:
            recolection["locations"] = self.analyze_locations(
                self.station_locations[["latitude", "longitude"]].values.tolist()
            )
        if loc_temporal:
            recolection["loc_temporal"] = self.analyze_loc_temporal(
                self.station_locations[["latitude", "longitude", "timestamp"]]
            )
        if comments:
            self.station_messages_src = self.alchemy_interface.select_obj(
                Messages, "*", df=True, **{"src_station": self.target}
            )
            # self.station_messages_dst = self.alchemy_interface.select_obj(
            #     Messages, "*", df=True, **{"dst_station": self.target}
            # )
            recolection["comments"] = self.analyze_comment(
                self.station_messages_src["comment"]
            )
        self.recolection = recolection

    def analyze_timestamps(self, timestamps):
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
        # Convert column to datetime
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

        # Calculate the total time spent in each coordinate
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
            r"\b((https?|ftp):\/\/)?([\w-]+(\.[\w-]+)+)([\/\w-]*)*(\?\w+=\w+(&\w+=\w+)*)?\b"
        )
        urls = comments.apply(lambda x: pattern.search(x).group(0))
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
        print(results_list)
        return results_list
