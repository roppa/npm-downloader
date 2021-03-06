'use strict';

let fs = require('fs');
let spawn = require('child_process').spawn;
const request = require('request');

/**
 * Download an npm module. Errors are just reported; they won't throw
 * @param {string} path to save downloads to
 * @param {string} uri specifying package uri
 */
function downloadUri(path, uri) {

  return new Promise((resolve, reject) => {

    try {

      let filename = uri.split('/').pop().trim();
      let output = fs.createWriteStream(`${path}/${filename}`);

      request
        .get(uri)
        .on('error', error => {
          throw error;
        }).pipe(output);

      output.on('finish', () => resolve({ success: [uri] }));

    } catch (error) {
      resolve({ errors: [`${uri}: ${error.message}`] });
    }

  });

}

/**
 * get uri of package name, or just resolve uri if one is provided
 * @param {string} path filesystem path
 * @param {string} pkg package name, name@version, or url
 * @return {promise}
 */
function getNpmPackage(path, pkg) {

  return new Promise((resolve, reject) => {

    let errors = [];

    if (~pkg.indexOf('.tgz')) {
      return downloadUri(path, pkg)
        .then(result => {
          resolve(result);
        });
    }

    let url = spawn('npm', ['view', pkg, 'dist.tarball']);

    url.stdout.on('data', pkg => {
      pkg = pkg.toString();
      downloadUri(path, pkg)
        .then(result => {
          resolve(result);
        });
    });

    url.stderr.on('data', data => {
      errors.push(data.toString());
    });

    //should be 0 if all OK
    url.on('close', code => {
      if (code) {
        resolve({ errors: [errors.join('')] });
      }
    });

  });
}

/**
 * Downloads each module named in the packages array to the specified path
 * @param {string} path to download files to
 * @param {array} list of package names to download
 * @return {promise}
 */
function downloadList(path, packages) {

  let report = {
    success: [],
    errors: [],
  };

  return packages.reduce((curr, next) => curr.then(() => getNpmPackage(path, next.trim())
      .then(result => {
        if (result && result.errors) {
          return report.errors = report.errors.concat(result.errors);
        }

        report.success = report.success.concat(result.success);

      })), Promise.resolve()).then(() => report);

}

module.exports = downloadList;
