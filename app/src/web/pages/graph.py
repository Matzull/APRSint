import dash
from dash import html
import dash_mantine_components as dmc
from dash.dependencies import Input, Output, State
from dash_express import Page


class GraphPage:
    def __init__(self, app):
        self.app = app
        self.page = Page(
            app=app,
            url_path="/graph",
            name="Graph",
            title="Aprsint",
        )

    def create_layout(self):
        self.page.layout = html.Div(
            [
                html.Div(id="dummy-output"),
                dmc.Card(
                    id="graph-card",
                    children=[
                        dmc.Button(id="load-graph", children="Load Graph"),
                        html.Div(
                            id="search-bar",
                            style={"height": "10%"},
                        ),
                        html.Div(
                            html.Div(
                                id="graph-canvas",
                            ),
                            style={"height": "80%"},
                        ),
                        html.Div(
                            id="graph-timeline",
                            style={"height": "10%"},
                        ),
                    ],
                    withBorder=True,
                    radius="md",
                    style={
                        "height": "calc(100vh - 138px)",
                        "display": "flex",
                        "justifyContent": "center",
                        "alignItems": "center",
                        "backgroundColor": "#222222",
                    },
                ),
                dmc.Affix(
                    dmc.Tooltip(
                        multiline=True,
                        w=500,
                        label=[
                            html.Div(
                                "This page features a directed graph showcasing stations as nodes and messages as edges. Nodes represent stations, with size and brightness indicating message activity. Edges denote message flow between stations, with width and brightness reflecting message volume.",
                                style={"margin-bottom": "16px"},
                            ),
                            html.Div(
                                "Key Features:",
                                style={"font-weight": "bold", "margin-bottom": "8px"},
                            ),
                            dmc.List(
                                [
                                    dmc.ListItem(
                                        "Directed Graph: Visualizes message flow between stations."
                                    ),
                                    dmc.ListItem(
                                        "Node Attributes: Size and brightness indicate message activity."
                                    ),
                                    dmc.ListItem(
                                        "Edge Attributes: Width and brightness reflect message volume."
                                    ),
                                    dmc.ListItem("Search Bar: Easily locate stations."),
                                    dmc.ListItem(
                                        "Timeline: Select messages within a specific time interval."
                                    ),
                                    dmc.ListItem(
                                        "Node Click: Redirects to station information page."
                                    ),
                                ]
                            ),
                        ],
                        position="left",
                        children=dmc.Badge("?"),
                    ),
                    position={"top": 108, "right": 20},
                ),
            ],
            style={
                "width": "100%",
                "height": "100%",
            },
        )
        self.register_callback()

    def register_callback(self):
        self.app.clientside_callback(
            """
            function updateLoadingState(n_clicks) {
                return true
            }
            """,
            Output("load-graph", "loading", allow_duplicate=True),
            Input("load-graph", "n_clicks"),
            prevent_initial_call=True,
        )

        self.app.clientside_callback(
            """  
            function loadGraphFromCSV(n_clicks) {
                let nodes = [];
                var links = [];
                fetch('/assets/nodes.csv') // Ruta al archivo en el servidor
                    .then(response => response.text())
                    .then(data => {
                        var lines = data.split('\\n');
                        lines.forEach(function (line, index) {
                            nodes.push({ id: line });
                        });
                    }).catch(error => console.error('Error fetching node data:', error));

                const link_count = {};
                fetch('/assets/messages.csv') // Ruta al archivo en el servidor
                    .then(response => response.text())
                    .then(data => {
                        var lines = data.split('\\n');
                        lines.forEach(function (line, index) {
                            var cols = line.split(',');
                            if (cols.length === 4) {
                                var src = cols[0].trim();
                                var dst = cols[1].trim();
                                var timestamp = cols[2].trim();
                                var ocurrences = cols[3].trim();

                                //Parse timestamp
                                const [datePart, timePart] = timestamp.split(' ');
                                const [year, month, day] = datePart.split('-').map(Number);
                                //Create a date object
                                const date = new Date(year, month - 1, day);

                                // Add links
                                links.push({ source: src, target: dst, date: date });
                                link_count[src + dst] = ocurrences;
                                //Get most repeating link
                            }
                        });

                        const graph_config = {
                            simulationGravity: 0.25,
                            simulationRepulsion: 2,
                            simulationRepulsionTheta: 1.15,
                            simulationLinkSpring: 0.1,
                            simulationLinkDistance: 5,
                            simulationFriction: 0.9,
                            renderLinks: true,
                            backgroundColor: "#222222",
                        }

                        const config = {
                            accessor: d => d.time,
                            showAnimationControls: true,
                            animationSpeed: 50,
                        }


                        // Get containers and build graph
                        const search_bar = document.getElementById('search-bar')
                        const canvas = document.getElementById('graph-canvas')
                        const graph_timeline = document.getElementById('graph-timeline')
                        const graph = new cg(canvas, graph_config)
                        graph.setData(nodes, [...new Set(links)])
                        const search = new fg(graph, search_bar)
                        const timeline = new hg(graph, graph_timeline)
                        timeline.setConfig(config)
                        // Configure events

                        graph_config.onClick = node => {
                            if (node) {
                                window.location.href = `/station?id=${node.id}`;
                            }
                            else {
                                graph.unselectNodes()
                                search.clearInput()
                            }
                        }

                        //Get node with biggest degree
                        const maxAdjacent = Math.max(...graph._data.nodes.map(n => graph.getAdjacentNodes(n.id).length));

                        graph_config.nodeSize = (n, index) => {
                            const smallest = 5;
                            const bigest = 25;
                            const ratio = Math.log(graph.getAdjacentNodes(n.id).length) / Math.log(maxAdjacent + 0.1 * maxAdjacent)
                            return Math.round(smallest + (bigest - smallest) * ratio)
                        }
                        graph_config.nodeColor = (n, index) => {
                            const adjacentNodes = graph.getAdjacentNodes(n.id);
                            const colorStart = [73, 93, 152, 0.6], colorEnd = [193, 93, 152, 0.9];
                            const interpolateColor = (start, end, ratio) => {
                                const result = [];
                                for (let i = 0; i < 4; i++) {
                                    result.push(Math.round(start[i] + (end[i] - start[i]) * ratio));
                                }
                                return result;
                            };

                            const ratio = Math.log(adjacentNodes.length) / Math.log(maxAdjacent + 0.1 * maxAdjacent);
                            const colorInterpolated = interpolateColor(colorStart, colorEnd, ratio);
                            return `rgba(${colorInterpolated.join(',')})`;
                        }

                        max_link_count = Math.max(...Object.values(link_count));

                        graph_config.linkColor = (l, index) => {
                            const colorStart = [73, 93, 152, 0.5], colorEnd = [193, 93, 152, 0.9];
                            const interpolateColor = (start, end, ratio) => {
                                const result = [];
                                for (let i = 0; i < 4; i++) {
                                    result.push(Math.round(start[i] + (end[i] - start[i]) * ratio));
                                }
                                return result;
                            };
                            const ratio = Math.log(link_count[l.source + l.target]) / Math.log(max_link_count);
                            const colorInterpolated = interpolateColor(colorStart, colorEnd, ratio);
                            return `rgba(${colorInterpolated.join(',')})`;
                        }

                        graph_config.linkWidth = (l, index) => {
                            const ratio = Math.log(link_count[l.source + l.target]) / Math.log(max_link_count);
                            return 1 + 3 * ratio;
                        }

                        graph.setConfig(graph_config);
                        document.getElementById('load-graph').style.display = 'none';
                        document.getElementById('graph-card').style.display = '';
                        document.getElementById('graph-card').style.justifyContent = '';
                        document.getElementById('graph-card').style.alignItems = '';
                        return false
                    }).catch(error => console.error('Error fetching data:', error));

            }
            """,
            Output("load-graph", "loading"),
            [Input("load-graph", "n_clicks"), Input("url-store", "href")],
            prevent_initial_call=True,
        )
