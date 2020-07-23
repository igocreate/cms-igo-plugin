
const { options }   = require('../../plugin');

//
const getSiteFilter = module.exports.getSiteFilter = function(req, res, cmsfilter) {
  if (options.sites) {
    res.locals.sites = options.sites;  
    cmsfilter.site = req.query.site || cmsfilter.site || options.sites[0];
  } else if (options.detect_site) {
    cmsfilter.site = res.locals[options.detect_site];
  } else {
    delete cmsfilter.site;
  }
}

const getLangFilter = module.exports.getLangFilter = function(req, res, cmsfilter) {
  if (options.langs) {
    res.locals.langs = options.langs;
    cmsfilter.lang  = req.query.lang || cmsfilter.lang || options.langs[0];
  } else if (options.detect_lang) {
    cmsfilter.lang = res.locals[options.detect_lang];
  } else {
    delete cmsfilter.lang;
  }
}

module.exports.loadPageFilter = function(req, res) {
  const cmsfilter = req.session.cmsfilter || {};

  const site = getSiteFilter(req, res, cmsfilter);
  const lang = getLangFilter(req, res, cmsfilter);

  const filter = {};
  filter.slug = req.params.slug;
  
  if (site) {
    filter.site = site;
  }
  if (lang) {
    filter.lang = lang;
  }
  return filter;
}
