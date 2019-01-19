// ==UserScript==
// @name          Decipher Title Changer
// @namespace     https://github.com/radovid/decipherTitlesScript
// @version       0.10
// @description   Userscript for changing webpage titles (tab names) for decipher surveys to include Mac/SN
// @downloadURL https://github.com/radovid/decipherTitlesScript/raw/master/DecipherTitleChange.user.js
// @updateURL https://github.com/radovid/decipherTitlesScript/raw/master/DecipherTitleChange.user.js
// @include https://surveys.globaltestmarket.com/*
// @include https://*.decipherinc.com/*
// @include http://surveys.globaltestmarket.com/*
// @include http://*.decipherinc.com/*
// ==/UserScript==

// Test update 2

var url = location.href; // Get current url
// Set regexp for different paths
var v3 = /gmi\/v3\/(?:[A-Z]+)\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var v2 = /gmi\/v2\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var gmi = /gmi\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var kantar3 = /lsr\/bmr\/v3\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var kantar2 = /lsr\/bmr\/v2\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var ag = /bor\/v1\/AG\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var walmart = /\/53c\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var maps = /gmi\/v2\/maps\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var natov3 = /gmi\/v3\/NATO\/AMS\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var natov2 = /gmi\/v2\/NATO\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var internalv3 = /gmi\/v3\/(?:[A-Z]+)\/INTERNAL\/([0-9]{2,}[0-9A-Za-z\_]+)/;

var currTitle = '';
if (document.title.includes("error")) {
  currTitle = document.title;
} else {
  currTitle = document.title.split(' ')[0];
}

//var prjTitle = document.getElementsByClassName("title-1")[0].innerText;
var dirs = [v3,v2,gmi,kantar3,kantar2,ag,walmart,maps,natov3,natov2,internalv3];
var dirNames = ['v3/','v2/','gmi/','ktr-v3/','ktr-v2/','AG/','wmt/','wmt/','Nato/','GBHT/','v3/INT/'];

setTimeout( function() {
  for (var i = 0; i < dirs.length; i++) {
    if (url.search(dirs[i]) > 0) {
      var studyNum = url.match(dirs[i])[1];
      if (url.includes("temp-")) {
        document.title = dirNames[i] + studyNum + '/temp: ' + currTitle;
      } else {
        document.title = dirNames[i] + studyNum + ': ' + currTitle;
      }
    }
  }
}, 200)
