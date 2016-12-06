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
        res = findNpm(item.PPID, list);
      }

      return true;
    }
  });

  return res;
}

ps(function (err, result) {
  // find parent of the process till we find npm
  const pid = findNpm(process.pid, result);
  if (pid) {
    const tmpFolder = process.env.npm_config_tmp || '/tmp';
    const re = new RegExp('\\bnpm-' + pid);
    console.log('FOUND NPM PID', pid);
    const list = fs.readdirSync(tmpFolder);
    list.some(function (item) {
      if (re.test(item)) {
        console.log('FOUND folder', item);
        // fs.rmdirSync(path.join(tmpFolder, item));
        return true;
      }
    });
  }
});
