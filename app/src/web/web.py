from dash_express import DashExpress
from pages import home, station

app = DashExpress(
    logo={"dark": "/assets/logo.svg", "light": "/assets/logo.svg"},
    cache=True,
    default_cache_timeout=3600,
    suppress_callback_exceptions=True,
)
home.create_layout(app)
station.create_layout(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
