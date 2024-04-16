from dash_express import DashExpress
from pages import home, station, graph
from dash.dependencies import Input, Output

app = DashExpress(
    logo={"dark": "/assets/logo.svg", "light": "/assets/logo.svg"},
    cache=True,
    default_cache_timeout=3600,
    suppress_callback_exceptions=True,
    compress=True,
    external_scripts=[
        "https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.0/sigma.min.js"
    ],
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
    elif pathname == "/station":
        return True
    else:
        return False


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
