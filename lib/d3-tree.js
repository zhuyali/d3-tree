'use strict';

const d3 = require('d3');

export default class D3Tree {

  constructor(options) {
    this.tree = null;
    this.container = null;
    this.isVertical = true;
    this.options = Object.assign({
      width: 800,
      height: 600,
      duration: 0,
      selector: 'body',
      prefixClass: 'd3-tree',
      imageWidth: 100,
      imageHeight: 100,
      direction: 'vertical',
      margin: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },
      data: []
    }, options);
  }

  init() {
    this.isVertical = this.options.direction === 'vertical';

    if (this.isVertical) {
      this.diagonal = d3
        .linkVertical()
        .x(d => {
          return d.x;
        })
        .y(d => {
          return d.y;
        });
    } else {
      this.diagonal = d3
        .linkHorizontal()
        .x(d => {
          return d.y;
        })
        .y(d => {
          return d.x;
        });
    }
    this.tree = d3
      .tree()
      .size(
      this.isVertical ?
        [
          this.options.width - this.options.margin.left - this.options.margin.right - 2 * this.options.imageWidth,
          this.options.height - this.options.margin.top - this.options.margin.bottom - 2 * this.options.imageHeight
        ] : [
          this.options.height - this.options.margin.top - this.options.margin.bottom - 2 * this.options.imageHeight,
          this.options.width - this.options.margin.left - this.options.margin.right - 2 * this.options.imageWidth
        ]);
    this.container = d3
      .select(this.options.selector)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .append('g')
      .attr('transform', `translate(${this.options.imageWidth / 2}, ${this.options.imageHeight / 2})`);
    this.render();
  }

  render() {
    var nodesData = this.tree(d3.hierarchy(this.options.data, d => {
      return d.children;
    }));
    this.container.selectAll(`.${this.options.prefixClass}-node`).remove();
    this.container.selectAll(`.${this.options.prefixClass}-link`).remove();
    var node = this.container
      .selectAll(`.${this.options.prefixClass}-node`);
    var link = this.container
      .selectAll(`.${this.options.prefixClass}-link`);
    var container = node
      .data(nodesData.descendants())
      .enter()
      .append('g')
      .attr('class', `${this.options.prefixClass}-node`);

    container
      .append('image')
      .attr('class', `${this.options.prefixClass}-image`)
      .attr('xlink:href', d => {
        return d.data.data.image;
      })
      .attr(this.isVertical ? 'x' : 'y', d => {
        return d.x - this.options.imageWidth / 2;
      })
      .attr(this.isVertical ? 'y' : 'x', d => {
        return d.y;
      });

    container
      .append('text')
      .attr('fill', '#111')
      .attr('text-anchor', 'middle')
      .attr('class', `${this.options.prefixClass}-text`)
      .text(d => {
        return d.data.data.text;
      })
      .attr(this.isVertical ? 'x' : 'y', d => {
        return d.x;
      })
      .attr(this.isVertical ? 'y' : 'x', d => {
        return d.y + this.options.imageHeight + 30;
      });

    link
      .data(nodesData.descendants().slice(1))
      .enter()
      .insert('path', `.${this.options.prefixClass}-node`)
      .attr('class', `${this.options.prefixClass}-link`)
      .attr('d', d => {
        return this.isVertical ?
          `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}` :
          `M${d.y},${d.x}C${(d.y + d.parent.y) / 2},${d.x} ${(d.y + d.parent.y) / 2},${d.parent.x} ${d.parent.y},${d.parent.x}`;
      });
    // this.fireAnim();
  }

  update(options) {
    Object.assign(this.options, options);
    this.render();
  }

  fireAnim() {
    var transition = this
      .container
      .transition()
      .duration(this.options.duration);

    transition
      .selectAll(`.${this.options.prefixClass}-link`)
      .attr('d', d => {
        return this.isVertical ?
          `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}` :
          `M${d.y},${d.x}C${(d.y + d.parent.y) / 2},${d.x} ${(d.y + d.parent.y) / 2},${d.parent.x} ${d.parent.y},${d.parent.x}`;
      });

    transition
      .selectAll(`.${this.options.prefixClass}-image`)
      .attr(this.isVertical ? 'x' : 'y', d => {
        d.x = d.x - this.options.imageWidth / 2;
        return d.x;
      })
      .attr(this.isVertical ? 'y' : 'x', d => {
        return d.y;
      });
  }
}
