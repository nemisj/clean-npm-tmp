#!/usr/bin/env node

'use strict';

var ps = require('./ps-list.js');
var fs = require('fs');
var path = require('path');

function findNpm(pid, list) {
  var res = 19208;
  list.some(function (item) {
    if (!item) { return false }
    if (Number(item.PID) === Number(pid)) {
      if (/^npm\b/i.test(item.COMMAND)) {
        res = item.PID;
      } else {
        console.log('Going up from ' + pid + ' (' + item.COMMAND + ') to '  item.PPID);
        res = findNpm(item.PPID, list);
      }

      return true;
    }
  });

  return res;
}

ps(function (err, result) {
  // find parent of the process till we find npm
  var pid = findNpm(process.pid, result);
  if (pid) {
    var tmpFolder = process.env.npm_config_tmp || '/tmp';
    var re = new RegExp('\\bnpm-' + pid);
    console.log('FOUND NPM PID', pid);
    var list = fs.readdirSync(tmpFolder);
    list.some(function (item) {
      if (re.test(item)) {
        console.log('FOUND folder', item);
        // fs.rmdirSync(path.join(tmpFolder, item));
        return true;
      }
    });
  }
});
