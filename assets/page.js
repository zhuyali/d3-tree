'use strict';

const D3Tree = require('../dist/d3-tree');

let data = {
  data: {
    image: 'https://www.baidu.com/img/bd_logo1.png',
    text: 'test1',
  },
  children: [{
    data: {
      image: 'https://www.baidu.com/img/bd_logo1.png',
      text: 'test11',
    },
    children: [{
      data: {
        image: 'https://www.baidu.com/img/bd_logo1.png',
        text: 'test111',
      },
      children: []
    }]
  }, {
    data: {
      image: 'https://www.baidu.com/img/bd_logo1.png',
      text: 'test12',
    },
    children: []
  }, {
    data: {
      image: 'https://www.baidu.com/img/bd_logo1.png',
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
  imageMaxHeight: 170,
  duration: 1000,
  marginRight: 300,
  isMobile: false
});

d3tree.init();

document.querySelector('#append').addEventListener('click', () => {
  data.children[0].children.push({
    image: 'https://www.baidu.com/img/bd_logo1.png',
    text: 'new',
    children: []
  });
  d3tree.update(data);
}, false);
