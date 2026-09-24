import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import Axes from './Axes';
import DataPoints from './DataPoints';
import RegressionLine from './RegressionLine';

function ScatterPlot({ data, slope, intercept, xLabel = 'X Value', yLabel = 'Y Value' }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const groupRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: 500,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = wrapper.clientWidth - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    groupRef.current = chartGroup.node();
  }, [data, dimensions]);

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  const xMax = max(data, (d) => d.x) || 1;
  const yMax = max(data, (d) => d.y) || 1;
  const extent = [0, Math.max(xMax, yMax) * 1.1];

  const xScale = scaleLinear().domain(extent).range([0, width]);
  const yScale = scaleLinear().domain(extent).range([height, 0]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '500px' }}>
      <svg ref={svgRef}></svg>
      <Axes groupRef={groupRef} xScale={xScale} yScale={yScale} width={width} height={height} xLabel={xLabel} yLabel={yLabel} />
      <DataPoints groupRef={groupRef} data={data} xScale={xScale} yScale={yScale} />
      <RegressionLine groupRef={groupRef} slope={slope} intercept={intercept} xScale={xScale} yScale={yScale} extent={extent} />
    </div>
  );
}

export default ScatterPlot;
