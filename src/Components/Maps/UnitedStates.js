import React, { useEffect } from 'react'
import * as d3 from 'd3'
import { statesVisited} from './StatesVisited.js';
import { stateInfo } from "./StateInfo.js";
let us = require('./us-states.json');

export default function UnitedStates() {
    let stateColors = ["#D4D4D8", "#1D4ED8", "#15803D"];

    function drawMap() {
        
        d3.select("#tooltip")
            .style("visibility", "hidden")

        let projection = d3.geoAlbersUsa()
        let path = d3.geoPath().projection(projection);
        
        d3.select("#united-states").select("svg").remove();

        let svg = d3.select("#united-states")
            .append("svg")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("viewBox", "0 0 975 610")
            .style("position", "absolute")
        
        svg.selectAll("path")
            .data(us.features)
            .enter()
            .append("path")
            .attr("class", "map-state")
            .attr("id", d => "map-state-" + d.properties.name)
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "2")
            .style("fill", d => stateColor(d.properties.name))
            .on("mouseover", (d, i) => handleMouseover(d, i))
            .on("mouseout", handleMouseout)
        
    }

    function stateColor(state) {
        return stateColors[statesVisited.get(state)];
    }

    function handleMouseover(d, i) {
        if (statesVisited.get(i.properties.name) !== 0) {

            d3.selectAll(".map-state")
                .style("opacity", .2);

            d3.selectAll("#map-state-" + i.properties.name)
                .style("opacity", 1);

            d3.select(".tooltip-contents").remove();

            console.log(d.pageX);
            let tooltipContents = d3.select("#tooltip")
                .style("visibility", "visible")
                .style("top", (d.pageY + 10).toString() + "px")
                .style("left", () => {
                    let width = window.innerWidth;
                    if (width < 640) {
                        return Math.min(d.pageX + 10, width * .25).toString() + "px";
                    }
                    else if (width < 768) {
                        return Math.min(d.pageX + 10, width * .5).toString() + "px";
                    }
                    else {
                        return (d.pageX + 10).toString() + "px";
                    }
                })
                .append("div")
                .attr("class", "tooltip-contents");
            
            let hoverStateInfo = stateInfo.get(i.properties.name);

            for (let i = 0; i < hoverStateInfo.length; i++) {
                let row = tooltipContents
                    .append("div")
                    .attr("class", "flex")
                    
                row
                    .append("div")
                    .attr("class", "font-bold mr-1 whitespace-nowrap")
                    .text(hoverStateInfo[i][0] + ": ");
                
                row
                    .append("div")
                    .text(hoverStateInfo[i][1])
            }

        }
    }

    function handleMouseout() {
        d3.selectAll(".map-state")
            .style("opacity", 1);

        d3.select("#tooltip")
            .style("visibility", "hidden")
    }

    useEffect(() => {
        drawMap();
    }, []);

    return (
        <React.Fragment>
            <div id="united-states" className="w-5/6 h-100 md:w-2/3 mx-auto relative"></div>
            <div id="tooltip" className="absolute p-5 bg-white border-yellow-300 border-2 text-gray-600 rounded-lg shadow-lg z-10 left-1/2"></div>
        </React.Fragment>
    )
}