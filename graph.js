

const margin = { top: 40, right: 20, bottom: 50, left: 100 }
const graphWidth = 560 - margin.right - margin.left;
const graphHeight = 400 - margin.top - margin.bottom;
const svg = d3.select('.canvas')
    .append('svg')
        .attr('width', graphWidth + margin.left + margin.right)
        .attr('height', graphHeight + margin.top + margin.bottom);

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// set scales 
const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

//axes groups

const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis');

// d3 line path generator 
const line  = d3.line()
    .x(function(d) { return x(new Date(d.date))})
    .y(function(d) { return y(d.amount)});

const path =  graph.append('path');


const update = (data) => {

    //creates new data with only data points related to current lift
    data = data.filter(item => item.activity === activity);
    data = data.sort((a,b) => new Date(a.date ) - new Date(b.date));

    // set scale domains
    x.domain(d3.extent(data, d => new Date(d.date)));
    y.domain([0, d3.max(data, d=> d.amount)]);
    // create graph points

    // update paths 
    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', '#00bfa5')
        .attr('stroke-width', 2)
        .attr('d', line)

    //update path data 
    const circles = graph.selectAll('circle')
        .data(data);

    // remove unwanted points
    circles.exit().remove();

    // update current points
    circles
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => d.amount);

    // add mew points
    circles.enter()
    .append('circle')
        .attr('r', 4)
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => d.amount)
        .attr('fill', 'white');

    // create axies
    const xAxis = d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d3.timeFormat('%b %d'))


    const yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => d + "Lbs")
    //call axes on 

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    //rotate axis text 

    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end');


};

// data and firestore
var data = [];

db.collection('lifts').onSnapshot(res => {
    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id};

        switch(change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified': 
                const index = data.findIndex(item => item.id == doc.id)
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    });
    update(data)
})