from dash import html, dcc
from dash.dependencies import Input, Output
from dash_express import Page, AsideAppShell, DashExpress
from fetch_data_web import StationFetcher
import dash_mantine_components as dmc
from datetime import datetime, timedelta


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
    return dmc.Card(
        children=[
            dmc.CardSection(
                dmc.Image(
                    src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
                    height=160,
                )
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
            dmc.Text(
                "With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway",
                size="sm",
                color="dimmed",
            ),
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
                style={"width": "max-content"},
            ),
        ],
        display="flex"
        style={"flexDirection":"row", "align-items":"stretch", "height": "100%"},
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
