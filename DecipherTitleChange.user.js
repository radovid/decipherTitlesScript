// ==UserScript==
// @name          Decipher Title Changer
// @namespace     https://github.com/radovid/decipherTitlesScript
// @version       1.11
// @description   Userscript for changing webpage titles (tab names) for decipher surveys to include Mac/SN
// @downloadURL https://github.com/radovid/decipherTitlesScript/raw/master/DecipherTitleChange.user.js
// @updateURL https://github.com/radovid/decipherTitlesScript/raw/master/DecipherTitleChange.user.js
// @include https://surveys.globaltestmarket.com/*
// @include https://*.decipherinc.com/*
// @include https://survey.twitterfeedback.com/*
// @include http://surveys.globaltestmarket.com/*
// @include http://*.decipherinc.com/*
// @include http://survey.twitterfeedback.com/*
// ==/UserScript==


// Set regexp for different paths
var v3 = /gmi\/v3\/(?:[A-Z]+)\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var v2 = /gmi\/v2\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var gmi = /gmi\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var kantar3 = /lsr\/bmr\/v3\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var kantar2 = /lsr\/bmr\/v2\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var ag = /bor\/v1\/AG\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var natov3 = /gmi\/v3\/AMS\/NATO\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var natov2 = /gmi\/v2\/NATO\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var selfserve = /selfserve\/(?:[A-Za-z0-9]+)\/([A-Za-z0-9_]+)/;

var emea = /\/EMEA\//;
var apac = /\/APAC\//;

//var prjTitle = document.getElementsByClassName("title-1")[0].innerText;
var dirs = [v3, v2, gmi, kantar3, kantar2, ag, natov3, natov2, selfserve];


function setTitle() {
  var url = location.href; // Get current url
  var title = '';
  var currTitle = document.title; // Get default title
  var decServer = url.includes("twitterfeedback") ? 'twitter/' : url.includes("1f59")&&url.includes("selfserve") ? 'M3/' : url.split('.')[0].split('/')[2] + '/';
  var dirNames = ['v3/', 'v2/', 'gmi/', 'KH/', 'KH/', 'AG/', 'Nato/', 'GBHT/', decServer];

  // Set appropriate name for portal page
  if (currTitle.includes("error") || currTitle.includes("Error")) {
    title = currTitle;
  }
  else if (url.includes("/apps/report/")) {
    if (url.includes("/edit/")) {
      title = "Edit Crosstab";
    } else if (url.includes("#!/report/")) {
      title = "Crosstab Run";
    } else {
      title = "Crosstabs";
    }
  }
  else if (url.includes("/apps/dashboard/")) {
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
  }

  // Match regexps and set new title
  for (var i = 0; i < dirs.length; i++) {
    if (url.search(dirs[i]) > 0) {
      var studyNum = url.match(dirs[i])[1];
      /*if (currTitle.includes(studyNum)) {
          title += "  (" + currTitle.split(" for ")[1] + ")";
      }*/
      // Check for and add temp to title
      if (url.includes("temp-")) {
         document.title = dirNames[i] + studyNum + '/temp: ' + title;
      } else {
          document.title = dirNames[i] + studyNum + ': ' + title;
      }
      if (url.match(emea)) {
         document.title = dirNames[i] + studyNum + title + 'EMEA';
      }

      if (url.match(apac)) {
         document.title = dirNames[i] + studyNum + title + 'APAC';
      }
      break;
    }
  }
}

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
