'use strict';

const d3 = require('d3');

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
    this.imageHeight = 100;
    this.imageWidth = 100;
    this.transition = null;
    this.textLength = 0;
    this.options = Object.assign({
      width: 800,
      height: 600,
      duration: 0,
      selector: 'body',
      prefixClass: 'd3-tree',
      data: {},
      imageHeight: 200,
      imageWidth: 200,
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

  findMaxLayer(root, layer, maxLayerDepth) {
    if (root.children) {
      root.children.forEach(child => {
        let childTextLength = child.data.text ? child.data.text.length : 0;
        this.textLength = this.textLength < childTextLength ? childTextLength : this.textLength;
        maxLayerDepth[layer + 1]++;
        this.findMaxLayer(child, layer + 1, maxLayerDepth);
      });
    }
    return maxLayerDepth;
  }

  setImageMargin(root) {
    if (root.children) {
      let preChild = null;
      root.children.forEach(child => {
        if (preChild) {
          child.x = preChild.x + this.imageHeight + this.options.imageMargin;
        } else {
          child.x = root.x + this.imageHeight / 2 - (root.children.length * this.imageHeight + this.options.imageMargin * (root.children.length - 1)) / 2;
        }
        preChild = child;
        this.setImageMargin(child);
      });
    }
  }

  renderTree() {
    this.root = d3.hierarchy(this.options.data);
    this.layerDepth = Array(this.root.height + 1).fill(0);
    this.maxLayerDepth = this.findMaxLayer(this.root, 0, this.layerDepth);
    this.imageHeight = this.options.height / Math.max(...this.maxLayerDepth) >= this.options.imageHeight ?
      this.options.imageHeight :
      this.options.height / Math.max(...this.maxLayerDepth) - 10;
    this.imageWidth = this.imageHeight * this.options.imageWidth / this.options.imageHeight;
    this.tree = d3.tree().size([
      this.options.height,
      this.options.width - this.imageWidth - 10 * this.textLength
    ]);
    this.tree(this.root);
    this.setImageMargin(this.root);

    this.container.selectAll(`.${this.options.prefixClass}-link`)
      .data(this.root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', `${this.options.prefixClass}-link`)
      .attr('d', d => {
        return `M${d.y},${d.x}C${d.parent.y + this.imageWidth},${d.x} ${d.parent.y + this.imageWidth + 110},${d.parent.x} ${d.parent.y + this.imageWidth + 10},${d.parent.x}`;
      });

    var node = this.container.selectAll(`.${this.options.prefixClass}-node`)
      .data(this.root.descendants())
      .enter().append('g')
      .attr('class', `${this.options.prefixClass}-node`)
      .attr('transform', d => {
        return `translate(${d.y},${d.x})`;
      });

    var image = node.append('image')
      .attr('xlink:href', d => {
        return d.data.image;
      })
      .attr('height', d => {
        return this.imageHeight;
      })
      .attr('transform', d => {
        return `translate(3, ${-this.imageHeight / 2})`;
      });
    image.attr('width', d => {
      return this.imageWidth;
    });

    node
      .append('text')
      .attr('fill', '#111')
      .text(d => {
        return d.data.text;
      })
      .attr('transform', d => {
        if (d.data.image) {
          return `translate(${this.imageWidth + 10}, 4)`;
        } else {
          return `translate(${this.imageWidth / 2 - 2 * d.data.text.length}, 4)`;
        }
      });
  };

  update(data) {
    this.options.data = data;
    this.renderTree();
    this.transition = this.container.transition().duration(this.options.duration);
    this.transition.selectAll(`.${this.options.prefixClass}-link`)
      .attr('d', d => {
        return `M${d.y},${d.x}C${d.parent.y + this.imageWidth},${d.x} ${d.parent.y + this.imageWidth + 110},${d.parent.x} ${d.parent.y + this.imageWidth + 10},${d.parent.x}`;
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
      });
    this.transition.selectAll('image').attr('width', d => {
      return this.imageWidth;
    });
    this.transition.selectAll('text')
      .attr('transform', d => {
        if (d.data.image) {
          return `translate(${this.imageWidth + 10}, 4)`;
        } else {
          return `translate(${this.imageWidth / 2 - 2 * d.data.text.length}, 4)`;
        }
      });
  }
}

module.exports = D3Tree;
