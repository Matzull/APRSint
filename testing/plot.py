from dash import Dash, html, dcc
import networkx as nx
import pandas as pd
from plotly import graph_objects as go
import pickle


def get_data(max_messages):
    df = pd.read_feather("messages.feather")  # .head(max_messages)
    print(df.columns)
    return df


df = get_data(100)
A = list(df["src_station"].unique())
B = list(df["dst_station"].unique())
node_list = set(A + B)


G = nx.MultiGraph()
for i in node_list:
    G.add_node(i)
print("Nodes added")

# distinct edges
distinc_edges = set(
    [(row.src_station, row.dst_station) for row in df.itertuples(index=False)]
)
print(f"Total edges: {len(list(df.iterrows()))} Distinc edges: {len(distinc_edges)}")
for j in distinc_edges:
    G.add_edges_from([(j[0], j[1])])
print("Edges added")
pos = nx.spring_layout(G, k=0.5, iterations=50)
for n, p in pos.items():
    G.nodes[n]["pos"] = p
print("Position added")
edge_counts = {(edge[0], edge[1]): len(G.edges(edge[0], edge[1])) for edge in G.edges()}
max_degree = max(edge_counts.values())
edge_colors = [(edge / max_degree) * 5 for edge in edge_counts.values()]
traces = []
# Actualizar el grosor de las aristas y añadir las líneas a edge_trace
for i, ((src, dst), count) in enumerate(edge_counts.items()):
    traces.append(
        go.Scatter(
            x=[pos[src][0], pos[dst][0]],
            y=[pos[src][1], pos[dst][1]],
            hoverinfo="none",
            mode="lines",
            line=dict(width=edge_colors[i]),
        )
    )
edge_trace = traces
print("Edges modified")
node_trace = go.Scatter(
    x=[],
    y=[],
    text=[],
    mode="markers",
    hoverinfo="text",
    marker=dict(
        showscale=True,
        colorscale="RdBu",
        reversescale=True,
        color=[],
        size=15,
        colorbar=dict(
            thickness=10, title="Node Connections", xanchor="left", titleside="right"
        ),
        line=dict(width=0),
    ),
)
print("Base created")
x = [G.nodes[node]["pos"][0] for node in G.nodes()]
y = [G.nodes[node]["pos"][1] for node in G.nodes()]

node_trace["x"] += tuple(x)
node_trace["y"] += tuple(y)

print("Changing pos")
degrees = [G.degree[node] for node in G.nodes()]
node_info = [f"{node} # of connections: {G.degree[node]}" for node in G.nodes()]

node_trace["marker"]["color"] += tuple(degrees)
node_trace["text"] += tuple(node_info)
print("Style changed")
fig = go.Figure(
    data=[*edge_trace, node_trace],
    layout=go.Layout(
        title="<br>AT&T network connections",
        titlefont=dict(size=16),
        showlegend=False,
        hovermode="closest",
        margin=dict(b=20, l=5, r=5, t=40),
        annotations=[
            dict(text="No. of connections", showarrow=False, xref="paper", yref="paper")
        ],
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    ),
)


# with open('figure1.pkl', 'wb') as file:
#     pickle.dump(fig, file)
# with open('figure1.pkl', 'rb') as file:
#     fig = pickle.load(file)
fig.update_layout(width=1800, height=1000)
app = Dash(__name__)
app.layout = html.Div(
    [dcc.Graph(figure=fig, style={"height": "100%", "width": "100%"})],
    style={"height": "100%", "width": "100%"},
)

if __name__ == "__main__":
    app.run(debug=True)
