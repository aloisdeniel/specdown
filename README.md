# Specdown

Add custom components to markdown language.

## Components

A component definition is a single template file that is later rendered to HTML through a rendering engine.

### Installing more components

Components can be registered through the `<specdown>.component.use('progress, '<path to definition file>')`.

### Creating a custom static component

A custom `.comp` file should contain styles and layout :

```
@default
{
	<yaml default context>
}
@style
{
	<stylus styles>
}
@layout
{
	<jade template>
}
@script
{
	<javascript>
}
```

You can also use custom renderers and pre-processors :

```
@style(less)
{
	<less styles>
}
@layout(handlebars)
{
	<handlebars template>
}
@script
{
	<javascript>
}
```

#### Supported style pre-processors

The available style pre-processors for component definitions are :

* `stylus` (default) : [details](https://github.com/stylus/stylus)
* `less` : [details](https://github.com/less/less.js)
* `sass` : [details](https://github.com/sass/node-sass)

A custom style pre-processors can be registered through `<specdown>.style.use` (see API).

#### Supported layout rendering engines

The available rendering engines for component definitions are :

* `jade` (default) : [details](https://github.com/jadejs/jade)
* `ejs` : [details](https://github.com/tj/ejs)
* `handlebars` : [details](https://github.com/wycats/handlebars.js)

A custom rendering engine can be registered through `<specdown>.layout.use` (see API).

### Creating a custom dynamic component

A component can also be a node module : 

```javascript
module.exports.style = function(cb) {
	cb(null,".item { background: red; }")
}

module.exports.render = function(context,cb) {
	cb(null,JSON.stringify(context));
}

module.exports.script = function(cb) {
	cb(null,"")
}
```

## Documents

A specdown document is a mardown regular document with more components that can be rendered through `@<name>{ <yaml context> }`.

Example:

```
# Document

An example paragraph

@progress
{
	title: Project progress
	color: #456768
	value: 135.5
	total: 500.0
}
```

The markdown rendering is made by [marked](https://github.com/chjj/marked).

The YAML parser is [JS-YAML](https://github.com/nodeca/js-yaml).

## API

### `<specdown>.component.use('progress, '<path to definition file>')`

```javascript
specdown.style.use('custom', './components/custom.comp');
```

### `<specdown>.style.use('<name>','<render css function>')`

```javascript
specdown.style.use('custom', function(styles) {
	//Return the css styles
	return styles.replace('$accent','#556600');
});
```

### `<specdown>.layout.use('<name>','<render template from context function>')`

```javascript
specdown.layout.use('custom', function(template,context) {
	//Return the rendered component
	return template.replace('{{%}}',context);
});
```

## Tools and resources

* **specdown-components** : a document containing a list of specdown components.