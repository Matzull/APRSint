function loadGraphFromCSV(n_clicks) {
    fetch('/assets/data.csv') // Ruta al archivo en el servidor
        .then(response => response.text())
        .then(data => {
            var lines = data.split('\\n');
            var nodes = [];
            var links = [];

            lines.forEach(function (line, index) {
                var cols = line.split(',');
                if (cols.length === 2) {
                    var src = cols[0].trim();
                    var dst = cols[1].trim();

                    // Add nodes if they don't exist
                    if (!nodes.find(node => node.id === src)) {
                        nodes.push({ id: src, color: "#7ae620" });//
                    }
                    if (!nodes.find(node => node.id === dst)) {
                        nodes.push({ id: dst, color: "#7ae620" });
                    }

                    // Add links
                    links.push({ source: src, target: dst, color: "#acacac80" });
                }
            });
            const config = {
                simulation: {
                    gravity: 1,
                    repulsion: 2,
                    repulsionTheta: 1.15,
                    linkSpring: 0.01,
                    friction: 0.85
                },
                renderLinks: true,
                backgroundColor: "#343b46",
                events: {
                    onClick: node => {
                        if (node) {
                            window.location.href = `/station?id=${node.id}`;
                        }
                    }
                }
            }

            // Get containers and build graph
            const search_bar = document.getElementById('search-bar')
            const canvas = document.getElementById('graph-canvas')
            const graph = new cg(canvas, config)
            graph.setData(nodes, [...new Set(links)])
            const search = new fg(graph, search_bar)
            
            //Get node with biggest degree
            const maxAdjacent = Math.max(...graph._data.nodes.map(n => n.Degree()));//graph.getAdjacentNodes(n.id).length
            
            config.nodeSize = (n, index) => {
                const ratio = Math.log(n.Degree()) / Math.log(maxAdjacent + 0.1 * maxAdjacent)
                return Math.round(5 + (20 - 5) * ratio)
            }
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
                
                const ratio = Math.log(adjacentNodes.length) / Math.log(maxAdjacent + 0.1 * maxAdjacent);
                const colorInterpolated = interpolateColor(colorStart, colorEnd, ratio);
                return `rgba(${colorInterpolated.join(',')}, 0.8)`;
            }

            //Get most repeating link
            const link_count = {};
            links.forEach(el => {
                key = el.source + el.target;
                link_count[key] = (link_count[key] || 0) + 1;
            });
            max_link_count = Math.max(...Object.values(link_count));
            
            config.linkColor = (l, index) => {
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

            config.linkWidth = (l, index) => {
                const ratio = Math.log(link_count[l.source + l.target]) / Math.log(max_link_count);
                return 1 + 3 * ratio;
            }

            graph.setConfig(config);
        })
        .catch(error => console.error('Error fetching data:', error));
}