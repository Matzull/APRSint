from dash_express import DashExpress
from pages import home, station
from dash.dependencies import Input, Output
from dash_express._app_shell import BaseAppShell

app = DashExpress(
    logo={"dark": "/assets/logo.svg", "light": "/assets/logo.svg"},
    cache=True,
    default_cache_timeout=3600,
    suppress_callback_exceptions=True,
    compress=True,
)
home.create_layout(app)
station_page = station.StationPage(app)
station_page.create_layout()


@app.callback(
    Output("filter-wrapper-toggle", "hidden"),
    [
        Input("url-loc-home", "pathname"),
    ],
)
def hide_filters(pathname):
    if pathname == "/":
        return False
    elif pathname == "/station":
        return True
    else:
        return False


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
