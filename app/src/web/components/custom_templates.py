import plotly.graph_objects as go

ligh_mode = go.layout.Template(
    layout=dict(
        title=dict(font=dict(family="Arial, sans-serif", size=24, color="#0d6efd")),
        xaxis=dict(
            title=dict(
                font=dict(family="Courier New, monospace", size=18, color="#198754")
            )
        ),
        yaxis=dict(
            title=dict(
                font=dict(family="Courier New, monospace", size=18, color="#198754")
            )
        ),
    )
)

dark_mode = go.layout.Template(
    layout=dict(
        title=dict(font=dict(family="Arial, sans-serif", size=24, color="#0d6efd")),
        xaxis=dict(
            title=dict(
                font=dict(family="Courier New, monospace", size=18, color="#198754")
            )
        ),
        yaxis=dict(
            title=dict(
                font=dict(family="Courier New, monospace", size=18, color="#198754")
            )
        ),
    )
)
