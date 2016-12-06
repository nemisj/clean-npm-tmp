#!/usr/bin/env node

'use strict';

var ps = require('./ps-list.js');
var fs = require('fs');
var path = require('path');

function getInfo(pid, list) {
  var result = null;
  list.some(function (item) {
    if (!item) { return false }
    if (Number(item.PID) === Number(pid)) {
      result = item;
      return true;
    }
  });

  return result;
}

function findNpm(pid, list) {
  // in *nix it's called npm, but in windows it can be called node
  // we should start search from the 
  const info = getInfo(pid, list);

  if (info) {
    // is it our thing?
    if (/^(npm|node)\b/i.test(info.COMMAND)) {
      return pid;
    } else {
      // not our process, search in parent
      return findNpm(info.PPID, list);
    }
  }

  return null;
}

ps(function (err, result) {
  // find parent of the process till we find npm
  var info = getInfo(process.pid, result);
  if (!info) {
    // unable to find any process with this pid
    return;
  }

  var pid = findNpm(info.PPID, result);

  if (!pid) {
    // unablet o find parent/node
    return;
  }

  var tmpFolder = process.env.npm_config_tmp || '/tmp';
  var re = new RegExp('\\bnpm-' + pid);

  var list = fs.readdirSync(tmpFolder);
  list.some(function (folder) {
    if (re.test(folder)) {
      console.log('Removing folder "' + path.join(tmpFolder, folder) + '"');
      fs.rmdirSync(path.join(tmpFolder, folder));
      return true;
    }
  });
});
