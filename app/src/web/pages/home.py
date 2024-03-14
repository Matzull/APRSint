from dash import html
import dash_mantine_components as dmc
from dash.dependencies import Input, Output
import plotly.express as px
from dash_express import Page
from dash import dcc
from fetch_data_web import c_parser, HomeFetcher


def main_map(df):
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
    fig.update_traces(marker={"size": 5})
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


def create_layout(app):
    fet = HomeFetcher()
    page = Page(
        app=app,
        url_path="/",
        name="Home",
        get_df=fet.fetch_data,
        title="Aprsint",
    )

    page.layout = dmc.SimpleGrid(
        children=[
            page.add_graph(
                id="main_map", h="calc(100vh - 138px)", render_func=main_map
            ),
            html.Div(id="redirect"),
        ]
    )

    @app.callback(
        Output("redirect", "children"),
        [Input({"type": "graph", "id": "main_map"}, "clickData")],
        prevent_initial_call=True,
    )
    def open_webpage(clickData):
        if clickData is not None:
            print("wao")
            point_index = clickData["points"][0]["pointIndex"]
            url = "/station?id=" + fet.fetch_data().iloc[point_index]["station"]
            return dcc.Location(href=url, id="open-url")

    page.add_autofilter(
        "timestamp", multi=True, label="Select date range", custom=False
    )
    page.add_autofilter(
        "country",
        multi=True,
        label="Select country",
        custom=False,
        **{"searchable": True, "clearable": True},
    )
    page.add_autofilter(
        "station",
        multi=True,
        label="Select station",
        custom=False,
        **{"searchable": True, "clearable": True},
    )

    return page
