from dash import Dash, html, dcc
from dash.dependencies import Input, Output

app = Dash(
    __name__,
    assets_folder="assets",
)

app.layout = html.Div(
    [
        html.Div(id="dummy-output"),
        html.Canvas(id="graph-canvas", style={"width": "100%", "height": "95vh"}),
        html.Button(id="load-graph-button", children="Load Graph"),
    ]
)

app.clientside_callback(
    """ function loadGraphFromCSV(n_clicks) {    
            fetch('/assets/data.csv') // Ruta al archivo en el servidor
                .then(response => response.text())
                .then(data => {
                var lines = data.split('\\n');
                var nodes = [];
                var links = [];

                // Iterar sobre cada línea del archivo
                lines.forEach(function(line, index) {//slice(0,100)
                    var cols = line.split(',');
                    if (cols.length === 2) { // Asegurarse de que la línea tenga dos valores separados por coma
                        var src = cols[0].trim();
                        var dst = cols[1].trim();

                        // Agregar nodos si no existen
                        if (!nodes.find(node => node.id === src)) {
                            nodes.push({id: src, color: "#7ae620"});//
                        }
                        if (!nodes.find(node => node.id === dst)) {
                            nodes.push({id: dst, color: "#7ae620"});
                        }

                        // Agregar aristas
                        links.push({source: src, target: dst, color: "#acacac80"});
                    }
                });
                const canvas = document.getElementById('graph-canvas')
                const config = {
                    simulation: {
                        gravity: 0.35,
                        repulsion: 1,
                        repulsionTheta: 1.15,
                        linkSpring: 0.1,
                        friction: 0.85
                    },
                    renderLinks: true,
                    //backgroundColor: #008cc2,
                    linkColor: (l,i) => l.color,
                    nodeColor: (n,i) => n.color,
                    //linkWidth: (l, i) => 1000,
                    events: {
                        onClick: node => { console.log('Clicked node: ', node) },
                    }
                }
                const graph = new Pd(canvas, config)
                const link_count = {};
                links.forEach(el => {
                    key = el.source + el.target;
                    link_count[key] = (link_count[key] || 0) + 1;
                });
                console.log("Len is", [...Object.keys(link_count)].length)
                max_link_count = Math.max(...Object.values(link_count));
                graph.setData(nodes, [...new Set(links)])
                //graph.setData(nodes, links)
                config.nodeSize = (n, index) => {
                    return (graph.getAdjacentNodes(n.id).length * 0.05) + 5
                }
                const maxAdjacent = Math.max(...graph.graph.nodes.map(n => graph.getAdjacentNodes(n.id).length));
                config.nodeColor = (n, index) => {
                    const adjacentNodes = graph.getAdjacentNodes(n.id);
                    const colorStart = [73, 93, 152], colorEnd = [193, 93, 152];
                    const interpolateColor = (start, end, ratio) => {
                    const result = [];
                        for (let i = 0; i < 3; i++) {
                            result.push(Math.round(start[i] + (end[i] - start[i]) * ratio));
                        }
                    return result;
                    };

                    const ratio = Math.log(adjacentNodes.length) / Math.log(maxAdjacent);
                    const colorInterpolated = interpolateColor(colorStart, colorEnd, ratio);
                    return `rgb(${colorInterpolated.join(',')})`;
                }
                
                console.log("Self is", link_count, "Max is", max_link_count)
                config.linkColor = (l, index) => {
                    const colorStart = [172, 172, 172, 0.5], colorEnd = [193, 93, 152, 0.9];
                    const interpolateColor = (start, end, ratio) => {
                        const result = [];
                        for (let i = 0; i < 4; i++) {
                            result.push(Math.round(start[i] + (end[i] - start[i]) * ratio));
                        }
                        return result;
                    };
                    const ratio = link_count[l.source+l.target] /max_link_count;
                    const colorInterpolated = interpolateColor(colorStart, colorEnd, ratio);
                    return `rgba(${colorInterpolated.join(',')})`;
                }
                
                graph.setConfig(config);
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
