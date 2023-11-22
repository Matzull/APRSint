import os
import pathlib
import re

import dash
from dash import html

import header as hd

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

app.layout = hd.header


if __name__ == "__main__":
    app.run_server(debug=True)
