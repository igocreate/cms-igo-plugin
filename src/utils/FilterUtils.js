const plugin          = require('../../plugin');
const igo             = plugin.igo;

const getSiteFilter = module.exports.getSiteFilter = function(req, res, cmsfilter) {
  if (plugin.options.sites) {
    res.locals.sites = plugin.options.sites;  
    cmsfilter.site = req.query.site || cmsfilter.site || plugin.options.sites[0];
  } else if (plugin.options.detect_site) {
    cmsfilter.site = res.locals[plugin.options.detect_site];
  } else {
    delete cmsfilter.site;
  }
}

const getLangFilter = module.exports.getLangFilter = function(req, res, cmsfilter) {
  if (plugin.options.langs) {
    res.locals.langs = plugin.options.langs;
    cmsfilter.lang  = req.query.lang || cmsfilter.lang || plugin.options.langs[0];
  } else if (plugin.options.detect_lang) {
    cmsfilter.lang = res.locals[plugin.options.detect_lang];
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
