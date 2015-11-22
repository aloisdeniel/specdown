var fs = require('fs');
var path = require('path');
var jade = require('jade');
var stylus = require('stylus');

var ComponentParser = require('./parsers/component.js');

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

var Specdown = function(){
	
	this.components = {};
	this.renderers = {
		layouts: {},
		styles: {},
		scripts: {},
		values: {}
	};
	
	this.component = new Component(this, new ComponentParser());
	
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
	
	// Default scripts renderers
	this.script.use('javascript', function(template){ return template; });
}

module.exports = new Specdown();