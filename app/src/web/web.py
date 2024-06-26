from dash_express import DashExpress
from pages import home, station, graph
from dash.dependencies import Input, Output

app = DashExpress(
    logo={"dark": "/assets/logo_black.png", "light": "/assets/logo_white.png"},
    cache=True,
    default_cache_timeout=3600,
    suppress_callback_exceptions=True,
    compress=True,
    title="APRSint",
)


home_page = home.HomePage(app)
home_page.create_layout()
station_page = station.StationPage(app)
station_page.create_layout()
graph_page = graph.GraphPage(app)
graph_page.create_layout()


@app.callback(
    Output("filter-wrapper-toggle", "hidden"),
    [
        Input("url-loc-home", "pathname"),
    ],
)
def hide_filters(pathname):
    if pathname == "/":
        return False
    elif pathname == "/station" or pathname == "/graph":
        return True
    else:
        return False


app.compile_layout()
