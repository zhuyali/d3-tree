'use strict';

const d3 = require('d3');

export default class D3Tree {

  constructor(options) {
    this.tree = null;
    this.root = null;
    this.container = null;
    this.layerDepth = null;
    this.maxLayerDepth = 0;
    this.imageHeight = 100;
    this.transition = null;
    this.options = Object.assign({
      width: 800,
      height: 600,
      duration: 0,
      selector: 'body',
      prefixClass: 'd3-tree',
      imageMaxHeight: 100,
      data: {},
      marginRight: 0
    }, options);
  }

  init() {
    this.container = d3
      .select(this.options.selector)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .append('g');
    this.renderTree();
  }

  traversal(root, layer, maxLayerDepth) {
    if (root.children) {
      root.children.forEach(child => {
        maxLayerDepth[layer + 1]++;
        this.traversal(child, layer + 1, maxLayerDepth);
      });
    }
    return maxLayerDepth;
  } 

  renderTree() {
    this.root = d3.hierarchy(this.options.data);
    this.layerDepth = Array(this.root.height + 1).fill(0);
    this.maxLayerDepth = this.traversal(this.root, 0, this.layerDepth);
    this.imageHeight = this.options.height / (1.03 * Math.max(...this.maxLayerDepth)) > this.options.imageMaxHeight
      ? this.options.imageMaxHeight
      : this.options.height / (1.03 * Math.max(...this.maxLayerDepth));    
    this.tree = d3.tree().size([this.options.height, this.options.width - this.options.marginRight]);
    this.tree(this.root);
    var link = this.container.selectAll(`.${this.options.prefixClass}-link`)
      .data(this.root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', `${this.options.prefixClass}-link`)
      .attr('d', d => {
        return `M${d.y},${d.x}C${d.parent.y + this.imageHeight + 110},${d.x} ${d.parent.y + this.imageHeight + 110},${d.parent.x} ${d.parent.y + this.imageHeight + 10},${d.parent.x}`;
      });

    var node = this.container.selectAll(`.${this.options.prefixClass}-node`)
      .data(this.root.descendants())
      .enter().append('g')
      .attr('class', `${this.options.prefixClass}-node`)
      .attr('transform', d => {
        return `translate(${d.y},${d.x})`;
      });

    node.append('image')
      .attr('xlink:href', d => {
        return d.data.image;
      })
      .attr('height', d => {
        return this.imageHeight;
      })
      .attr('transform', d => { 
        return `translate(3, ${-this.imageHeight / 2})`; 
      });
  };

  update(data) {
    this.options.data = data;
    this.renderTree();
    this.transition = this.container.transition().duration(this.options.duration);    
    this.transition.selectAll(`.${this.options.prefixClass}-link`)
      .attr('d', d => {
        return `M${d.y},${d.x}C${d.parent.y + this.imageHeight + 110},${d.x} ${d.parent.y + this.imageHeight + 110},${d.parent.x} ${d.parent.y + this.imageHeight + 10},${d.parent.x}`;
      });
    this.transition.selectAll(`.${this.options.prefixClass}-node`)
      .attr('transform', d => { 
        return `translate(${d.y},${d.x})`;
      });
    this.transition.selectAll('image')
      .attr('height', d => {
        return this.imageHeight;
      })
      .attr('transform', d => {
        return `translate(3, ${-this.imageHeight / 2})`;
      });;
  }
}
