import dash
from dash import dcc
from dash import html
import pandas as pd
from dash.dependencies import Input, Output, State

def create_div(id, children=[], classname=[]):
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

def 