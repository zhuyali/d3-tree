'use strict';

const d3 = require('d3');

class D3Tree {

  constructor(options) {
    this.tree = null;
    this.container = null;
    this.diagonal = null;
    this.options = Object.assign({
      width: 800,
      height: 600,
      duration: 0,
      selector: 'body',
      prefixClass: 'd3-tree',
      imageWidth: 100,
      imageHeight: 100,
      direction: 'vertical',
      data: []
    }, options);
  }

  init() {
    this.diagonal = d3.svg.diagonal();
    if (this.options.direction !== 'vertical') {
      this.diagonal = this.diagonal.projection(function(d) {
        return [d.y, d.x];
      });
    }
    this.tree = d3
      .layout
      .tree()
      .size([
        this.options.width - 2 * this.options.imageWidth,
        this.options.height - 2 * this.options.imageHeight
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
    var node = this.container
      .selectAll(`.${this.options.prefixClass}-node`);
    var link = this.container
      .selectAll(`.${this.options.prefixClass}-link`);
    var data = this.tree.nodes(this.options.data);
    var nodes = this.tree(this.options.data);
    node = node.data(data, d => {
      return d.id;
    });
    link = link.data(this.tree.links(nodes), d => {
      return `${d.source.id}-${d.target.id}`;
    });

    var container = node
      .enter()
      .append('g')
      .attr('class', `${this.options.prefixClass}-node`);

    container
      .append('image')
      .attr('class', `${this.options.prefixClass}-image`)
      .attr('xlink:href', d => {
        return d.data.image;
      })
      .attr(this.options.direction === 'vertical' ? 'x' : 'y', d => {
        return d.x - this.options.imageWidth / 2;
      })
      .attr(this.options.direction === 'vertical' ? 'y' : 'x', d => {
        return d.y;
      });

    container
      .append('text')
      .attr('fill', '#111')
      .attr('text-anchor', 'middle')
      .attr('class', `${this.options.prefixClass}-text`)
      .text(d => {
        return d.data.text;
      })
      .attr(this.options.direction === 'vertical' ? 'x' : 'y', d => {
        return d.x;
      })
      .attr(this.options.direction === 'vertical' ? 'y' : 'x', d => {
        return d.y + this.options.imageHeight + 30;
      });

    link
      .enter()
      .insert('path', `.${this.options.prefixClass}-node`)
      .attr('class', `${this.options.prefixClass}-link`)
      .attr('d', d => {
        var o = {
          x: d.source.px || this.options.width / 2,
          y: d.source.py || 10
        };
        return this.diagonal({
          source: o,
          target: o
        });
      });

    this.fireAnim();
  }

  update(options) {
    Object.assign(this.options, options);
    this.render();
  }

  fireAnim() {
    var transition = this.container
      .transition()
      .duration(this.options.duration);

    transition.selectAll(`.${this.options.prefixClass}-link`)
      .attr('d', this.diagonal);

    transition.selectAll(`.${this.options.prefixClass}-image`)
      .attr(this.options.direction === 'vertical' ? 'x' : 'y', d => {
        d.px = d.x - this.options.imageWidth / 2;
        return d.px;
      })
      .attr(this.options.direction === 'vertical' ? 'y' : 'x', d => {
        d.py = d.y;
        return d.py;
      });
    transition.selectAll(`.${this.options.prefixClass}-text`)
      .attr(this.options.direction === 'vertical' ? 'x' : 'y', d => {
        d.px = d.x;
        return d.px;
      })
      .attr(this.options.direction === 'vertical' ? 'y' : 'x', d => {
        d.py = d.y + this.options.imageHeight + 30;
        return d.py;
      });
  }
}

module.exports = D3Tree;
