
# CMS Igo Plugin

A Content Management System for projects using [Igo.js](https://www.https://github.com/igocreate/igo).


## Getting started



### Install and configure plugin

- Install the plugin:
```
npm i cms-igo-plugin
```

- Declare it in your application ./app/plugin.js
```
const CmsIgoPlugin = require('cms-igo-plugin');

module.exports = [
  CmsIgoPlugin
];
```

### Declare routes

- Edit your routes.js
```
const CmsIgoPlugin = require('cms-igo-plugin');

[...]

// front routes
app.use('/',        CmsIgoPlugin.routes.main);

// admin routes
app.use('/admin',   CmsIgoPlugin.routes.admin);
```

### Import assets: Images, JS & CSS

- Import JS (./js/vendor.js)
```
// Imperavi Redactor JS
require('./redactor/redactor.js');

// Cms Igo Plugin JS
require('../node_modules/cms-igo-plugin/js/admin.js');
```

- Import CSS (./scss/vendor.scss)
```
// Imperavi Redactor CSS
@import "../js/redactor/redactor.css";
```

- Import images:

Copy `"./node_modules/cms-igo-plugin/public/cms"` to `"./public/cms"`


### Test
- Access admin on http://localhost:3000/admin/cms


