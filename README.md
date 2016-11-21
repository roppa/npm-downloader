# NPM module downloader

Download a list of npm modules to use offline. The list can either be the url to the tarball (.tgz), the name of the module, or the name@version.

To get a list of modules used in your app run:

```
npm ls --json
```

Then traverse your JSON object and create an array of modules. Make sure to include the @version

## Running

```
const downloader = require('.');
downloader.downloadList('/downloads', moduleListArray);
```

## References

 - [Npm documentation](https://docs.npmjs.com/)
