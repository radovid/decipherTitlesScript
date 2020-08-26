// ==UserScript==
// @name          Decipher Title Changer
// @namespace     https://github.com/radovid/decipherTitlesScript
// @version       1.16
// @description   Userscript for changing webpage titles (tab names) for decipher surveys to include Mac/SN
// @downloadURL https://github.com/radovid/decipherTitlesScript/raw/master/DecipherTitleChange.user.js
// @updateURL https://github.com/radovid/decipherTitlesScript/raw/master/DecipherTitleChange.user.js
// @include https://surveys.globaltestmarket.com/*
// @include https://*.decipherinc.com/*
// @include https://*.focusvision.com/*
// @include https://survey.twitterfeedback.com/*
// @include http://surveys.globaltestmarket.com/*
// @include http://*.decipherinc.com/*
// @include http://*.focusvision.com/*
// @include http://survey.twitterfeedback.com/*
// ==/UserScript==


// Set regexp for different paths
var v3 = /gmi\/v3\/(?:[A-Z]+)\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var v2 = /gmi\/v2\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var gmi = /gmi\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var kantar3 = /lsr\/bmr\/v3\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var kantar2 = /lsr\/bmr\/v2\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var ag = /lsr\/bmr\/AG\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var ag0ld = /bor\/v1\/AG\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var agLsh = /lsh\/v1\/(?:[acemps]{3,4})\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var natov3 = /gmi\/v3\/AMS\/NATO\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var natov2 = /gmi\/v2\/NATO\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var selfserve = /selfserve\/(?:[A-Za-z0-9]+)\/([A-Za-z0-9_]+)/;

// Set regexp for regions
var ams = /\/AMS\//i;
var emea = /\/EMEA\//i;
var apac = /\/APAC\//i;
var ent = /\/ENT\//i;
var internal = /\/INTERNAL\//i;

//var prjTitle = document.getElementsByClassName("title-1")[0].innerText;
var dirs = [v3, v2, gmi, kantar3, kantar2, ag, ag0ld, agLsh, natov3, natov2, selfserve];
var regions = [ams, emea, apac, ent, internal];


function setTitle() {
  var url = location.href; // Get current url
  var title = '';
  var currTitle = document.title; // Get default title
  var decServer = url.includes("twitterfeedback") ? 'twitter/' : url.includes("1f59") && url.includes("selfserve") ? 'M3/' : url.split('.')[0].split('/')[2] + '/';
  var dirNames = ['v3/', 'v2/', 'gmi/', 'KH/', 'KH/', 'AG/', 'AG0/', 'LSH/', 'Nato/', 'GBHT/', decServer];
  var regNames = ['AMS', 'EMEA', 'APAC', 'ENT', 'Internal'];

  // Set appropriate name for portal page
  if (currTitle.includes("error") || currTitle.includes("Error")) {
    title = currTitle;
  }
  else if (url.includes("/apps/report/")) { // Crosstabs
    if (url.includes("/edit/")) {
      title = "Edit Crosstab";
    } else if (url.includes("#!/report/")) {
      title = "Crosstab Run";
    } else {
      title = "Crosstabs";
    }
  }
  else if (url.includes("/apps/dashboard/")) { // Dashboards
    if (url.includes(":edit")) {
      title = "Edit Dashboard";
    } else if (url.includes(":view")) {
      title = currTitle;
    } else {
      title = "Dashboards";
    }
  }
  else if (url.includes("/apps/respondents/")) {
    title = "View/Edit Responses";
  }
  else if (url.includes("/apps/takesurvey/")) {
    title = "Test Survey";
  }
  else if (url.includes("?config=GmGrUA&run=1")) {
    title = "Data Downloads";
  }
  else if (url.includes("?markers=1")) {
    title = "Markers";
  }
  else if (url.includes(":vars")) {
    title = "Variables";
  }
  else if (url.includes(":edit")) {
    title = "Edit Data";
  }
  else if (url.includes("admin/sst/list")) {
    title = "Test Data History";
  }
  else if (url.includes("admin/sst/sst")) {
    title = "Run Test Data / check for errors";
  }
  else if (url.includes("admin/vc/list")) {
    title = "Change History";
  }
  else if (url.includes("/apps/projectwarnings")) {
    title = "Project Warnings";
  }
  else if (url.includes("/apps/campaign")) {
    title = "Campaigns View";
  }
  else if (url.includes("/projects/detail")) {
    title = "Project Details - Portal";
  }
  else {
    title = currTitle.split(' ')[0];
  } // end of else ifs currTitle/url.includes

  // Check for and add region to title
  for (var y = 0; y < regions.length; y++) {
      if (url.match(regions[y])) {
          var reg = regions[y];
          title += ' (' + regNames[y] + ')';
          break;
      }
  }
  // Match regexps and set new title
  for (var i = 0; i < dirs.length; i++) {
    if (url.search(dirs[i]) > 0) {
      var studyNum = url.match(dirs[i])[1];
      // Check for and add temp to title
      if (url.includes("temp-")) {
          document.title = dirNames[i] + studyNum + '/temp: ' + title;
      } else if (url.includes("/trans")) {
          document.title = dirNames[i] + studyNum + '/trans: ' + title;
      } else {
          document.title = dirNames[i] + studyNum + ': ' + title;
      }
      break;
    }
  }
} // end setTitle function

// On some pages title is set with JS and timeout is needed so our set doesn't get overwritten
setTimeout( function() {
    setTitle();
}, 200);

// Sometimes page isn't reloaded when changed and seTitle won't run, hashchange fixes this
window.addEventListener('hashchange', function(){
  if (location.href.includes("#!")) {
    setTitle();
  }
});
