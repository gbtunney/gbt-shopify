const path = require("path");

module.exports = {
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	sections: [
		   {
		    name: 'First Section',
		    components: 'src/components/**/[A-Z]*.vue'
		   },
		{
			name: 'UI Section',
			components: 'src/library/components/ui/gSVG.vue'
		}
		 ],
	// components: 'src/components/**/[A-Z]*.vue',
	// defaultExample: true,
	// sections: [
	//   {
	//     name: 'First Section',
	//     components: 'src/components/**/[A-Z]*.vue'
	//   }
	// ],
	// webpackConfig: {
	//   // custom config goes here
	// },
	exampleMode: 'expand',
	require: [
		path.join(__dirname, './src/library/styles/scss/tailwind.scss')
	]
}
