// Imports module
var specdown = require('../../');

// Registers all components
specdown.use('./components');

// Renders document
var doc = specdown.renderDocument('./document.sd');

console.log("CSS >\n\n" + doc.css);
console.log("\n\nHTML >\n\n" + doc.html);
console.log("\n\JS >\n\n" + doc.js);
