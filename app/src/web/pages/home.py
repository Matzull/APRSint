import dash
from dash import html, dcc, ALL
import dash_mantine_components as dmc
from dash.dependencies import Input, Output, State
import plotly.express as px
from dash_express import Page
from fetch_data_web import c_parser, HomeFetcher
import re


class HomePage:
    def __init__(self, app):
        self.app = app
        self.fet = HomeFetcher()
        self.page = Page(
            app=app,
            url_path="/",
            name="Home",
            get_df=self.fet.fetch_data,
            title="Aprsint",
        )
        self.station = None
        self.rec = None

    def main_map(self, df):
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

    def highlight_word(self, text, highlight):
        highlight = [word.lower() for word in highlight]
        return html.Span(
            [
                html.Mark(word) if word.lower() in highlight else word + " "
                for word in re.split(r"( )", text)
            ]
        )

    def build_fts_table(self, data, words):
        header = [html.Thead((html.Tr([html.Th("Station"), html.Th("Comment")])))]

        body = [
            html.Tbody(
                [
                    html.Tr(
                        [
                            html.Td(
                                dmc.Button(
                                    row[0],
                                    id={"type": "fts-anchor", "index": str(index)},
                                ),
                                style={"width": "10%"},
                            ),
                            html.Td(
                                self.highlight_word(row[1], words),
                                style={"width": "10%"},
                            ),
                        ],
                    )
                    for index, row in enumerate(data[1:])
                ],
                style={"overflow": "scroll", "max-height": "70vh"},
            )
        ]
        return dmc.Table(
            header + body,
            verticalSpacing="sm",
            striped=False,
            highlightOnHover=True,
            withBorder=True,
            withColumnBorders=False,
        )

    def create_layout(self):
        self.page.layout = dmc.SimpleGrid(
            children=[
                self.page.add_graph(
                    id="main_map", h="calc(100vh - 138px)", render_func=self.main_map
                ),
                html.Div(id="redirect"),
            ]
        )

        @self.app.callback(
            Output("fts-output", "children"),
            Output("modal-fts", "opened", allow_duplicate=True),
            Input("search-fts", "n_clicks"),
            State("filter-fts-messages", "value"),
            prevent_initial_call=True,
        )
        def filter_fts(click, value):
            if value:
                print("Showing modal")
                self.station_comments = self.fet.search_comment(value)
                return self.build_fts_table(self.station_comments, value), True
            print("No value, hiding modal")
            return html.Div(), False

        @self.app.callback(
            Output("modal-fts", "opened"),
            Output("url-store", "href", allow_duplicate=True),
            [Input({"type": "fts-anchor", "index": ALL}, "n_clicks")],
            State("modal-fts", "opened"),
            prevent_initial_call=True,
        )
        def hide_modal(n_clicks, opened):
            print(f"Attemting to hide modal")
            if any(n_clicks):
                print(f"Hiding modal with value {n_clicks} {self.station_comments}")
                return False, "/station?id=" + str(
                    self.station_comments[
                        [index for index, click in enumerate(n_clicks) if click][0] + 1
                    ][0]
                )
            return opened, None

        @self.app.callback(
            Output("url-store", "href"),
            Input({"type": "graph", "id": "main_map"}, "clickData"),
            prevent_initial_call=True,
        )
        def open_webpage(clickData):
            if not clickData:
                return dash.no_update
            print("Opening webpage")
            url = "/station?id=" + clickData["points"][0]["hovertext"]
            return url

        def add_autofilters():
            self.page.add_autofilter(
                "timestamp", multi=True, label="Select date range", custom=False
            )
            self.page.add_autofilter(
                "country",
                multi=True,
                label="Select country",
                custom=False,
                **{"searchable": True, "clearable": True, "ordered": True},
            )
            self.page.add_autofilter(
                "ssid",
                multi=True,
                label="Select type of station",
                custom=False,
                **{"searchable": True, "clearable": True, "ordered": True},
            )
            self.page.add_autofilter(
                "station",
                multi=True,
                label="Select station",
                custom=False,
                **{"searchable": True, "clearable": True, "ordered": True},
            )

        add_autofilters()
        return self.page
