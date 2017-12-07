'use strict';

const D3Tree = require('../dist/d3-tree');

let data = {
  image: null,
  text: '',
  children: [{
    image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
    text: 'test21',
    children: [{
      image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
      text: 'test31',
      children: []
    }]
  }, {
    image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
    text: 'test22',
    children: []
  }, {
    image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
    text: 'test23',
    children: []
  }]
};

var d3tree = window.d3tree = new D3Tree({
  selector: '#container',
  data: data,
  width: window.innerWidth,
  height: window.innerHeight,
  imageMaxHeight: 170,
  duration: 1000,
  marginRight: 300
});

d3tree.init();

document.querySelector('#append').addEventListener('click', () => {
  data.children[0].children.push({
    image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
    text: 'new',
    children: []
  });
  d3tree.update(data);
}, false);
