import { useEffect } from 'react';
import { select } from 'd3-selection';

function RegressionLine({ groupRef, slope, intercept, xScale, yScale, extent }) {
  useEffect(() => {
    if (!groupRef?.current) return;

    const group = select(groupRef.current);
    group.selectAll('.regression-line').remove();

    const x1 = extent[0];
    const y1 = slope * x1 + intercept;
    const x2 = extent[1];
    const y2 = slope * x2 + intercept;

    group
      .append('line')
      .attr('class', 'regression-line')
      .attr('x1', xScale(x1))
      .attr('y1', yScale(y1))
      .attr('x2', xScale(x2))
      .attr('y2', yScale(y2))
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .style('stroke-dasharray', '3, 3');
  }, [groupRef, slope, intercept, xScale, yScale, extent]);

  return null;
}

export default RegressionLine;
