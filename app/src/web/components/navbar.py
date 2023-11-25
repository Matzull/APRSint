import dash
from dash import html

from components.symbols import get_symbol

app = dash.Dash(
    __name__,
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1.0"}
    ],
)

navbar = html.Div(
    className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary",
    children=[
        html.Div(
            className="offcanvas-md offcanvas-end bg-body-tertiary",
            id="sidebarMenu",
            tabIndex="-1",
            children=[
                html.Div(
                    className="offcanvas-header",
                    children=[
                        html.H5(
                            className="offcanvas-title",
                            id="sidebarMenuLabel",
                            children="APRSint",
                        ),
                        html.Button(
                            className="btn-close",
                            type="button",
                            **{"data-bs-dismiss": "offcanvas", "aria-label": "Close"},
                        ),
                    ],
                ),
                html.Div(
                    className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto",
                    children=[
                        html.Ul(
                            className="nav flex-column",
                            children=[
                                html.Li(
                                    className="nav-item",
                                    children=[
                                        html.A(
                                            className="nav-link d-flex align-items-center gap-2 active",
                                            href="#",
                                            children=[
                                                get_symbol(
                                                    "house-fill", class_name="bi"
                                                ),
                                                "Dashboard",
                                            ],
                                            **{"aria-current": "page"},
                                        ),
                                    ],
                                ),
                            ],
                        ),
                        html.H6(
                            className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase",
                            children=[
                                html.Span("Last Reports"),
                                html.A(
                                    className="link-secondary",
                                    href="#",
                                    children=[
                                        get_symbol("plus-circle", class_name="bi")
                                    ],
                                    **{"aria-label": "Add a new report"},
                                ),
                            ],
                        ),
                        html.Ul(
                            className="nav flex-column mb-auto",
                            children=[
                                html.Li(
                                    className="nav-item",
                                    children=[
                                        html.A(
                                            className="nav-link d-flex align-items-center gap-2",
                                            href="#",
                                            children=[
                                                get_symbol(
                                                    "file-earmark-text", class_name="bi"
                                                ),
                                                "Current month",
                                            ],
                                        )
                                    ],
                                ),
                                html.Li(
                                    className="nav-item",
                                    children=[
                                        html.A(
                                            className="nav-link d-flex align-items-center gap-2",
                                            href="#",
                                            children=[
                                                get_symbol(
                                                    "file-earmark-text", class_name="bi"
                                                ),
                                                "Last quarter",
                                            ],
                                        )
                                    ],
                                ),
                                html.Li(
                                    className="nav-item",
                                    children=[
                                        html.A(
                                            className="nav-link d-flex align-items-center gap-2",
                                            href="#",
                                            children=[
                                                get_symbol(
                                                    "file-earmark-text", class_name="bi"
                                                ),
                                                "Social engagement",
                                            ],
                                        )
                                    ],
                                ),
                            ],
                        ),
                        html.Hr(className="my-3"),
                        html.Ul(
                            className="nav flex-column mb-auto",
                            children=[
                                html.Li(
                                    className="nav-item",
                                    children=[
                                        html.A(
                                            className="nav-link d-flex align-items-center gap-2",
                                            href="#",
                                            children=[
                                                get_symbol(
                                                    "gear-wide-connected",
                                                    class_name="bi",
                                                ),
                                                "Settings",
                                            ],
                                        )
                                    ],
                                ),
                                html.Li(
                                    className="nav-item",
                                    children=[
                                        html.A(
                                            className="nav-link d-flex align-items-center gap-2",
                                            href="#",
                                            children=[
                                                get_symbol(
                                                    "door-closed", class_name="bi"
                                                ),
                                                "Sign out",
                                            ],
                                        )
                                    ],
                                ),
                            ],
                        ),
                    ],
                ),
            ],
            **{"aria-labelledby": "sidebarMenuLabel"},
        )
    ],
)
