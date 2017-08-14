'use strict';

const D3Tree = require('../lib/d3-tree');

var guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

let data = {
  id: guid(),
  data: {
    image: null,
    text: ''
  },
  children: [{
    id: guid(),
    data: {
      image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
      text: 'test21',
    },
    children: [{
      id: guid(),
      data: {
        image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
        text: 'test31',
      },
      children: []
    }]
  }, {
    id: guid(),
    data: {
      image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
      text: 'test22',
    },
    children: []
  }, {
    id: guid(),
    data: {
      image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
      text: 'test23',
    },
    children: []
  }]
};

var d3tree = window.d3tree = new D3Tree({
  selector: '#container',
  data: data,
  width: window.innerWidth,
  height: window.innerHeight,
  imageWidth: 100,
  imageHeight: 100,
  direction: 'd'
});

d3tree.init();

document.querySelector('#append').addEventListener('click', () => {
  data.children[0].children.push({
    id: guid(),
    data: {
      image: 'https://avatars1.githubusercontent.com/u/9263023?v=4&s=460',
      text: 'new',
    },
    children: []
  });
  d3tree.update({
    data: data,
    duration: 1000
  });
}, false);
