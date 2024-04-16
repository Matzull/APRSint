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
                    id="sigma-container",
                    style={
                        "width": "100%",
                        "height": "calc(100vh - 138px)",
                    },
                ),
                dmc.Button(id="load-graph", children="Load Graph"),
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
            function loadGraphFromCSV(_, _) {
                console.log("Loading graph")
                var s = new sigma({
                    renderer: {
                        container: 'sigma-container',
                        type: 'canvas'
                    },
                    settings: {
                        defaultLabelColor: '#fffaff'
                        //minEdgeSize: 0.1,
                        //maxEdgeSize: 2,
                        //minNodeSize: 1,
                        //maxNodeSize: 8
                    }
                });

                fetch('/assets/data.csv')
                    .then(response => response.text())
                    .then(data => {
                        var lines = data.split('\\n');
                        var nodes = [];
                        var edges = [];

                        lines.forEach(function(line, index) {
                            var cols = line.split(',');
                            if (cols.length === 2) { // Asegurarse de que la línea tenga dos valores separados por coma
                                var src = cols[0].trim();
                                var dst = cols[1].trim();

                                // Agregar nodos si no existen
                                if (!nodes.find(node => node.id === src)) {
                                    nodes.push({ id: src, x: Math.random(), y: Math.random(), size: 3, color: '#7ae620', label: src});
                                }
                                if (!nodes.find(node => node.id === dst)) {
                                    nodes.push({ id: dst, x: Math.random(), y: Math.random(), size: 3, color: '#7ae620', label: dst});
                                }

                                // Agregar aristas
                                edges.push({ id: "e" + index, source: src, target: dst, color: '#acacad2d', type:'line', size:0.1});
                            }
                        });
                        var graph = {
                            nodes: nodes,
                            edges: edges
                        };

                        // Load the graph in sigma
                        s.graph.read(graph);

                        // Add interactivity
                        s.bind('overNode', function(e) {
                            var label = e.data.node.id;
                            console.log('Hovered node: ' + label);
                            // Aquí puedes agregar lógica para mostrar la etiqueta en algún lugar de tu interfaz de usuario
                        });

                        // Bind click event
                        s.bind('clickNode', function(e) {
                            var label = e.data.node.id;
                            console.log('Clicked node: ' + label);

                            window.location.href = '/station?id=' + label;
                        });
                        console.log("Binded")
                        sigma.plugins.relativeSize(s, 1);
                        s.refresh();
                        
                        
                        var config = {
                            linLogMode: true,
                            edgeWeightInfluence: 3,
                            gravity: 2,
                            scalingRatio:10,
                            outboundAttractionDistribution: false
                        };
                        s.startForceAtlas2(config);
                        window.setTimeout(function() {s.killForceAtlas2()}, 10000);
                    })
                    .catch(error => console.error('Error fetching data:', error));
            }                                                                                                                                                                    
            """,
            Output("dummy-output", "children"),
            [Input("load-graph", "n_clicks"), Input("url-store", "href")],
            prevent_initial_call=True,
        )
