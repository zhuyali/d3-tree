'use strict';

const d3 = require('d3');
const _ = require('lodash');

class D3Tree {

  constructor(options) {

    if (options.data.data && options.data.data.image) {
      options.data.image = options.data.data.image;
    }
    if (options.data.data && options.data.data.text) {
      options.data.text = options.data.data.text;
    }

    this._transtromTree(options.data.children);
    this.tree = null;
    this.root = null;
    this.container = null;
    this.layerDepth = null;
    this.maxLayerDepth = 0;
    this.resourceHeight = 100;
    this.resourceWidth = 100;
    this.transition = null;
    this.textLength = 0;
    this.fontSize = 14;
    this.lineHeight = 1.5;

    this.options = Object.assign({
      width: 800,
      height: 600,
      duration: 0,
      selector: 'body',
      prefixClass: 'd3-tree',
      data: {},
      resourceHeight: 200,
      resourceWidth: 200,
      imageMargin: 10
    }, options);
  }

  _transtromTree(suites) {
    suites && suites.forEach((suite, index) => {
      if (suite.data && suite.data.image) {
        suite.image = suite.data.image;
      }
      if (suite.data && suite.data.text) {
        suite.text = suite.data.text;
      }

      if (suite.children) {
        this._transtromTree(suite.children);
      }
    });
    return suites;
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

  multiline() {
    return selection => {
      selection.each(function (d, i) {
        let text = d3.select(this);
        const lines = (d.data.text || '').split(/\n/);
        const lineCount = lines.length;
        const isMulti = lineCount !== 1;
        for (let i = 0; i < lineCount; i++) {
          const line = lines[i];
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', isMulti ? '1.5em' : '0')
            .text(line);
        }
      });
    };
  }

  findMaxLayer(root, layer, maxLayerDepth) {
    if (root.children) {
      root.children.forEach(child => {
        let childTextLength = child.data.text ? child.data.text.length : 0;
        const lines = (child.data.text || '').split(/\n/);
        const lineCount = lines.length;
        const isMulti = lineCount !== 1;
        if (isMulti) {
          let line = _.maxBy(lines, line => escape(line).length);
          childTextLength = line.length;
        }
        this.textLength = this.textLength < childTextLength ? childTextLength : this.textLength;
        maxLayerDepth[layer + 1]++;
        this.findMaxLayer(child, layer + 1, maxLayerDepth);
      });
    }
    return maxLayerDepth;
  }

  checkResourceHeight(root) {
    if (root.children) {
      let imageMargin = root.children.length > 1 ? root.children[1].x - root.children[0].x : 0;
      if (this.resourceHeight + this.options.imageMargin > imageMargin && imageMargin) {
        this.resourceHeight = imageMargin - this.options.imageMargin;
        this.resourceWidth = this.resourceHeight * this.options.resourceWidth / this.options.resourceHeight;
      }
      root.children.forEach(child => {
        this.checkResourceHeight(child);
      });
    }
  }

  renderTree() {
    const that = this;
    this.root = d3.hierarchy(this.options.data);
    this.layerDepth = Array(this.root.height + 1).fill(0);
    this.maxLayerDepth = this.findMaxLayer(this.root, 0, this.layerDepth);
    this.resourceHeight = this.options.height / Math.max(...this.maxLayerDepth) >= this.options.resourceHeight ?
      this.options.resourceHeight :
      this.options.height / Math.max(...this.maxLayerDepth) - 10;
    this.resourceWidth = this.resourceHeight * this.options.resourceWidth / this.options.resourceHeight;
    this.tree = d3.tree().size([
      this.options.height,
      this.options.width - this.resourceWidth - this.fontSize * this.textLength
    ]);
    this.tree(this.root);
    this.checkResourceHeight(this.root);

    this
      .container
      .selectAll(`.${this.options.prefixClass}-link`)
      .data(this.root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', `${this.options.prefixClass}-link`)
      .attr('d', d => {
        return `M${d.y},${d.x}C${d.parent.y + this.resourceWidth},${d.x} ${d.parent.y + this.resourceWidth + 110},${d.parent.x} ${d.parent.y + this.resourceWidth + 10},${d.parent.x}`;
      });

    const node = this
      .container
      .selectAll(`.${this.options.prefixClass}-node`)
      .data(this.root.descendants())
      .enter()
      .append('g')
      .attr('class', `${this.options.prefixClass}-node`)
      .attr('transform', d => {
        return `translate(${d.y},${d.x})`;
      })
      .each(function(d) {
        let resourceList = d.data.image;
        if (resourceList && !!~resourceList.indexOf('[')) {
          resourceList = resourceList
            .replace(/(\[\n|\n\]| )/g, '')
            .split('\n');
        } else {
          resourceList = [resourceList];
        }

        const resourceWidth = that.resourceWidth / resourceList.length;
        const resourceHeight = that.resourceHeight / resourceList.length;

        resourceList.forEach((resource, index) => {
          if (resource && resource.endsWith('.webm')) {
            d3.select(this)
              .append('video')
              .attr('src', resource)
              .attr('type', 'video/webm')
              .attr('controls', 'controls')
              .attr('data-index', index)
              .attr('style', d => {
                return `width: ${resourceWidth}px; height: ${resourceHeight}px`;
              })
              .attr('transform', d => {
                return `translate(${resourceWidth * index}, -${resourceHeight / 2})`;
              });
          } else {
            d3.select(this)
              .append('image')
              .attr('xlink:href', resource)
              .attr('data-index', index)
              .attr('height', d => {
                return resourceHeight;
              })
              .attr('transform', d => {
                return `translate(${resourceWidth * index}, -${resourceHeight / 2})`;
              })
              .attr('width', d => {
                return resourceWidth;
              });
          }
        });
      });

    node
      .append('text')
      .attr('fill', '#111')
      .call(this.multiline())
      .attr('transform', d => {
        const lines = (d.data.text || '').split(/\n/);
        const lineCount = lines.length;
        const isMulti = lineCount !== 1;
        let heightHalf = isMulti ? this.fontSize * this.lineHeight * (lineCount + 1) / 2 : 0;
        if (d.data.image) {
          return `translate(${that.resourceWidth + 10}, ${-heightHalf})`;
        } else {
          const textLength = d.data && d.data.text && d.data.text.length || 0;
          return `translate(${that.resourceWidth / 2 - 2 * textLength}, ${-heightHalf})`;
        }
      });
  };

  update(data) {
    this.options.data = data;
    this.renderTree();
    this.transition = this.container.transition().duration(this.options.duration);
    this.transition.selectAll(`.${this.options.prefixClass}-link`)
      .attr('d', d => {
        return `M${d.y},${d.x}C${d.parent.y + this.resourceWidth},${d.x} ${d.parent.y + this.resourceWidth + 110},${d.parent.x} ${d.parent.y + this.resourceWidth + 10},${d.parent.x}`;
      });
    this.transition.selectAll(`.${this.options.prefixClass}-node`)
      .attr('transform', d => {
        return `translate(${d.y},${d.x})`;
      });
    this.transition.selectAll('text')
      .attr('transform', d => {
        if (d.data.image) {
          return `translate(${this.resourceWidth + 10}, 4)`;
        } else {
          const textLength = d.data && d.data.text && d.data.text.length || 0;
          return `translate(${this.resourceWidth / 2 - 2 * textLength}, 4)`;
        }
      });
  }
}

module.exports = D3Tree;
