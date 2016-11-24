# NPM module downloader

Download a list of npm modules to use offline - our use is on a server that has no outside connection so we are setting up artifactory. The list can either be the url to the tarball (.tgz), the name of the module, or the name@version.

First things first, to get a list of modules used in your app run:

```
npm ls --json > packages.json
```

Then traverse your JSON object and create an array of modules.

## Running

```
let dn = require('.');
dn('./downloads', ['wordify', 'elasticsearch-synonyms']);
```

## References

 - [Npm documentation](https://docs.npmjs.com/)
