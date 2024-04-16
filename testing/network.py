from dash import Dash, html
import dash_cytoscape as cyto
import pandas as pd


def get_data(max_messages):
    df = pd.read_feather("messages.feather")  # .head(max_messages)
    print(df.columns)
    return df["src_station"].tolist(), df["dst_station"].tolist()


cyto.load_extra_layouts()
src_stations, dst_stations = get_data(1000)
nodes = [{"data": {"id": station}} for station in set(src_stations + dst_stations)]
# , "label": station
edges = [
    {"data": {"source": src, "target": dst}}
    for src, dst in set(zip(src_stations, dst_stations))
]

print(len(edges))

app = Dash(__name__)
app.layout = html.Div(
    [
        cyto.Cytoscape(
            id="cytoscape-two-nodes",
            layout={"name": "cola"},
            style={"width": "100%", "height": "500px"},
            elements=nodes + edges,
        )
    ]
)

if __name__ == "__main__":
    app.run(debug=True)
