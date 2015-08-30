/**
 * Settings File
 * Created by kc on 14.04.15.
 */
'use strict';

var pkg = require('./../package.json'),
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path');
var logger = require('../common/lib/logger').getLogger('settings');

// Set default
var deployType = process.env.DEPLOY_TYPE || 'local';
var preview = true;
var debug = process.env.DEBUG || false;

// Set specific deploy type
if (process.env.OPENSHIFT_NODEJS_IP) {
  deployType = 'openshift';
  preview = false;
}
else if (process.env.DEPLOY_TYPE === 'contabo') {
  // check which instance
  var rootPath = path.join(__dirname, '..');
  console.log('Root path: ' + rootPath);
  if (_.endsWith(rootPath, 'preview')) {
    deployType = 'contabo_preview';
    debug = true;
  }
  else if (_.endsWith(rootPath, 'rc')) {
    deployType = 'contabo_rc';
  }
  else {
    preview = false;
  }
}

var settings = {
  name: pkg.name,
  appName: pkg.title,
  version: pkg.version,
  debug: (process.env.NODE_ENV !== 'production' || process.env.DEBUG) ? true : false,
  preview: preview
};

if (debug) {
  logger.debug('DEBUG Settings used');
  // Use minified javascript files wherever available
  settings.minifedjs = false;
}
else {
  logger.debug('DIST Settings with minified js files used');
  // Use minified javascript files wherever available
  settings.minifedjs = true;
}

logger.debug('DEPLOY_TYPE: ' + deployType);

if (deployType && fs.existsSync(path.join(__dirname, 'settings/' + deployType + '.js'))) {
  module.exports = require('./settings/' + deployType + '.js')(settings);
} else {
  module.exports = settings;
}
