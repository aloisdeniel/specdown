var fs = require('fs');
var path = require('path');
var jade = require('jade');
var stylus = require('stylus');
var coffeescript = require('coffee-script');

var ComponentParser = require('./parsers/component.js');
var DocumentParser = require('./parsers/document.js');

var Component = function(parent, parser){

	this.use = function(filePath){
		var data = fs.readFileSync(filePath);
		var file = path.parse(filePath);
		parent.components[file.name] = parser.parse(data.toString());
	}

	this.render = function(name,context){
		var component = parent.components[name];
		var layout = component.layout;
		var renderer = parent.renderers.layouts[layout.type];
		return renderer(layout.content, context);
	}
};

var Renderer = function(collection){
	this.use = function(name, renderer){
		collection[name] = renderer;
	}
};

var renderDocument = function(filePath){
	var data = fs.readFileSync(filePath);
	var file = path.parse(filePath);

	var parsed = this.parsers.document.parse(data.toString());
	console.log(parsed);
};

var Specdown = function() {

	this.components = {};
	this.renderers = {
		layouts: {},
		styles: {},
		scripts: {},
		values: {}
	};
	this.parsers = {
		component: new ComponentParser(),
		document: new DocumentParser()
	};

	this.component = new Component(this, this.parsers.component);

	// Methods
	this.render = renderDocument;

	// Renderers
	this.style = new Renderer(this.renderers.styles);
	this.script = new Renderer(this.renderers.scripts);
	this.layout = new Renderer(this.renderers.layouts);
	this.values = new Renderer(this.renderers.values);

	// Default layouts renderers
	this.layout.use('jade', function(template,context){ return jade.render(template, context); });

	// Default styles renderers
	this.style.use('stylus', function(template){ return stylus(template, { compress: true }).render(); });
	this.style.use('css', function(template){ return template; });

	// Default values renderers
	this.script.use('yaml', function(template){ return template; });

	// Default scripts renderers
	this.script.use('javascript', function(template){ return template; });
	this.script.use('coffeescript', function(template){ return coffeescript.compile(template); });
}

module.exports = new Specdown();
