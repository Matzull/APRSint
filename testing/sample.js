import { scaleSymlog } from "d3-scale";
import {
    Cosmograph,
    CosmographInputConfig,
    CosmographSearch,
    CosmographTimeline,
    CosmographHistogram
} from "@cosmograph/cosmograph";
import { nodes, links, Node, Link } from "./data";
import "./styles.css";

const mainStyle = "overflow: auto; height: 100%; display: flex;";
const cosmographStyle = "overflow: auto; height: 100%; display: flex;";
const timelineStyle = "height: 80px; padding: 0.5rem;";
const searchStyle = "margin: 0 1rem;";
const sidebarStyle =
    "position: absolute; bottom: 70px; width: 350px; display: flex; flex-flow: column; margin: 5px; padding: 5px;";
const histogramWrapperStyle =
    "margin-left: 5px; padding: 3px; border-radius: 5px; background: rgb(34 34 34 / 70%);";
const histogramStyle = "height: 50px; background: none;";
const infoStyle =
    "margin: 8px; color: white; font-size: 14px; white-space: pre-line; display: none;";

const container = document.getElementById("example");

// Create an HTML timeline element  where the `CosmographSearch` will be rendered.
const searchElement = document.createElement("div");
searchElement.id = "search-container";
searchElement.style.cssText = searchStyle;
container?.appendChild(searchElement);

// Create center element where the `Cosmograph` and sidebar will be rendered.
const main = document.createElement("div");
main.id = "main-container";
main.style.cssText = mainStyle;
container?.appendChild(main);

// Create a sidebar where `CosmographHistogram` and node info will be rendered.
const sidebar = document.createElement("div");
sidebar.id = "sidebar-container";
sidebar.style.cssText = sidebarStyle;
container?.appendChild(sidebar);

// Create info element where info about selected Node will be rendered.
const infoElement = document.createElement("div");
infoElement.id = "info-container";
infoElement.style.cssText = infoStyle;
sidebar?.appendChild(infoElement);

// Create wrapper element for `CosmographHistogram`
const histogramWrapperElement = document.createElement("div");
histogramWrapperElement.id = "histogram-wrapper-container";
histogramWrapperElement.style.cssText = histogramWrapperStyle;
sidebar?.appendChild(histogramWrapperElement);

// Create center element where the `CosmographHistogram` and sidebar will be rendered.
const histogramElement = document.createElement("div");
histogramElement.id = "histogram-container";
histogramElement.style.cssText = histogramStyle;
document.documentElement.style.setProperty(
    "--cosmograph-histogram-background",
    "none"
);
histogramWrapperElement?.appendChild(histogramElement);

// Create an HTML Cosmograph element where the `Cosmograph` will be rendered.
const cosmographContainer = document.createElement("div");
cosmographContainer.id = "cosmograph-container";
cosmographContainer.style.cssText = cosmographStyle;
main?.appendChild(cosmographContainer);

// Create an HTML timeline element  where the `CosmographTimeline` will be rendered.
const timelineElement = document.createElement("div");
timelineElement.id = "timeline-container";
timelineElement.style.cssText = timelineStyle;
container?.appendChild(timelineElement);

// Cosmograph Config
const cosmographConfig: CosmographInputConfig<Node, Link> = {
    showTopLabels: true,
    curvedLinks: true,
    nodeSize: (n) => n.size ?? null,
    linkWidth: (l) => l.width ?? null,
    linkColor: (l) => l.color ?? null
};

const nodeColorScale = scaleSymlog < string, string> ()
    .range(["rgba(80, 105, 180, 0.75)", "rgba(240, 105, 180, 0.75)"])
    .clamp(true);

// Create a Cosmograph instance with the canvas element
const cosmograph = new Cosmograph < Node, Link> (
    cosmographContainer,
    cosmographConfig
);
// Create an instance for the `CosmographTimeline`
const timeline = new CosmographTimeline < Node > (
    cosmograph,
    timelineElement
);
// Create an instance for the `CosmographSearch`
const search = new CosmographSearch(cosmograph, searchElement);
// Create an instance for the `CosmographHistogram`
const histogram = new CosmographHistogram(cosmograph, histogramElement);

// Function for toggling selected node info
const toggleNodeInfo = (n?: Node): void => {
    if (n) {
        infoElement.style.display = "inherit";
        infoElement.innerHTML = `id: ${n.id}
    value: ${n.value}
  `;
    } else {
        infoElement.style.display = "none";
        infoElement.innerHTML = "";
    }
};
// Create custom onClick event for Cosmograph
const onCosmographClick = (n: Node | undefined): void => {
    search.clearInput();

    if (n) {
        cosmograph.selectNode(n);
        cosmographConfig.showLabelsFor = [n];
        cosmograph.setConfig(cosmographConfig);
        toggleNodeInfo(n);
    } else {
        cosmograph.unselectNodes();
        cosmographConfig.showLabelsFor = undefined;
        cosmographConfig.showTopLabels = true;
        cosmograph.setConfig(cosmographConfig);
        toggleNodeInfo();
    }
};

// Update Cosmograph config
cosmographConfig.onClick = onCosmographClick;
cosmograph.setConfig(cosmographConfig);

// Set the data for the Cosmograph instance
cosmograph.setData(nodes, links);
const nodeDegrees = cosmograph.getNodeDegrees()
nodeColorScale.domain([
    Math.min(...nodeDegrees),
    Math.max(...nodeDegrees),
])
cosmographConfig.nodeColor = (n, index) => {
    if (index === undefined) return null
    else {
        const degree = nodeDegrees[index]
        if (degree === undefined) return null
        else return nodeColorScale(degree)
    }
}
cosmograph.setConfig(cosmographConfig);

// Set initial config for `CosmographTimeline`
timeline.setConfig({ showAnimationControls: true });

// Set initial config for CosmographHistogram
histogram.setConfig({ barCount: 100 });

// Create custom onSelection event for `CosmographSearch`
const onSearchSelection = (n: Node): void => {
    toggleNodeInfo(n);
    cosmographConfig.showLabelsFor = [n];
    cosmograph.setConfig(cosmographConfig);
};

search.setConfig({ onSelectResult: onSearchSelection, maxVisibleItems: 20 });
