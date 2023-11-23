import pathlib

import dash
from dash import html

import components.header as hd
import components.theme_switcher as ts
import components.navbar as nb
import components.symbols as sy

app = dash.Dash(
    __name__,
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/@docsearch/css@3",
    ],
    meta_tags=[{"name": "viewport", "content": "width=device-width, initial-scale=1.0"}],
)
app.title = "APRSint Dashboard"
server = app.server

# Load data


def get_graph():
    return html.Canvas(className="my-4 w-100", id="myChart", width="900", height="380")


APP_PATH = str(pathlib.Path(__file__).parent.resolve())

app.layout = html.Div(
    children=[
        ts.theme_switcher,
        hd.header,
        html.Div(
            className="container-fluid",
            children=[
                html.Div(
                    className="row",
                    children=[
                        nb.navbar,
                        html.Main(
                            className="col-md-9 ms-sm-auto col-lg-10 px-md-4",
                            children=[
                                html.Div(
                                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom",
                                    children=[
                                        html.H1(className="h2", children="Dashboard"),
                                        html.Div(
                                            className="btn-toolbar mb-2 mb-md-0",
                                            children=[
                                                html.Div(
                                                    className="btn-group me-2",
                                                    children=[
                                                        html.Button(
                                                            className="btn btn-sm btn-outline-secondary",
                                                            children="Share",
                                                        ),
                                                        html.Button(
                                                            className="btn btn-sm btn-outline-secondary",
                                                            children="Export",
                                                        ),
                                                    ],
                                                ),
                                                html.Button(
                                                    className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1",
                                                    children=[
                                                        sy.get_symbol(
                                                            class_name="bi",
                                                            name="calendar3",
                                                        ),
                                                        "This week",
                                                    ],
                                                ),
                                            ],
                                        ),
                                    ],
                                ),
                                html.Div(
                                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom",
                                    children=[get_graph()],
                                ),
                            ],
                        ),
                    ],
                )
            ],
        ),
        html.Script(
            src="https://cdn.jsdelivr.net/npm/chart.js@4.3.2/dist/chart.umd.js",
            integrity="sha384-eI7PSr3L1XLISH8JdDII5YN/njoSsxfbrkCTnJrzXt+ENP5MOVBxD+l6sEG4zoLp",
            crossOrigin="anonymous",
        ),
        html.Script(src="./assets/dashboard.js"),
    ]
)


if __name__ == "__main__":
    app.run_server(debug=True)
