from dash import html, dcc
from dash.dependencies import Input, Output
from dash_express import Page
from fetch_data_web import StationFetcher
import dash_mantine_components as dmc
from datetime import datetime
from inteligence import Recolector
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs
import re
import pandas as pd


class StationPage:
    def __init__(self, app):
        self.app = app
        self.page = Page(
            app=app,
            url_path="/station",
            name="Station",
            # get_df=fet.fetch_data,
            title="Aprsint",
            filter_pannel=False,
        )
        self.station = None
        self.rec = None

    names = {
        "mean_frequency": "Average emmision frequency",
        "median_frequency": "Average emmision frequency",
        "start_date": "First recorded emmision",
        "end_date": "Last recorded emmision",
        "recorded_time": "Total recorded time",
        # "total_time_elapsed": total_time_elapsed,
        # "visit_frequency": visit_frequency,
        # "first_visit": first_visit,
        # "last_visit": last_visit,
        # "total_stay_duration": total_stay_duration,
        "Comment": "Comment",
        "Freq": "Frecuency of the message",
        "URL": "Found urls",
    }

    def format_time(self, value):
        if isinstance(value, datetime):
            return value.strftime("%d-%m-%Y %H:%M")
        elif isinstance(value, timedelta):
            days = value.days
            hours, remainder = divmod(value.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            milliseconds = value.microseconds // 1000
            parts = []
            if days > 0:
                parts.append(f"{days} days")
            if hours > 0:
                parts.append(f"{hours} hours")
            if minutes > 0:
                parts.append(f"{minutes} minutes")
            if seconds + milliseconds > 0:
                parts.append(f"{seconds},{milliseconds} seconds")
            return " ".join(parts)
        else:
            return str(value)

    def create_cell(self, key, text):
        if isinstance(text, (datetime, timedelta)):
            value = self.format_time(text)
        elif key == "URL":
            value = text if re.match(r"^https?:\/\/", text) else f"http://{text}"
            value = dmc.Anchor(value, href=value, underline=False)
        else:
            value = text
        return html.Td(self.names.get(key) if self.names.get(key) else key), html.Td(
            value
        )

    def create_table_card(self, data, keys=None, table_key=None):
        if table_key:
            data = data[table_key][0]

        body = html.Tbody(
            [
                html.Tr([*self.create_cell(key, value)])
                for key, value in data.items()
                if not keys or key in keys
            ]
        )

        return dmc.Table(
            [body],
            verticalSpacing="sm",
            horizontalSpacing="sm",
            withBorder=True,
            withColumnBorders=True,
        )

    def format_to_card(self, data):
        tables = []

        if data.get("locations"):
            tables.append(
                self.create_table_card(
                    data["timestamps"],
                    ["mean_frequency", "start_date", "end_date", "recorded_time"],
                )
            )

        if data.get("loc_temporal"):
            tables.append(
                self.create_table_card(
                    data["timestamps"], ["total_time_elapsed", "visit_frequency"]
                )
            )

        if data.get("comments"):
            tables.append(
                self.create_table_card(
                    data, ["Comment", "Freq", "URL"], table_key="comments"
                )
            )

        return tables

    def create_table(self, data, selected_date):
        header = [html.Thead(html.Tr([html.Th(header) for header in data.columns]))]

        body = [
            html.Tbody(
                [
                    html.Tr(
                        [
                            html.Td(
                                value.strftime("%Y-%m-%d")
                                if isinstance(value, datetime)
                                else value
                            )
                            for value in row
                        ],
                        hidden=(
                            row.iloc[0] < selected_date[0]
                            or row.iloc[0] > selected_date[1]
                        ),
                    )
                    for _, row in data.iterrows()
                ]
            )
        ]
        return dmc.Table(
            header + body,
            verticalSpacing="sm",
            striped=False,
            highlightOnHover=True,
            withBorder=True,
            withColumnBorders=False,
        )

    def create_timeline(self, data):
        dates = [row.iloc[0] for _, row in data.iterrows()]
        self.timeline_dates = dates
        self.station_messages = data
        date_values = list(range(len(dates)))

        def generate_marks(date_values, dates):
            marks = []
            for i in range(len(dates)):
                if i == 0 or i == len(dates) - 1:
                    marks.append(
                        {
                            "value": date_values[i],
                            "label": dates[i].strftime("%Y-%m-%d"),
                        }
                    )
                else:
                    marks.append({"value": date_values[i]})
            return marks

        marks = generate_marks(date_values, dates)

        timeline = html.Div(
            [
                dmc.Text("Select date range", size="xl", weight=500, mb="sm"),
                dmc.RangeSlider(
                    id="slider-callback",
                    value=[date_values[0], date_values[-1]],
                    marks=marks,
                    max=len(date_values) - 1,
                    min=0,
                    minRange=1,
                    mb=60,
                    style={"width": "92%"},
                    styles={
                        "markLabel": {
                            "transform": "rotate(20deg)",
                            "transform-origin": "left bottom",
                        },
                    },
                ),
                html.Div(
                    id="slider-output", style={"overflow": "scroll", "height": "65vh"}
                ),
            ]
        )

        return dmc.Card(
            timeline, withBorder=True, shadow="sm", radius="md", style={"height": "75%"}
        )

    def create_description(self, data):
        self.rec.recolect(
            timestamps=True, locations=True, loc_temporal=True, comments=True
        )
        return dmc.Card(
            children=[
                dcc.Graph(
                    id="local-map", figure=self.rec.plot_map(), style={"size": "95%"}
                ),
                dmc.Group(
                    [
                        dmc.Text(data[-1][0], weight=500),
                        dmc.Badge(data[-1][-1], color="red", variant="light"),
                    ],
                    position="apart",
                    mt="md",
                    mb="xs",
                ),
                *self.format_to_card(self.rec.report()),
            ],
            withBorder=True,
            shadow="sm",
            radius="md",
            style={
                "flex": "0 1 45%"
            },  # enough to allocate space for the diagonal timestamps
        )

    def populate_layout(self, station):
        print(f"Populating layout with station {station}")
        fet = StationFetcher(station)

        data = fet.fetch_data()
        return (
            self.build_profile(),
            self.create_description(data[0]),
            self.create_timeline(data[1]),
        )

    def create_layout(self):
        self.page.layout = dmc.SimpleGrid(
            cols=2,
            children=[dcc.Location(id="url-loc-station")],
            id="page-content",
            display="flex",
            style={"flexDirection": "row", "AlignItems": "stretch", "height": "100%"},
        )

        @self.app.callback(
            Output("page-content", "children"),
            [Input("url-loc-station", "search")],
        )
        def display_page(url):
            parsed_url = urlparse(url)
            station = parse_qs(parsed_url.query).get("id")[0]
            self.station = station
            self.station = "W6HBR"
            self.rec = Recolector(self.station)

            return self.populate_layout(self.station)

        @self.app.callback(
            Output("slider-output", "children"), [Input("slider-callback", "value")]
        )
        def update_value(values):
            selected_dates = (
                self.timeline_dates[values[0]],
                self.timeline_dates[values[1]],
            )
            table = self.create_table(self.station_messages, selected_dates)
            return "", table

        return self.page

    def build_profile(self):
        self.rec.recolect(qrz=True)
        rep = self.rec.report()["qrz"]
        rep.pop("geo")
        rep.pop("alias")
        return dmc.Card(
            children=[
                html.Img(
                    src=self.rec.report()["qrz"]["img"],
                    alt="Profile picture",
                    style={"width": "100%"},
                ),
                self.create_table_card(rep),
            ],
            withBorder=True,
            shadow="sm",
            radius="md",
            style={"flex": "0 1 40%"},
        )
