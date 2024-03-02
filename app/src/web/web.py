import dash_mantine_components as dmc
import plotly.express as px
from dash_express import DashExpress, Page

# import sys
# import os
# sys.path.append(os.path.join(os.path.dirname(os.getcwd()), "src"))
from app.src.fetch_data_web import c_parser, fetch_data

# Incorporate data
get_df = fetch_data

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
        hover_name="callsign",
        hover_data={"density": False, "longitude": False, "latitude": False},
        zoom=2,
    )
    fig.update_layout(
        showlegend=False,
        coloraxis_showscale=False,
        paper_bgcolor="black",
        geo_bgcolor="rgba(0, 0, 0, 0)",
        mapbox_style="dark",
        mapbox_accesstoken=c_parser["mapbox"]["token"],
        margin=dict(l=0, r=0, t=0, b=0),
    )
    fig.update_traces(marker=dict(size=5))
    return fig


# Dashboard layout
page.layout = dmc.SimpleGrid(
    children=[
        page.add_graph(h="calc(100vh - 138px)", render_func=bar_func),
    ]
)

page.add_autofilter("timestamp", multi=True, label="Select date range", custom=False)

app.run(host="0.0.0.0", debug=True)
