from dash import html, dcc
from dash.dependencies import Input, Output
from dash_express import Page
from fetch_data_web import StationFetcher
import dash_mantine_components as dmc
from datetime import datetime
from inteligence import Recolector
from name_mapping import name_mapping
from datetime import timedelta
from dash_iconify import DashIconify
from urllib.parse import urlparse, parse_qs
import re


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

    def get_aliases(self, aliases):
        return dmc.List(
            [
                dmc.ListItem(
                    dmc.Anchor(alias, href=link, underline=False, target="_blank")
                )
                for alias, link in aliases.items()
            ]
        )

    def create_table(self, data, keys=None, table_key=None, exclude_keys=None):
        def create_cell(key, text):
            if isinstance(text, (datetime, timedelta)):
                value = self.format_time(text)
            elif key == "URL":
                if text:
                    value = (
                        text if re.match(r"^https?:\/\/", text) else f"http://{text}"
                    )
                    value = dmc.Anchor(value, href=value, underline=False)
                else:
                    value = "No urls found"
            elif key == "alias":
                value = self.get_aliases(text)
            elif key == "address":
                value = dmc.Anchor(
                    text,
                    href="https://www.google.es/maps/search/" + text,
                    underline=False,
                    target="_blank",
                )
            else:
                value = text
            return html.Td(name_mapping.get(key, key)), html.Td(value)

        if table_key:
            data = data[table_key][0]

        body = html.Tbody(
            [
                html.Tr([*create_cell(key, value)])
                for key, value in data.items()
                if (not keys or key in keys)
                and (not exclude_keys or key not in exclude_keys)
            ]
        )

        return dmc.Table(
            [body],
            verticalSpacing="sm",
            horizontalSpacing="sm",
            withBorder=True,
            withColumnBorders=True,
        )

    def create_message_inteligence_tables(self, data):
        tables = []

        if data.get("locations"):
            tables.append(
                self.create_table(
                    data["timestamps"],
                    ["mean_frequency", "start_date", "end_date", "recorded_time"],
                )
            )

        if data.get("loc_temporal"):
            tables.append(
                self.create_table(
                    data["timestamps"], ["total_time_elapsed", "visit_frequency"]
                )
            )

        if data.get("comments"):
            tables.append(
                self.create_table(
                    data, ["Comment", "Freq", "URL"], table_key="comments"
                )
            )

        return tables

    def create_message_inteligence_card(self, data):
        self.rec.recolect(
            timestamps=True, locations=True, loc_temporal=True, comments=True
        )
        inteligence_tables = self.create_message_inteligence_tables(self.rec.report())
        if not inteligence_tables and not self.rec.report().get("locations"):
            return None
        elements = [*inteligence_tables]

        if data:
            elements.insert(
                0,
                dmc.Group(
                    [
                        dmc.Text(data[-1][0], weight=500),
                        dmc.Badge(data[-1][-1], color="red", variant="light"),
                    ],
                    position="apart",
                    mt="md",
                    mb="xs",
                ),
            )

        if self.rec.report().get("locations"):
            elements.insert(
                0,
                dmc.Center(
                    dcc.Graph(
                        id="local-map",
                        figure=self.rec.plot_map(),
                        style={"aspectRatio": "16/10", "maxHeight": "45vh"},
                    )
                ),
            )
        elements.insert(
            0, dmc.Center(dmc.Title("Location information", order=2, mb="sm"))
        )
        return dmc.Card(
            children=elements,
            withBorder=True,
            shadow="sm",
            radius="md",
            style={
                # "flex": "0 1 40%",
                "height": "fit-content",
                "maxHeight": "85vh",
                "overflow": "scroll",
                "maxWidth": "66%",
                "minWidth": "30%",
            },
        )

    def create_messages_table(self, data, selected_date=[]):
        def get_path(value):
            value = value.removeprefix("{").removesuffix("}")
            return dmc.List(
                [dmc.ListItem(station) for station in value.split(",")],
                listStyleType="decimal",
            )

        header = [html.Thead(html.Tr([html.Th(header) for header in data.columns]))]

        body = [
            html.Tbody(
                [
                    html.Tr(
                        [
                            html.Td(
                                (
                                    value.strftime("%Y-%m-%d")
                                    if isinstance(value, datetime)
                                    else get_path(value)
                                    if index == 5
                                    else value
                                ),
                                style={"max_width": "10px"},
                            )
                            for index, value in enumerate(row)
                        ],
                        hidden=(
                            (
                                row.iloc[0] < selected_date[0]
                                or row.iloc[0] > selected_date[1]
                            )
                            if selected_date
                            else False
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

    def create_date_slider(self, data):
        if data.empty:
            return None
        dates = sorted([row.iloc[0] for _, row in data.iterrows()])
        # print(dates)
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
        children = []
        if len(date_values) > 1:
            children.append(
                dmc.Center(dmc.Title("Select date range", order=2, mb="sm"))
            )
            children.append(
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
                )
            )
            children.append(dmc.Title("Messages", order=2, mb="sm"))
            children.append(
                html.Div(
                    id="slider-output",
                    style={
                        "overflow": "scroll",
                        "maxHeight": "70vh",
                        "height": "fit-content",
                    },
                )
            )
        else:
            children.append(dmc.Text("Messages", size="xl", weight=500, mb="sm"))
            children.append(
                html.Div(
                    self.create_messages_table(self.station_messages, []),
                    style={
                        "overflow": "scroll",
                        "maxHeight": "70vh",
                        "height": "fit-content",
                    },
                )
            )

        timeline = html.Div(children=children)

        return dmc.Card(
            timeline,
            withBorder=True,
            shadow="sm",
            radius="md",
            style={"height": "75%", "maxWidth": "66%", "minWidth": "30%"},
        )

    def qrz_profile(self):
        self.rec.recolect(qrz=True)
        rep = self.rec.report().get("qrz")
        if not rep:
            return None
        if rep.get("geo"):
            rep["geo"] = str(rep["geo"])

        return dmc.Card(
            children=[
                dmc.Center(
                    dmc.Stack(
                        [
                            dmc.Title("QRZ information", order=2, mb="sm"),
                            html.Img(
                                src=self.rec.report()["qrz"]["img"],
                                alt="Profile picture",
                                style={"maxHeight": "35vh", "marginBottom": "10px"},
                            ),
                        ]
                    )
                ),
                self.create_table(rep, exclude_keys=["img", "biography"]),
            ],
            withBorder=True,
            shadow="sm",
            radius="md",
            style={
                # "flex": "0 1 40%",
                "maxHeight": "85vh",
                "height": "fit-content",
                "overflow": "scroll",
                "maxWidth": "66%",
                "minWidth": "30%",
            },
        )

    def populate_layout(self, station, exists):
        print(f"Populating layout with station {station} exists?: {exists}")
        if not exists:
            return dmc.Center(
                dmc.Card(
                    children=[
                        dmc.Text(
                            "Please select a valid station to analyze.",
                            style={"marginBottom": 25},
                        ),
                        dmc.Center(
                            children=[
                                dmc.Anchor(
                                    children=[
                                        dmc.Button(
                                            "Return to homepage",
                                            variant="light",
                                            leftIcon=DashIconify(
                                                icon="heroicons-solid:home"
                                            ),
                                            color="blue",
                                        )
                                    ],
                                    href="/",
                                ),
                            ]
                        ),
                    ]
                ),
                style={"height": "80vh", "width": "100%"},
            )

        print(f"Populating layout with station {station}")
        fet = StationFetcher(station)
        data = fet.fetch_data()
        return (
            self.qrz_profile(),
            self.create_message_inteligence_card(data[0]),
            self.create_date_slider(data[1]),
        )

    def create_layout(self):
        self.page.layout = dmc.Group(
            children=[],
            id="page-content",
            position="center",
            grow=1,
            align="flex-start",
            style={"height": "100%", "flexFlow": "nowrap"},
        )

        @self.app.callback(
            Output("page-content", "children"),
            [Input("url-store", "href")],
            # prevent_initial_call=True,
        )
        def display_page(url):
            parsed_url = urlparse(url)
            station = (
                parse_qs(parsed_url.query).get("id")[0]
                if parsed_url.query and parse_qs(parsed_url.query).get("id")
                else None
            )
            self.station = station
            if station:
                self.rec = Recolector(self.station)
                # Does the station exist?
                exists = len(self.rec.get_station_info()) > 1
            else:
                exists = False
            return self.populate_layout(self.station, exists)

        @self.app.callback(
            Output("slider-output", "children"),
            [Input("slider-callback", "value")],
            # prevent_initial_call=True,
        )
        def update_dates_table(values):
            selected_dates = (
                self.timeline_dates[values[0]],
                self.timeline_dates[values[1]],
            )
            print("Callback selected dates")
            print(selected_dates)
            table = self.create_messages_table(self.station_messages, selected_dates)
            return "", table

        return self.page
