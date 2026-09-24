import { useEffect } from 'react';
import { select } from 'd3-selection';

function DataPoints({ groupRef, data, xScale, yScale }) {
  useEffect(() => {
    if (!groupRef?.current) return;

    const group = select(groupRef.current);
    group.selectAll('.data-points').remove();

    if (!data?.length) return;

    const pointLayer = group.append('g').attr('class', 'data-points');

    pointLayer
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.7);
  }, [groupRef, data, xScale, yScale]);

  return null;
}

export default DataPoints;
