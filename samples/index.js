// Imports module
var Specdown = require('../');

var specdown;

// 01. Simple
specdown = new Specdown();
specdown.use('./simple/components');
specdown.writeDocument('./simple/document.sd');

// 02. Charts
specdown = new Specdown();
specdown.use('./charts/components');
specdown.writeDocument('./charts/document.sd');
