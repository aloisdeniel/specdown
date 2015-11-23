var sectionRegex = /(\A|\n|\r)@{(values|style|layout|script)}(\(([a-zA-Z_-]+)\))?(-*)(\t| )*(\n|\r)/g;

function parse(template) {

	var result = {
		style: {
			type: 'stylus',
			content:''
		},
		layout:{
			type: 'jade',
			content:''
		},
		script: {
			type: 'coffeescript',
			content:''
		},
		values: {
			type: 'yaml',
			content:''
		}
	};

	var section;
	var current_section = null;
	var current_index = 0;

	while ((section = sectionRegex.exec(template)) !== null) {

		if(current_section !== null) {
			result[current_section].content += template.substring(current_index, section.index);
		}

		current_section = section[2];
		current_index = section.index + section[0].length;

		if(section[4]) result[current_section].type = section[4]
	}

	if(current_section !== null) {
		result[current_section].content += template.substring(current_index, template.length);
	}

	return result;
}

module.exports = function (){
	this.parse = parse;
}
