import os
import pathlib
import re

import dash
from dash import html

import components.header as hd
import components.theme_switcher as ts

app = dash.Dash(
    __name__,
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1.0"}
    ],
)
app.title = "APRSint Dashboard"
server = app.server

# Load data

APP_PATH = str(pathlib.Path(__file__).parent.resolve())

app.layout = ts.theme_switcher


if __name__ == "__main__":
    app.run_server(debug=True)
