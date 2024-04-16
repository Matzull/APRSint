from dash import Dash, html, dcc
from dash.dependencies import Input, Output

app = Dash(
    __name__,
    assets_folder="assets",
    external_scripts=[
        "https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.0/sigma.min.js"
    ],
)

app.layout = html.Div(
    [
        html.Div(id="dummy-output"),
        html.Div(
            id="sigma-container",
            style={"width": "100%", "height": "500px", "border": "1px solid #ccc"},
        ),
        html.Button(id="load-graph-button", children="Load Graph"),
    ]
)

app.clientside_callback(
    """ 
    function loadGraphFromCSV() {
    var s = new sigma({
        renderer: {
            container: 'sigma-container',
            type: 'canvas'
        },
        settings: {
            minEdgeSize: 0.1,
            maxEdgeSize: 2,
            minNodeSize: 1,
            maxNodeSize: 8
        }
    });

    fetch('/assets/data.csv') // Ruta al archivo en el servidor
        .then(response => response.text())
        .then(data => {
            var lines = data.split('\\n');
            var nodes = [];
            var edges = [];

            // Iterar sobre cada línea del archivo
            lines.slice(0, 1000).forEach(function(line, index) {
                var cols = line.split(',');
                if (cols.length === 2) { // Asegurarse de que la línea tenga dos valores separados por coma
                    var src = cols[0].trim();
                    var dst = cols[1].trim();

                    // Agregar nodos si no existen
                    if (!nodes.find(node => node.id === src)) {
                        nodes.push({ id: src, x: Math.random(), y: Math.random(), size: 3, color: '#008cc2' });
                    }
                    if (!nodes.find(node => node.id === dst)) {
                        nodes.push({ id: dst, x: Math.random(), y: Math.random(), size: 3, color: '#008cc2' });
                    }

                    // Agregar aristas
                    edges.push({ id: "e" + index, source: src, target: dst, color: '#00000030', type:'line', size:5 });
                }
            });
            console.log("Build objs")
            // Crear el objeto graph
            var graph = {
                nodes: nodes,
                edges: edges
            };

            // Load the graph in sigma
            s.graph.read(graph);

            // Add interactivity
            //s.bind('clickNode', function(e) {
            //    alert('Node clicked: ' + e.data.node.label);
            //});
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
            //var listener = s.configNoverlap(config);
            //s.startNoverlap();
        })
        .catch(error => console.error('Error fetching data:', error));
}                                                                                                                                                                    
    """,
    Output("dummy-output", "children"),
    Input("load-graph-button", "n_clicks"),
    prevent_initial_call=True,
)

if __name__ == "__main__":
    app.run_server(debug=True)
