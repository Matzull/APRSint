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
app = DashExpress(
    logo={"dark": "/assets/logo.svg", "light": "/home/matzul/APRSint/media/logo.png"}
)

# Initialize the Page
page = Page(
    app=app,  # DashExpress app
    url_path="/",  # page url
    name="Owerview",  # page name in navigation buttons
    get_df=get_df,  # function for getting pd.DataFrame
    title="Owerview",  # page title
)


# The logic of drawing a graph
def bar_func(df):
    fig = px.scatter_mapbox(
        df,
        lon="longitude",
        lat="latitude",
        color="density",
        color_continuous_scale="hot",
        #  projection="robinson",
    )
    fig.update_layout(
        showlegend=False,
        paper_bgcolor="black",
        geo_bgcolor="black",
        mapbox_style="dark",
        mapbox_accesstoken=c_parser["mapbox"]["token"],
    )
    fig.update_traces(marker=dict(size=5))
    return fig


# Dashboard layout
page.layout = dmc.SimpleGrid(
    page.add_graph(h="calc(100vh - 138px)", render_func=bar_func)
)

# By which columns to filter
page.add_autofilter("symbol", multi=True)
# page.add_autofilter('country', multi=True)
# page.add_autofilter('lifeExp', multi=True)

app.run(host="0.0.0.0", debug=True)
