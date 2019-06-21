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
    this.imageHeight = 100;
    this.imageWidth = 100;
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

  checkImageHeight(root) {
    if (root.children) {
      let imageMargin = root.children.length > 1 ? root.children[1].x - root.children[0].x : 0;
      if (this.imageHeight + this.options.imageMargin > imageMargin && imageMargin) {
        this.imageHeight = imageMargin - this.options.imageMargin;
        this.imageWidth = this.imageHeight * this.options.imageWidth / this.options.imageHeight;
      }
      root.children.forEach(child => {
        this.checkImageHeight(child);
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
      this.options.width - this.imageWidth - this.fontSize * this.textLength
    ]);
    this.tree(this.root);
    this.checkImageHeight(this.root);

    this
      .container
      .selectAll(`.${this.options.prefixClass}-link`)
      .data(this.root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', `${this.options.prefixClass}-link`)
      .attr('d', d => {
        return `M${d.y},${d.x}C${d.parent.y + this.imageWidth},${d.x} ${d.parent.y + this.imageWidth + 110},${d.parent.x} ${d.parent.y + this.imageWidth + 10},${d.parent.x}`;
      });

    var node = this
      .container
      .selectAll(`.${this.options.prefixClass}-node`)
      .data(this.root.descendants())
      .enter()
      .append('g')
      .attr('class', `${this.options.prefixClass}-node`)
      .attr('transform', d => {
        return `translate(${d.y},${d.x})`;
      });

    node
      .append('image')
      .attr('xlink:href', d => {
        return d.data.image;
      })
      .attr('height', d => {
        return this.imageHeight;
      })
      .attr('transform', d => {
        return `translate(3, ${-this.imageHeight / 2})`;
      })
      .attr('width', d => {
        return this.imageWidth;
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
          return `translate(${this.imageWidth + 10}, ${-heightHalf})`;
        } else {
          const textLength = d.data && d.data.text && d.data.text.length || 0
          return `translate(${this.imageWidth / 2 - 2 * textLength}, ${-heightHalf})`;
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
          const textLength = d.data && d.data.text && d.data.text.length || 0
          return `translate(${this.imageWidth / 2 - 2 * textLength}, 4)`;
        }
      });
  }
}

module.exports = D3Tree;
