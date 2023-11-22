from dash import html
from dash_svg import Svg
from components.symbols import get_symbol

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
                            children=[get_symbol("search", class_name="bi")],
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
                    children=[get_symbol("list", class_name="bi")],
                ),
            ],
        ),
    ],
)
