function loadGraphFromCSV(n_clicks) {
    fetch('/assets/data.csv') // Ruta al archivo en el servidor
        .then(response => response.text())
        .then(data => {
            var lines = data.split('\\n');
            var nodes = [];
            var links = [];

            // Iterar sobre cada línea del archivo
            lines.forEach(function (line, index) {//slice(0,100)
                var cols = line.split(',');
                if (cols.length === 2) { // Asegurarse de que la línea tenga dos valores separados por coma
                    var src = cols[0].trim();
                    var dst = cols[1].trim();

                    // Agregar nodos si no existen
                    if (!nodes.find(node => node.id === src)) {
                        nodes.push({ id: src, color: "#7ae620" });//
                    }
                    if (!nodes.find(node => node.id === dst)) {
                        nodes.push({ id: dst, color: "#7ae620" });
                    }

                    // Agregar aristas
                    links.push({ source: src, target: dst, color: "#acacac80" });
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
                linkColor: (l, i) => l.color,
                nodeColor: (n, i) => n.color,
                //linkWidth: (l, i) => 1000,
                events: {
                    onClick: node => { console.log('Clicked node: ', node) },
                }
            }
            const graph = new Pd(canvas, config)
            console.log("Success");
            const link_count = links.reduce((acc, val) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {});
            max_link_count = Math.max(...Object.values(link_count));
            graph.setData(nodes, Object.keys(link_count))
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
            }
            config.linkColor = (l, index) => {
                const colorStart = [73, 93, 152], colorEnd = [193, 93, 152];
                const interpolateColor = (start, end, ratio) => {
                    const result = [];
                    for (let i = 0; i < 3; i++) {
                        result.push(Math.round(start[i] + (end[i] - start[i]) * ratio));
                    }
                    return result;
                };

                const ratio = Math.log(link_count.get[l]) / Math.log(max_link_count);
                const colorInterpolated = interpolateColor(colorStart, colorEnd, ratio);
                return `rgb(${colorInterpolated.join(',')})`;
            }
            graph.setConfig(config);
        })
        .catch(error => console.error('Error fetching data:', error));
}