var fs = require('fs');
var path = require('path');
var jade = require('jade');
var marked = require('marked');
var stylus = require('stylus');
var yaml = require('js-yaml');
var coffeescript = require('coffee-script');

var ComponentParser = require('./parsers/component.js');
var DocumentParser = require('./parsers/document.js');

var Component = function(parent, parser){

	this.use = function(filePath){
		var stats = fs.statSync(filePath);
		if(stats.isDirectory()){
			 var files = fs.readdirSync(filePath);
			 for (var key in files) {
				var childPath = path.resolve(filePath, files[key]);
				this.use(childPath);
			 }
		}
		else {
			var file = path.parse(filePath);
			if(file.ext === ".comp") {
				var data = fs.readFileSync(filePath);
				parent.components[file.name] = parser.parse(data.toString());
				console.log("> registered \""+file.name+"\" component.");
			}
		}
	}

	this.render = function(name,context){
		var component = parent.components[name];
		var layout = component.layout;
		var renderer = parent.renderers.layout[layout.type];
		return renderer(layout.content, context);
	}
};

var Renderer = function(collection){
	this.use = function(name, renderer){
		collection[name] = renderer;
	}
};


var renderComponentElement= function(name,eType){
	var component = this.components[name];
	if(!component[eType].content)
		return null;

	var renderer = this.renderers[eType][component[eType].type];
	return renderer(component[eType].content);
}

var renderDocumentElement= function(docTree,eType){
	// Renders css
	var elements = {};
	for (var key in docTree) {
		var node = docTree[key];
		if(node.type === "component" && !elements[node.content.name]) {
			var name = node.content.name;
			elements[name] = this.renderComponentElement(name,eType);
		}
	}
	return elements;
}

/* Style rendering */

var renderDocumentStyle = function(docTree){
	// Renders css
	var componentCss = this.renderDocumentElement(docTree,'style');

	// Appends css
	var css = "";
	for (var key in componentCss) {
		var compCss = componentCss[key];
		if(compCss) {
			css += "/* " + key + " : */ " + compCss + "\n"
		}
	}
	return css;
}

/* Script rendering */

var renderDocumentScript = function(docTree){
	// Renders css
	var componentScript = this.renderDocumentElement(docTree,'script');

	// Appends css
	var js = "";
	for (var key in componentScript) {
		var compScript = componentScript[key];
		if(compScript){
			js += "<script>/* " + key + " : */ " + compScript + "</script>\n"
		}
	}
	return js;
}

/* Content rendering */

var renderDocumentContent = function(docTree){
	var content = "";
	for (var key in docTree) {
		var node = docTree[key];
		if(node.type === "markdown") {
			content += marked(node.content) + "\n\n";
		}
		else if(node.type === "component") {
			var component = this.components[node.content.name];
			var renderer = this.renderers.values[component.values.type];
			var context =  renderer(node.content.values);
			content += this.component.render(node.content.name,context) + "\n\n";
		}
	}
	return content;
}

/* Rendering */

var renderDocument = function(filePath){
	var data = fs.readFileSync(filePath);
	var docTree = this.parsers.document.parse(data.toString());

	var css = this.renderDocumentStyle(docTree);
	var html = this.renderDocumentContent(docTree);
	var js = this.renderDocumentScript(docTree);

	return {
		css: css,
		html: html,
		js: js
	};
};

var Specdown = function() {

	this.components = {};
	this.renderers = {
		layout: {},
		style: {},
		script: {},
		values: {}
	};
	this.parsers = {
		component: new ComponentParser(),
		document: new DocumentParser()
	};

	this.component = new Component(this, this.parsers.component);

	// Methods
	this.renderDocument = renderDocument;
	this.renderComponentElement = renderComponentElement;
	this.renderDocumentElement = renderDocumentElement;
	this.renderDocumentStyle = renderDocumentStyle;
	this.renderDocumentContent = renderDocumentContent;
	this.renderDocumentScript = renderDocumentScript;
	this.use = this.component.use;

	// Renderers
	this.style = new Renderer(this.renderers.style);
	this.script = new Renderer(this.renderers.script);
	this.layout = new Renderer(this.renderers.layout);
	this.values = new Renderer(this.renderers.values);

	// Default layouts renderers
	this.layout.use('jade', function(template,context){ return jade.render(template, context); });

	// Default styles renderers
	this.style.use('stylus', function(template){ return stylus(template, { compress: true }).render(); });
	this.style.use('css', function(template){ return template; });

	// Default values renderers
	this.values.use('yaml', function(template){ return yaml.safeLoad(template); });

	// Default scripts renderers
	this.script.use('javascript', function(template){ return template; });
	this.script.use('coffeescript', function(template){ return coffeescript.compile(template); });
}

module.exports = new Specdown();
