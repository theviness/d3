const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 460 + 300 - margin.left - margin.right,
    height = 400 + 100 - margin.top - margin.bottom;

const svg = d3
    .select('#viz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

d3.csv(
    'https://raw.githubusercontent.com/spiderero2110/d3/master/dependent_count_2.csv',
).then(function (data) {
    // Calculate the average value
    const averageValue = d3.mean(data, (d) => +d.Value);

    // X axis
    const x = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.Dependent_count))
        .padding(0.2);
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('stroke-opacity', 0)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'middle')
        .style('fill', 'black')
        .style('font-family', 'Work Sans')
        .style('font-size', 18);

    svg.append('text')
        .attr(
            'transform',
            `translate(${width / 2}, ${height + margin.top + 20})`,
        )
        .style('text-anchor', 'middle')
        .style('fill', 'black')
        .style('font-size', '20')
        .text('Số người phụ thuộc');

    // Y axis
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => +d.Value)])
        .range([height, 0]);

    svg.append('g')
        .call(d3.axisLeft(y))
        .attr('class', 'y-axis')
        .selectAll('text')
        .style('font-family', 'Work Sans')
        .style('font-size', 18)
        .style('margin-left', '30')
        .style('fill', 'black');

    // Bars
    svg.selectAll('bar')
        .data(data)
        .join('rect')
        .attr('x', (d) => x(d.Dependent_count))
        .attr('y', height)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('fill', '#6432c7')
        .transition()
        .duration(800)
        .attr('y', (d) => y(+d.Value))
        .attr('height', (d) => height - y(+d.Value))
        .delay(function (d, i) {
            return i * 100;
        });

    svg.selectAll('.bar-label')
        .data(data)
        .join('text')
        .attr('class', 'bar-label')
        .attr('x', (d) => x(d.Dependent_count) + x.bandwidth() / 2)
        .attr('y', (d) => y(+d.Value) - 5 + 35)
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .style('font-size', '18px')
        .text((d) => d.Value);

    // Average line
    setTimeout(function () {
        svg.append('line')
            .attr('x1', 60)
            .attr('y1', y(averageValue))
            .attr('x2', width + 100)
            .attr('y2', y(averageValue))
            .attr('stroke', 'gray')
            .attr('stroke-width', '1')
            .style('opacity', 0)
            .transition()
            .duration(800)
            .style('opacity', 1);
    }, data.length * 100);

    svg.append('text')
        .attr('x', width + 30)
        .attr('y', y(averageValue) - 10)
        .attr('text-anchor', 'end')
        .style('fill', 'gray')
        .style('font-size', '20')
        .style('font-weight', 200)
        .text('Trung bình = ' + 1 + ',' + 688);
});
