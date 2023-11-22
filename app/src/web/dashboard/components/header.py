import dash
from dash import html
from src.dash_helper import *
from dash import html

app = dash.Dash(
    __name__,
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1.0"}
    ],
)
# button data-bs-toggle='collapse', data-bs-target="#navbarSearch", aria-controls="navbarSearch", aria-expanded="false", aria-label="Toggle search",
header = html.Header(
    className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow",
    children=[
        html.A(
            className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white",
            children="APRSint",
            href="#",
        ),
        html.Ul(
            className="navbar-nav flex-row d-md-none",
            children=[
                html.Li(
                    className="nav-item text-nowrap",
                    children=[
                        html.Button(
                            className="nav-link px-3 text-white",
                            type="button",
                            children=[
                                html.svg(
                                    className="bi", children=[html.use(href="#search")]
                                )
                            ],
                            **{
                                "data-bs-toggle": "collapse",
                                "data-bs-target": "#navbarSearch",
                                "aria-controls": "navbarSearch",
                                "aria-expanded": "false",
                                "aria-label": "Toggle search",
                            },
                        )
                    ],
                ),
                html.Li(
                    className="nav-item text-nowrap",
                    children=[
                        html.A(className="placeholder", children="About", href="#")
                    ],
                ),
            ],
        ),
    ],
)
