// ==UserScript==
// @name          Decipher Title Changer
// @namespace     https://gitlab.borsolutions.com/rvidenov/deciphertitlesscript
// @version       1.24
// @description   Userscript for changing webpage titles (tab names) for decipher surveys to include Mac/SN
// @downloadURL https://gitlab.borsolutions.com/rvidenov/deciphertitlesscript/-/raw/master/DecipherTitleChange.user.js
// @updateURL https://gitlab.borsolutions.com/rvidenov/deciphertitlesscript/-/raw/master/DecipherTitleChange.user.js
// @match https://surveys.globaltestmarket.com/*
// @match https://surveys.lifepointspanel.com/*
// @match https://*.decipherinc.com/*
// @match https://*.focusvision.com/*
// @match https://survey.twitterfeedback.com/*
// @match http://surveys.globaltestmarket.com/*
// @match http://surveys.lifepointspanel.com/*
// @match http://*.decipherinc.com/*
// @match http://*.focusvision.com/*
// @match http://survey.twitterfeedback.com/*
// ==/UserScript==


// Set regexp for different paths
var v3 = /bor\/v3\/(?:[A-Z\/]+)\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var v2 = /bor\/v2\/(?:[A-Z\/]+)\/([0-9]{2,}[0-9A-Za-z\_]+)/;
var bor = /bor\/(v1\/)?([0-9]{2,}[0-9A-Za-z\_]+)/;
var gmi = /gmi\/(v[23]\/)?([0-9]{2,}[0-9A-Za-z\_]+)/;
var khP = /lsh\/v1\/lp\/(?:[acemps]{3,4})\/(?:[a-z]{3,7}\/)?([0-9]{2,}[0-9A-Za-z\_]+)/;
var kh = /lsh\/v1\/(?:[acemps]{3,4})\/(?:[a-z]{3,7}\/)?([0-9]{2,}[0-9A-Za-z\_]+)/;
var selfserve = /selfserve\/(?:[A-Za-z0-9]+)\/([A-Za-z0-9_]+)/;
var diy = /bor\/v3\/INTERNAL\/DIY\/master\/([A-Za-z0-9\_]+)\/([0-9]{2,}[0-9A-Za-z\_]+)/;

// Set regexp for regions
var ams = /\/AMS\//i;
var emea = /\/EMEA\//i;
var apac = /\/APAC\//i;
var internal = /\/INTERNAL\/[^DIY]/i;

//var prjTitle = document.getElementsByClassName("title-1")[0].innerText;
var dirs = [v3, v2, bor, gmi, khP, kh, selfserve];
var regions = [ams, emea, apac, internal];


function setTitle() {
  var url = location.href; // Get current url
  var title = '';
  var currTitle = document.title; // Get default title
  var decServer = url.includes("twitterfeedback") ? 'twitter/' : ( url.includes("1f59") || url.includes("252c") ) && url.includes("selfserve") ? 'M3/' : url.split('.')[0].split('/')[2] + '/';
  var dirNames = ['v3/', 'v2/', 'bor/', 'gmi/', 'lsh_p/', 'lsh/', decServer];
  var regNames = ['AMS', 'EMEA', 'APAC', 'Internal'];

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
  else if (url.includes("/apps/themeeditor")) {
    title = "Theme Editor";
  }
  else if (url.includes("/apps/mls")) {
    title = "Lang Manager";
  }
  else if (url.includes("/apps/filemanager")) {
    title = "File Manager";
  }
  else if (url.includes("/apps/distribution")) {
    title = "Sample Sources";
  }
  else if (url.includes("admin/users/audit-survey")) {
    title = "Audit Log";
  }
  else if (url.includes("/projects/detail")) {
    title = "Project Details";
  }
  else {
    title = currTitle.split(' ')[0];
  } // end of else ifs currTitle/url.includes

  // Check for and add region to title
  if (url.search(v3) + url.search(v2) + url.search(bor) + url.search(gmi) > 0) {
    for (var y = 0; y < regions.length; y++) {
        if (url.match(regions[y])) {
            title += ' (' + regNames[y] + ')';
            break;
        }
    }
  }

  var studyNum;
  // Match regexps and set new title
  for (var i = 0; i < dirs.length; i++) {
    if (url.search(dirs[i]) > 0) {
      studyNum = url.match(dirs[i])[1];
      // Check for and add temp to title
      if (url.includes("temp-") || url.includes("temp_")) {
          studyNum = studyNum + '/temp';
      } else if (url.includes("/trans")) {
          studyNum = studyNum + '/trans';
      }
      document.title = dirNames[i] + studyNum + ': ' + title;
      break;
    }
  }

  if (url.search(diy) > 0) {
    var aaClient = url.match(diy)[1];
    aaClient = aaClient[0].toUpperCase() + aaClient.substring(1);
    studyNum = url.match(diy)[2];
    if (studyNum.split('_').length > 3) studyNum = studyNum.replace('_' + studyNum.split('_')[3], '');
    document.title = '[AA] ' + aaClient + ': ' + title + ' (' + studyNum + ')';
  }
} // end setTitle function

// On some pages title is set with JS and timeout is needed so our set doesn't get overwritten
setTimeout( function() {
    setTitle();
}, 200);

// Sometimes page isn't reloaded when changed and setTitle won't run, hashchange fixes this
window.addEventListener('hashchange', function(){
  if (location.href.includes("#!")) {
    setTitle();
  }
});
