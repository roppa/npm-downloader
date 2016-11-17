# NPM module downloader

Download a list of npm modules to use offline.

//if we already have a .tgz uri
 //just download and reurn promise
//otherwise spawn and get uri from npm
  //download and return promise

To get a list of modules used in your app run:

```
npm ls --json
```

Then traverse your JSON object and create an array of modules. Make sure to include the @version

## References

 - [Npm documentation](https://docs.npmjs.com/)
