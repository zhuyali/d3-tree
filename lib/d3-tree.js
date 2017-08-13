'use strict';

const d3 = require('d3');

class TreeNode {

  constructor(options) {
    this.options = Object.assign({
      children: [],
      parent: null,
      data: null
    }, options);
  }
}

class D3Tree {

  constructor(options) {
    this.options = Object.assign({
      width: 400,
      height: 300,
      duration: 1000,
      selector: 'body',
      data: []
    }, options);
  }

  init() {
    this.render();
  }

  render() {
    var tree = d3
      .layout
      .tree()
      .size([
        this.options.width - 20,
        this.options.height - 20
      ]);

    var root = {};
    var nodes = tree(root);

    root.parent = root;
    root.px = root.x;
    root.py = root.y;
    var diagonal = d3
      .svg
      .diagonal();

    var svg = d3
      .select(this.options.selector)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .append('g')
      .attr('transform', 'translate(10, 10)');

    var node = svg
      .selectAll('.node');
    var link = svg
      .selectAll('.link');

    var timer = setInterval(() => {
      if (nodes.length >= 10) {
        return clearInterval(timer);
      }

      var n = {
        id: nodes.length
      };
      var p = nodes[Math.random() * nodes.length | 0];

      if (p.children) {
        p.children.push(n);
      } else {
        p.children = [n];
      }
      nodes.push(n);

      node = node.data(tree.nodes(root), function(d) {
        return d.id;
      });
      link = link.data(tree.links(nodes), function(d) {
        return d.source.id + '-' + d.target.id;
      });

      node
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 4)
        .attr('cx', function(d) {
          return d.parent.px;
        })
        .attr('cy', function(d) {
          return d.parent.py;
        });

      /*
      node
        .enter()
        .append('image')
        .attr('class', 'node')
        .attr('width', 200)
        .attr('height', 100)
        .attr('xlink:href', 'https://images2015.cnblogs.com/news/24442/201707/24442-20170718132533661-166801094.jpg')
        .attr('x', function(d) {
          return d.parent.px;
        })
        .attr('y', function(d) {
          return d.parent.py;
        });

        */

      link
        .enter()
        .insert('path', '.node')
        .attr('class', 'link')
        .attr('d', function(d) {
          var o = {
            x: d.source.px,
            y: d.source.py
          };
          return diagonal({
            source: o,
            target: o
          });
        });

      var t = svg
        .transition()
        .duration(this.options.duration);

      t.selectAll('.link')
        .attr('d', diagonal);

      t.selectAll('.node')
        .attr('cx', function(d) {
          return d.px = d.x;
        })
        .attr('cy', function(d) {
          return d.py = d.y;
        });
    }, this.options.duration);
  }
}

module.exports = D3Tree;
module.exports.TreeNode = TreeNode;
