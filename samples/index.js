// Imports module 
var specdown = require('../');

// Registers all components
specdown.component.use('./static/progress.comp');

var render = specdown.component.render('progress',{
	value: 70,
	total: 100,
	title: "test"
})

console.log(render)

//Renders document to html
/*specdown.render('./document.sd', function(err,html){
	
});*/