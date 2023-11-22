from dash import html
import components.symbols as sy

theme_switcher = html.Div(
    className="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle",
    children=[
        html.Button(
            className="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center",
            id="bd-theme",
            type="button",
            children=[
                sy.circleHalf,
                html.Span(
                    className="visually-hidden",
                    id="bd-theme-text",
                    children=["Toggle theme"],
                ),
            ],
            ** {
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
                        children=[sy.sunFill, "Light", sy.check2],
                        **{"aria-pressed": "false", "data-bs-theme-value": "light"},
                    )
                ),
                html.Li(
                    html.Button(
                        className="dropdown-item d-flex align-items-center",
                        type="button",
                        children=[sy.moon_stars_fill, "Dark", sy.check2],
                        **{"aria-pressed": "false", "data-bs-theme-value": "dark"},
                    )
                ),
                html.Li(
                    html.Button(
                        className="dropdown-item d-flex align-items-center active",
                        type="button",
                        children=[sy.circleHalf, "Auto", sy.check2],
                        **{"aria-pressed": "false", "data-bs-theme-value": "auto"},
                    )
                ),
            ],
            ** {"aria-labelledby": "bd-theme-text"},
        ),
    ],
)
