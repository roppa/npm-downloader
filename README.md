# NPM module downloader

[![Build Status](https://travis-ci.org/roppa/npm-downloader.svg?branch=master)](https://travis-ci.org/roppa/npm-downloader)

Download a list of npm modules to use offline. My use case was for use on a server that has no outside connection so need to import modules into artifactory. The list can either be the url to the tarball (.tgz), the name, or the name@version of the module.

For example, to get a list of modules used in your app run:

```
npm ls --json > packages.json
```

Then traverse your JSON object and create an array of modules.

## Running

The function takes 2 parameters, the target download directory and the array of modules to download:

```
let dn = require('.');
dn('./downloads', ['wordify', 'elasticsearch-synonyms']);
```

A Promise is returned, which when fulfilled will return an object:

```
{
  success: [],
  errors: [],
}
```

## Test

```
npm run test
```

## References

 - [Npm documentation](https://docs.npmjs.com/)
