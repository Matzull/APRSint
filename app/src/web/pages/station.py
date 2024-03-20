from dash import html, dcc
from dash.dependencies import Input, Output
from dash_express import Page
from fetch_data_web import StationFetcher
import dash_mantine_components as dmc
from datetime import datetime
from inteligence import Recolector
from datetime import datetime, timedelta
import re

def format_time(value):
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

def format_to_card(data):
    # items = []
    # if "timestamps" in data:
    #     items.append(dmc.Text("Timestamps:"))
    #     for key, value in data["timestamps"].items():
    #         if key not in [
    #             "median_frequency",
    #             "start_date",
    #             "end_date",
    #             "recorded_time",
    #         ]:
    #             continue
    #         item_text = f"{key}: {value}"
    #         items.append(dmc.ListItem(item_text))
    print([(key, value) for key, value in data["timestamps"].items()
                if key in [
                    "median_frequency",
                    "start_date",
                    "end_date",
                    "recorded_time",
                ]])
    body = [
        html.Tbody(
            [
                html.Tr(
                    [html.Td(key), html.Td(format_time(value) if isinstance(value, datetime) or isinstance(value, timedelta) else str(value))]
                )
                for key, value in data["timestamps"].items()
                if key in [
                    "median_frequency",
                    "start_date",
                    "end_date",
                    "recorded_time",
                ]
            ]
        )
    ]

    return dmc.Table(
        body,
        verticalSpacing="sm",
        withBorder=False,
        withColumnBorders=False,
    )
    # if "locations" in data:
    #     items.append(dmc.Text("Locations:"))
    #     for key, value in data["locations"].items():
    #         if key not in ["total_distance_km"]:
    #             continue
    #         item_text = f"{key}: {value}"
    #         items.append(dmc.ListItem(item_text))

    # if "loc_temporal" in data:
    #     items.append(dmc.Text("Loc Temporal:"))
    #     for key, value in data["loc_temporal"].items():
    #         if key not in ["total_time_elapsed", "visit_frequency"]:
    #             continue
    #         item_text = f"{key}: {value}"
    #         items.append(dmc.ListItem(item_text))

    # if "comments" in data:
    #     items.append(dmc.Text("Comments:"))
    #     for key, value in data["comments"][0].items():
    #         if key not in ["Comment", "Freq", "URL"]:
    #             continue
    #         if key == "URL":
    #             value = value if re.match(r"^https?:\/\/", value) else f"http://{value}"
    #             items.append(
    #                 dmc.ListItem(
    #                     dmc.Anchor(value, href=value, underline=False),
    #                 )
    #             )
    #             continue
    #         item_text = f"{key}: {value}"
    #         items.append(dmc.ListItem(item_text))

    return dmc.List(withPadding=True, children=items)


def create_table(data, selected_date):
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
                        row.iloc[0] < selected_date[0] or row.iloc[0] > selected_date[1]
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


def create_timeline(app, data):
    dates = [row.iloc[0] for _, row in data.iterrows()]

    date_values = list(range(len(dates)))

    marks = [
        {"value": date_values[i], "label": dates[i].strftime("%Y-%m-%d")}
        for i in range(len(dates))
    ]
    timeline = html.Div(
        [
            dmc.Text("Select date range", size="xl", weight=500, mb="sm"),
            dmc.RangeSlider(
                id="slider-callback",
                value=[date_values[0], date_values[-1]],
                marks=marks,
                max=len(date_values) - 1,
                min=0,
                minRange=0,
                mb=60,
                styles={
                    "markLabel": {
                        "transform": "rotate(20deg)",
                        "transform-origin": "left bottom",
                    }
                },
            ),
            html.Div(id="slider-output"),
        ]
    )

    @app.callback(
        Output("slider-output", "children"), [Input("slider-callback", "value")]
    )
    def update_value(values):
        selected_dates = (dates[values[0]], dates[values[1]])
        table = create_table(data, selected_dates)
        return "", table

    return timeline


def create_description(data):
    rec = Recolector("W6HBR-2")
    rec.recolect(timestamps=True, locations=True, loc_temporal=True, comments=True)
    return dmc.Card(
        children=[
            dcc.Graph(
                figure=rec.plot_map(),
                # height=500
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
            # dmc.Text(
            #     # "With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway",
            #     format_to_card(rec.report()),
            #     size="sm",
            #     color="dimmed",
            # ),
            format_to_card(rec.report()),
            dmc.Button(
                "Book classic tour now",
                variant="light",
                color="blue",
                fullWidth=True,
                mt="md",
                radius="md",
            ),
        ],
        withBorder=True,
        shadow="sm",
        radius="md",
        style={"flex": "1"},
    )


def create_layout(app):
    fet = StationFetcher("W6HBR-2")

    page = Page(
        app=app,
        url_path="/station",
        name="Station",
        # get_df=fet.fetch_data,
        title="Aprsint",
        filter_pannel=False,
    )
    data = fet.fetch_data()
    page.layout = dmc.SimpleGrid(
        cols=2,
        children=[
            create_description(data[0]),
            dmc.Stack(
                [
                    dcc.Location(id="url-loc", refresh=True),
                    html.Div(id="page-content"),
                    create_timeline(app, data[1]),
                ],
                align="strech",
                spacing="xl",
                # style={"width": "max-content"},
            ),
        ],
        display="flex",
        style={"flexDirection": "row", "align-items": "stretch", "height": "100%"},
    )

    @app.callback(
        Output("page-content", "children"),
        [Input("url-loc", "search")],
    )
    def display_page(url):
        print("waowao")
        return html.Div(
            # [html.H3("You are on the station page"), html.P(f"Parameters: {url}")]
        )

    return page
