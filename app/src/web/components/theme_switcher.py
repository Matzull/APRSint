from dash import html
from components.symbols import get_symbol

theme_switcher = html.Div(
    className="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle",
    children=[
        html.Button(
            className="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center",
            id="bd-theme",
            type="button",
            children=[
                get_symbol(
                    "circle-half",
                    class_name="bi my-1 theme-icon-active",
                    width="1em",
                    height="1em",
                ),
                html.Span(
                    className="visually-hidden",
                    id="bd-theme-text",
                    children=["Toggle theme"],
                ),
            ],
            **{
                "data-bs-toggle": "dropdown",
                "aria-expanded": "false",
                "aria-label": "Toggle theme (auto)",
            },
        ),
        html.Ul(
            className="dropdown-menu dropdown-menu-end shadow",
            children=[
                html.Li(
                    html.Button(
                        className="dropdown-item d-flex align-items-center",
                        type="button",
                        children=[
                            get_symbol(
                                "sun-fill",
                                class_name="bi me-2 opacity-50 theme-icon",
                                width="1em",
                                height="1em",
                            ),
                            "Light",
                            get_symbol(
                                "check2",
                                class_name="bi ms-auto d-none",
                                width="1em",
                                height="1em",
                            ),
                        ],
                        **{"aria-pressed": "false", "data-bs-theme-value": "light"},
                    )
                ),
                html.Li(
                    html.Button(
                        className="dropdown-item d-flex align-items-center",
                        type="button",
                        children=[
                            get_symbol(
                                "moon-stars-fill",
                                class_name="bi me-2 opacity-50 theme-icon",
                                width="1em",
                                height="1em",
                            ),
                            "Dark",
                            get_symbol(
                                "check2",
                                class_name="bi ms-auto d-none",
                                width="1em",
                                height="1em",
                            ),
                        ],
                        **{"aria-pressed": "false", "data-bs-theme-value": "dark"},
                    )
                ),
                html.Li(
                    html.Button(
                        className="dropdown-item d-flex align-items-center active",
                        type="button",
                        children=[
                            get_symbol(
                                "circle-half",
                                class_name="bi me-2 opacity-50 theme-icon",
                                width="1em",
                                height="1em",
                            ),
                            "Auto",
                            get_symbol(
                                "check2",
                                class_name="bi ms-auto d-none",
                                width="1em",
                                height="1em",
                            ),
                        ],
                        **{"aria-pressed": "false", "data-bs-theme-value": "auto"},
                    )
                ),
            ],
            **{"aria-labelledby": "bd-theme-text"},
        ),
    ],
)
