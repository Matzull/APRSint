from dash import Dash, html, dcc
from dash.dependencies import Input, Output

app = Dash(
    __name__,
    assets_folder="assets",
)

app.layout = html.Div(
    [
        html.Div(id="dummy-output"),
        html.Div(id="search-bar"),
        html.Div(id="graph-canvas"),
        html.Div(id="graph-timeline"),
        html.Button(id="load-graph-button", children="Load Graph"),
    ]
)

app.clientside_callback(
    """
        function loadGraphFromCSV(n_clicks) {
        fetch('/assets/data.csv') // Ruta al archivo en el servidor
            .then(response => response.text())
            .then(data => {
                var lines = data.split('\\n');
                var nodes = [];
                var links = [];

                lines.forEach(function (line, index) {
                    var cols = line.split(',');
                    if (cols.length === 3) {
                        var src = cols[0].trim();
                        var dst = cols[1].trim();
                        var timestamp = cols[2].trim();

                        // Add nodes if they don't exist
                        if (!nodes.find(node => node.id === src)) {
                            nodes.push({ id: src});
                        }
                        if (!nodes.find(node => node.id === dst)) {
                            nodes.push({ id: dst});
                        }
                        
                        //Parse timestamp
                        const [datePart, timePart] = timestamp.split(' ');
                        const [year, month, day] = datePart.split('-').map(Number);
                        const [hour, minute, second] = timePart.split(':').map(Number);

                        //Create a date object
                        const date = new Date(year, month - 1, day, hour, minute, second);
                        
                        
                        // Add links
                        links.push({ source: src, target: dst, date: date});//, 
                    }
                });
                const graph_config = {
                    simulationGravity: 0.5,
                    simulationRepulsion: 1.5,
                    simulationRepulsionTheta: 1.15,
                    simulationLinkSpring: 0.1,
                    simulationLinkDistance: 5,
                    simulationFriction: 0.7,
                    renderLinks: true,
                    backgroundColor: "#343b46",
                }

                // Get containers and build graph
                const search_bar = document.getElementById('search-bar')
                const canvas = document.getElementById('graph-canvas')
                const graph_timeline = document.getElementById('graph-timeline')
                const graph = new cg(canvas, graph_config)
                graph.setData(nodes, [...new Set(links)])
                const search = new fg(graph, search_bar)
                const timeline = new hg(graph, graph_timeline)
                // Configure events
                
                graph_config.onClick = node => {
                    if (node) {
                        window.location.href = `/station?id=${node.id}`;
                    }
                    else
                    {
                        graph.unselectNodes()
                        search.clearInput()
                    }
                }
                
                //Get node with biggest degree
                const maxAdjacent = Math.max(...graph._data.nodes.map(n => graph.getAdjacentNodes(n.id).length));
                
                graph_config.nodeSize = (n, index) => {
                    const smallest = 5;
                    const bigest = 15;
                    const ratio = Math.log(graph.getAdjacentNodes(n.id).length) / Math.log(maxAdjacent + 0.1 * maxAdjacent)
                    return Math.round(smallest + (bigest - smallest) * ratio)
                }
                graph_config.nodeColor = (n, index) => {
                    const adjacentNodes = graph.getAdjacentNodes(n.id);
                    const colorStart = [73, 93, 152], colorEnd = [193, 93, 152];
                    const interpolateColor = (start, end, ratio) => {
                        const result = [];
                        for (let i = 0; i < 3; i++) {
                            result.push(Math.round(start[i] + (end[i] - start[i]) * ratio));
                        }
                        return result;
                    };
                    
                    const ratio = Math.log(adjacentNodes.length) / Math.log(maxAdjacent + 0.1 * maxAdjacent);
                    const colorInterpolated = interpolateColor(colorStart, colorEnd, ratio);
                    return `rgba(${colorInterpolated.join(',')}, 0.9)`;
                }

                //Get most repeating link
                const link_count = {};
                links.forEach(el => {
                    key = el.source + el.target;
                    link_count[key] = (link_count[key] || 0) + 1;
                });
                max_link_count = Math.max(...Object.values(link_count));
                
                graph_config.linkColor = (l, index) => {
                    const colorStart = [73, 93, 152, 0.8], colorEnd = [193, 93, 152, 1];
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
