import React, {useRef, useEffect} from 'react';
import {PanelProps} from '@grafana/data';
import {SimpleOptions} from 'types';
import * as d3 from "d3";
import "./styles.css";

export interface compassData {
    gps: number,
    depth: number,
    speed: number,
    wind: number,
}

interface Props extends PanelProps<SimpleOptions> {
}

export const SimplePanel: React.FC<Props> = ({options, data, width, height}) => {


    const [compassData, setCompassData] = React.useState({
        gps: Math.floor(Math.random() ),
        depth: Math.floor(Math.random() ),
        speed: Math.floor(Math.random() ),
        wind: Math.floor(Math.random() )
    })
    let interval: any;
    const d3Container = useRef(null);
    React.useEffect(() => {
        if (!interval)
            interval = setInterval(() => {
                let {gps, depth, speed,wind} = compassData;
                gps = gps === 259 ? 0 : depth + 1;
                depth = depth === 152 ? 0 : depth + 1;
                speed = speed === 29 ? 0 : speed + 1;
                wind = wind === 19 ? 0 : wind + 1;
                setCompassData({
                    gps: gps,
                    depth: depth,
                    speed: speed,
                    wind: wind
                })

            }, 300);
        return () => {
            clearInterval(interval)
        }
    }, [compassData])

    useEffect(() => {

            if (d3Container.current) {
                var svgwidth = {width}.width;
                var svgheight = {height}.height;


                var radians = 0.0174532925;
                var radius = svgheight / 2.7;
                var margin = radius / 4;
                var tickStart = radius;
                var tickLength = -radius / 16;

                var labelRadius = radius - radius / 7;
                var labelYOffset = radius / 40;


                var tickScale = d3.scaleLinear()
                    .range([-compassData.gps, -compassData.gps + 259])
                    .domain([0, 259]);

                const drawCompass = () => {

                    var svg = d3.select(d3Container.current)
                        .attr("width", radius * 4)
                        .attr("height", svgheight)
                        .style("margin-left", svgwidth * 10 / 100);

                    d3.select(d3Container.current).selectAll("*").remove();

                    var face = svg.append('g')
                        .attr('transform', 'translate(' + (radius + margin * 2) + ',' + (radius + margin * 2) + ')');

                    var data = [1, 2, 3]
                    //circle
                    face.selectAll('.circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr('class', 'circle')
                        .attr("r", radius)
                        .attr('cx', 0)
                        .attr('cy', 0)
                        .style('stroke', 'white')
                        .style('stroke-width', 2)
                        .style('fill', 'none');

                    //tick
                    face.selectAll('.tick')
                        .data(d3.range(0, 360)).enter()
                        .append('line')
                        .style('fill', 'white')
                        .style('stroke', 'white')
                        .attr('stroke-width', function (d) {
                            if (d % 30 == 0) {
                                return 2;
                            } else {
                                return 1;
                            }
                        })
                        .attr('class', 'tick')
                        .attr('x1', 0)
                        .attr('x2', 0)
                        .attr('y1', tickStart)
                        .attr('y2', function (d) {
                            if (d % 30 == 0) {
                                return tickLength + tickStart - 4;
                            } else {
                                return tickLength + tickStart - 1;
                            }
                        })
                        .attr('transform', function (d) {
                            if (d % 5 == 0) {
                                return 'rotate(' + tickScale(d) + ')';
                            } else {
                                return null;
                            }


                        });


                    // label

                    face.selectAll('.tickLabel')
                        .data(d3.range(0, 331, 30))
                        .enter()
                        .append('text')
                        .style('fill', 'white')
                        .style('font-size', 15)
                        .attr('class', 'tickLabel')
                        .attr('x', function (d) {
                            return labelRadius * Math.sin(tickScale(d) * radians) - labelYOffset;
                        })
                        .attr('y', function (d) {
                            return -labelRadius * Math.cos(tickScale(d) * radians) + labelYOffset/2 ;
                        })
                        .text(function (d) {
                            return d;
                        });

                    //triagle


                    var sym = d3.symbol().type(d3.symbolTriangle).size(radius * 10);
                    face.selectAll('.triangle')
                        .data(data)
                        .enter()
                        .append("path")
                        .attr('class', 'triangle')
                        .attr("d", sym)
                        .attr("fill", "none")
                        .attr("stroke", "green")
                        .attr("stroke-width", 2)
                        .attr("x", radius + margin)
                        .attr("y", radius + margin * 2)

                     let arrowPoints = [[0, 0], [0, 20], [20, 10]];

                    face
                        .append('defs')
                        .append('marker')
                        .attr('id', 'arrow')
                        .attr('viewBox', [0, 0, 20, 20])
                        .attr('refX', 10)
                        .attr('refY', 10)
                        .attr("fill", "yellow")
                        .attr('markerWidth', 10)
                        .attr('markerHeight', 10)
                        .attr('orient', 'auto-start-reverse')
                        .append('path')
                        .attr('d', d3.line()(arrowPoints))
                        .attr('stroke', 'black');

                    face
                        .append('path')
                        .attr('d', d3.line()([[radius/2, -margin], [radius /3, -margin/2]]))
                        .attr('stroke', 'yellow')
                        .attr("fill", "yellow")
                        .attr('marker-end', 'url(#arrow)')

                    face.selectAll('.windLabel')
                        .data(data)
                        .enter()
                        .append('text')
                        .style('fill', 'white')
                        .attr('class', 'windLabel')
                        .style('font-size', 15)
                        .attr('x', radius/4)
                        .attr('y', -radius/3.5)
                        .text(compassData.wind + " kts");


                    face
                        .append('defs')
                        .append('marker')
                        .attr('id', 'arrow2')
                        .attr('viewBox', [0, 0, 20, 20])
                        .attr('refX', 10)
                        .attr('refY', 10)
                        .attr("fill", "blue")
                        .attr('markerWidth', 10)
                        .attr('markerHeight', 10)
                        .attr('orient', 'auto-start-reverse')
                        .append('path')
                        .attr('d', d3.line()(arrowPoints))
                        .attr('stroke', 'black');

                    face
                        .append('path')
                        .attr('d', d3.line()([[radius/2 - margin/1.5 , -margin], [radius /3 -margin/1.5, -margin/2]]))
                        .attr('stroke', 'blue')
                        .attr("fill", "blue")
                        .attr('marker-end', 'url(#arrow2)')

                    face.selectAll('.windLabel2')
                        .data(data)
                        .enter()
                        .append('text')
                        .style('fill', 'white')
                        .attr('class', 'windLabel2')
                        .style('font-size', 15)
                        .attr('stroke', 'none')
                        .attr('x', radius/2)
                        .attr('y', -radius/3.5)
                        .text(compassData.wind + " kts");







                    //degree box

                    face.selectAll('.degreeBox')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'degreeBox')
                        .attr('height', margin)
                        .attr('width', margin*1.25)
                        .attr("x", -margin / 2.17)
                        .attr("y", -radius - margin * 1.5)
                        .style('stroke', 'white')
                        .style('stroke-width', 2)
                        .style('fill', 'none');


                    face.selectAll('.degreeLabel')
                        .data(data)
                        .enter()
                        .append('text')
                        .style('fill', 'green')
                        .attr('class', 'degreeLabel')
                        .attr('text-anchor', 'large')
                        .style('font-size', 20)
                        .attr('x', -margin / 15)
                        .attr('y', (-radius - margin * 1.5) + (margin / 1.6))
                        .text(compassData.gps + " ° ");


                    //speed


                    var speedscale = d3.scaleLinear()
                        .domain([0, 30])
                        .range([radius + margin * 2, 0]);


                    var speed_axis = d3.axisRight(speedscale);
                    speed_axis.tickValues([0, 8, 15, 23, 30])


                    var left = svg.append("g")

                        .attr("transform", 'translate(' + (margin) + ',' + (radius - margin) + ')')
                        .style('font-size', 14)
                        .call(speed_axis)

                    left.selectAll('.speedLabel')
                        .data(data)
                        .enter()
                        .append('text')
                        .attr('class', 'speedLabel')
                        .style('fill', 'white')
                        .style('font-size', 20)
                        .style('fill', "green")
                        .attr('x', -margin / 3)
                        .attr('y', -margin / 2)
                        .text("Speed");

                    left.selectAll('.speedbox')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'speedbox')
                        .attr('height', 30)
                        .attr('width', 40)
                        .attr("x", -50)
                        .attr("y", (radius + margin * 2) - (radius + margin * 2) / 30 * compassData.speed - 30)
                        .style('stroke', 'white')
                        .style('stroke-width', 1)
                        .style('fill', 'none');

                    left.selectAll('.speedboxLabel')
                        .data(data)
                        .enter()
                        .append('text')
                        .attr('class', 'speedboxLabel')
                        .style('fill', 'white')
                        .style('font-size', 15)
                        .style('fill', "green")
                        .attr('x', -38)
                        .attr('y', (radius + margin * 2) - (radius + margin * 2) / 30 * compassData.speed - 10)
                        .text(compassData.speed);


                    //depth

                    var depthscale = d3.scaleLinear()
                        .domain([0, 152])
                        .range([radius + margin * 2, 0]);


                    var depth_axis = d3.axisLeft(depthscale);
                    depth_axis.tickValues([152, 114, 76, 38, 0])


                    var right = svg.append("g")
                        .attr("transform", 'translate(' + (radius * 3 - margin) + ',' + (radius - margin) + ')')
                        .style('font-size', 14)
                        .call(depth_axis)

                    right.selectAll('.depthLabel')
                        .data(data)
                        .enter()
                        .append('text')
                        .attr('class', 'depthLabel')
                        .style('fill', 'white')
                        .style('font-size', 20)
                        .style('fill', "green")
                        .attr('x', margin / 3)
                        .attr('y', -margin / 2)
                        .text("Depth");


                    right.selectAll('.depthbox')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('class', 'depthbox')
                        .attr('height', 30)
                        .attr('width', 40)
                        .attr("x", 10)
                        .attr("y", (radius + margin * 2) - (radius + margin * 2) / 152 * compassData.depth - 28)
                        .style('stroke', 'white')
                        .style('stroke-width', 1)
                        .style('fill', 'none');

                    right.selectAll('.depthboxLabel')
                        .data(data)
                        .enter()
                        .append('text')
                        .attr('class', 'depthboxLabel')
                        .style('fill', 'white')
                        .style('font-size', 15)
                        .style('fill', "green")
                        .attr('x', 40)
                        .attr('y', (radius + margin * 2) - (radius + margin * 2) / 152 * compassData.depth - 8)
                        .text(compassData.depth);


                };


                drawCompass();
            }

        },
        [width, height, compassData]);

    return <svg ref={d3Container} width={width} height={height}></svg>;

};