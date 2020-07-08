<h1 align="center">
  <br>
  Igo CMS
  <br>
</h1>

A Content Management System for projects using [Igo.js](https://www.https://github.com/igocreate/igo).

# Features

# How To Use

## In your Igo Project:
You need to install the plugin from the npm recipe :  
```
npm i cms-igo-plugin
```

Then in app/plugin.js, you must add the following :
```
const CmsIgoPlugin = require('cms-igo-plugin');
module.exports = [
  CmsIgoPlugin
];
```

## From scratch:

First, you need to install [Igo](https://github.com/igocreate/igo). 

Then, create a new project and install the CMS with the following commands :
```
igo create demo
cd demo
npm i cms-igo-plugin
```


You must configure your CMS in app/plugin.js with :
```
const CmsIgoPlugin = require('cms-igo-plugin');
module.exports = [
  CmsIgoPlugin
];
```