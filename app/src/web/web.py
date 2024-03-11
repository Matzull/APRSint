import dash_mantine_components as dmc
import plotly.express as px
from dash_express import DashExpress, Page
from dash import html
import plotly.graph_objects as go
from dash.dependencies import Input, Output
from app.src.fetch_data_web import c_parser, Fetcher

fet = Fetcher()
# Incorporate data
get_df = fet.fetch_data

# Initialize the app
app = DashExpress(logo={"dark": "/assets/logo.svg", "light": "/assets/logo.svg"})

# Initialize the Page
page = Page(
    app=app,  # DashExpress app
    url_path="/",  # page url
    name="Home",  # page name in navigation buttons
    get_df=get_df,  # function for getting pd.DataFrame
    title="Aprsint",  # page title
)


# The logic of drawing a graph
def bar_func(df):
    fig = px.scatter_mapbox(
        df,
        lon="longitude",
        lat="latitude",
        color="density",
        color_continuous_scale="hot",
        hover_name="station",
        hover_data={
            "longitude": True,
            "latitude": True,
            "density": False,
            "timestamp": True,
        },
        zoom=2,
    )

    fig.update_traces(
        hoverinfo="text",
        hovertext=[
            "<a href='http://google.com'>Enlace a Google</a>" for _ in range(len(df))
        ],
        marker=go.scattermapbox.Marker(
            size=5,
        ),
    )

    fig.update_layout(
        hovermode="closest",
        showlegend=False,
        coloraxis_showscale=False,
        paper_bgcolor="black",
        geo_bgcolor="rgba(0, 0, 0, 0)",
        mapbox_style="dark",
        mapbox_accesstoken=c_parser["mapbox"]["token"],
        margin={"l": 0, "r": 0, "t": 0, "b": 0},
    )
    return fig


# Dashboard layout
page.layout = dmc.SimpleGrid(
    children=[
        page.add_graph(id="main_map", h="calc(100vh - 138px)", render_func=bar_func),
        html.Div(id="divasa"),
    ]
)


@app.callback(Output("divasa", "children"), Input("main_map", "clickData"))
def do_click(data):
    return "wlwowo"


page.add_autofilter("timestamp", multi=True, label="Select date range", custom=False)

app.run(host="0.0.0.0", debug=True)
