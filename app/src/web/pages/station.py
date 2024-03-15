from dash import html, dcc
from dash.dependencies import Input, Output
from dash_express import Page, AsideAppShell, DashExpress
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
        style={"width": 350, "height": 400},
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
    print("First out is", data[0])
    page.layout = dmc.SimpleGrid(
        cols=3,
        children=[
            create_description(data[0]),
            dmc.Stack(
                [
                    dcc.Location(id="url-loc", refresh=True),
                    html.Div(id="page-content"),
                    create_table(data[1]),
                    create_table(data[2]),
                ],
                align="center",
                spacing="xl",
            ),
        ],
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
