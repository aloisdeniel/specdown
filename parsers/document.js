var componentRegex = /(\A|\r|\n)@([a-zA-Z]*)(\s)*{([^}]*)(\r|\n)}/g;

function parse(template) {
  var result = [];

  var current_index  = 0;
	var component;
	while ((component = componentRegex.exec(template)) !== null) {

    // Add previous document content as markdown
    result.push({
      type: "markdown",
      content: template.substring(current_index, component.index)
    })

    // Add component
    result.push({
      type: "component",
      content: {
        name: component[2],
        values: component[4]
      }
    })

		current_index = component.index + component[0].length;
	}

  // Add final document content as markdown
  result.push({
    type: "markdown",
    content: template.substring(current_index,  template.length)
  })

	return result;
}

module.exports = function (){
	this.parse = parse;
}
