var entry	= {};
var glob	= require("glob");
var path	= require("path");
var webpack	= require("webpack");
var srcPath	= path.join(__dirname, "demo/app");
var buildPath	= path.join(__dirname, "demo/build");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

glob.sync(path.join(srcPath, "**/*.js")).forEach(function(itemPath){
	var chunk	= path.relative(srcPath, itemPath).slice(0, -3);	// 去掉.js后缀

	entry[chunk] = itemPath;
});

var config	= {
	debug : true,
	entry : entry,
	output : {
		path : buildPath,
		pathinfo : true,
		publicPath : "demo/build",
		filename : "[name].js"
	},
	module : {
		loaders : [{
			test : /\.tpl$/,
			loader : "dot-tpl"
		}, {
			test : /\.(png|gif|jpg|jpeg)(\?.*)$/,
			loader : "url"
		}, {
			test : /\.(less|css)$/, 
			loader: ExtractTextPlugin.extract('style', 'css!less')
		}]		 
	},
	plugins : [
		new ExtractTextPlugin("[name].css"),
		new webpack.ProvidePlugin({
			$	: "jquery"
		})
	],
	resolve : {
		modulesDirectories : ["node_modules"]
	}
};

module.exports = config;
