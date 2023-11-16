from dash import html


def create_div(id, children=[], classname="no-class"):
    div = html.Div(id=id, children=children, className=classname)
    return div


def create_title(title, category=1):
    if category == 1:
        title = html.H1(children=title)
    elif category == 2:
        title = html.H2(children=title)
    elif category == 3:
        title = html.H3(children=title)
    elif category == 4:
        title = html.H4(children=title)
    return title


def create_paragraph(text):
    paragraph = html.P(children=text)
    return paragraph
