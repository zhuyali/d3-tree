'use strict';

const D3Tree = require('../dist/d3-tree');

const testImg = 'https://avatars2.githubusercontent.com/u/9263023?s=200&v=4';
let data = {
  data: {
    image: testImg,
    text: 'test1',
  },
  children: [{
    data: {
      image: testImg,
      text: 'test11',
    },
    children: [{
      data: {
        image: testImg,
        text: 'test111',
      },
      children: []
    }]
  }, {
    data: {
      image: testImg,
      text: 'test12',
    },
    children: []
  }, {
    data: {
      image: testImg,
      text: 'test13',
    },
    children: []
  }]
};

var d3tree = window.d3tree = new D3Tree({
  selector: '#container',
  data: data,
  width: window.innerWidth,
  height: window.innerHeight,
  duration: 1000,
  marginRight: 300,
  itemConfigHandle: img => {
    return {
      imageMaxHeight: 170,
      isVertical: false
    };
  }
});

d3tree.init();

document.querySelector('#append').addEventListener('click', () => {
  data.children[0].children.push({
    image: testImg,
    text: 'new',
    children: []
  });
  d3tree.update(data);
}, false);
