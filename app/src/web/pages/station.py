from dash import html, dcc
from dash.dependencies import Input, Output
from dash_express import Page
from fetch_data_web import StationFetcher
import dash_mantine_components as dmc


def create_table(data):
    header = [html.Thead(html.Tr([html.Th(header) for header in data[0]]))]

    body = [
        html.Tbody([html.Tr([html.Td(value) for value in row]) for row in data[1:]])
    ]
    return dmc.Table(
        header + body,
        verticalSpacing="sm",
        striped=True,
        highlightOnHover=True,
        withBorder=True,
        withColumnBorders=True,
    )


def create_layout(app):
    fet = StationFetcher("W6HBR-2")
    page = Page(
        app=app,
        url_path="/station",
        name="Station",
        # get_df=fet.fetch_data,
        title="Aprsint",
    )
    data = fet.fetch_data()
    print("First out is", data[0])
    data[1].insert(0, ["src_station", "dst_station", "path", "timestamp", "comment"])
    data[2].insert(0, ["src_station", "dst_station", "path", "timestamp", "comment"])
    page.layout = dmc.Stack(
        [
            dcc.Location(id="url-loc", refresh=True),
            html.Div(id="page-content"),
            create_table(data[0]),
            create_table(data[1]),
            create_table(data[2]),
        ],
        align="center",
        spacing="xl",
    )
    callback(app)
    return page


def callback(app):
    @app.callback(
        Output("page-content", "children"),
        [Input("url-loc", "search")],
    )
    def display_page(url):
        print("waowao")
        return html.Div(
            [html.H3("You are on the station page"), html.P(f"Parameters: {url}")]
        )
