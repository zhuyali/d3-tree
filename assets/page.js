'use strict';

const D3Tree = require('../lib/d3-tree');

const testImg = "https://avatars2.githubusercontent.com/u/9263023?s=200&v=4";
const testImg2 = "['https://avatars2.githubusercontent.com/u/9263023?s=200&v=4', 'https://avatars2.githubusercontent.com/u/9263023?s=200&v=4']"
const testImg3 = "['https://avatars2.githubusercontent.com/u/9263023?s=200&v=4','https://avatars2.githubusercontent.com/u/9263023?s=200&v=4', 'https://avatars2.githubusercontent.com/u/9263023?s=200&v=4']"
const testImg4 = "['https://avatars2.githubusercontent.com/u/9263023?s=200&v=4','https://avatars2.githubusercontent.com/u/9263023?s=200&v=4','https://avatars2.githubusercontent.com/u/9263023?s=200&v=4', 'https://avatars2.githubusercontent.com/u/9263023?s=200&v=4']"
const testImg5 = "['https://avatars2.githubusercontent.com/u/9263023?s=200&v=4', 'https://avatars2.githubusercontent.com/u/9263023?s=200&v=4','https://avatars2.githubusercontent.com/u/9263023?s=200&v=4','https://avatars2.githubusercontent.com/u/9263023?s=200&v=4', 'https://avatars2.githubusercontent.com/u/9263023?s=200&v=4']"

let data = {
  data: {
    image: testImg5,
    text: 'five images',
  },
  children: [{
    data: {
      image: testImg,
      text: null,
    },
    children: [{
      data: {
        image: testImg4,
        text: 'multi\nline中文\n中文中文中文中文\nmulti\nline中文\nline中文',
      },
      children: []
    }, {
      data: {
        image: testImg2,
        text: 'two images',
      },
      children: []
    }]
  }, {
    data: {
      image: null,
      text: 'test12',
    },
    children: []
  }, {
    data: {
      image: testImg3,
      text: 'three images',
    },
    children: []
  }]
};

var d3tree = window.d3tree = new D3Tree({
  selector: '#container',
  data: data,
  width: window.innerWidth,
  height: window.innerHeight,
  duration: 1000
});

d3tree.init();

