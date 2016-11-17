'use strict';

const spawn = require('child_process').spawn;
const fs = require('fs');
const request = require('request');

/**
 * Download an npm module
 * @param {string} path to save downloads to
 * @param {string} uri specifying package uri
 */
function downloadUri(path, uri) {

  return new Promise((resolve, reject) => {

    let filename = uri.split('/').pop().trim();
    let output = fs.createWriteStream(`${path}/${filename}`);

    request
      .get(uri)
      .on('error', error => {
        console.log(error);
      })
      .pipe(output);

    output.on('finish', resolve);

  });

}

/**
 * get uri of package name, or just resolve uri if one is provided
 */
function getPackage(path, pkg) {

  return new Promise((resolve, reject) => {
    if (~pkg.indexOf('.tgz')) {
      return downloadUri(path, pkg)
        .then(result => {
          resolve(pkg);
        });
    }

    let url = spawn('npm', ['view', pkg, 'dist.tarball']);

    url.stdout.on('data', pkg => {
      pkg = pkg.toString();
      downloadUri(path, pkg)
        .then(result => {
          resolve(pkg);
        });
    });

    url.stderr.on('data', data => {
      resolve(Promise.resolve());
    });

  });
}

/**
 * Downloads each module named in the packages array to the specified path
 * @param {string} path to download files to
 * @param {array} list of package names to download
 */
function downloadList(path, packages) {

  let last = packages.reduce((curr, next) => {
    return curr
      .then(result => getPackage(path, next.trim()));
  }, Promise.resolve());

  last
    .then(result => {
      console.log('finished', result);
    });

}

module.exports = downloadList;
