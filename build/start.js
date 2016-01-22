/**
 * 启动构建&监听
 * @author mgrush
 */

var path	= require("path");
var extend	= require("extend");
var chokidar	= require("chokidar");
var build		= require("./build");
var browserSync	= require("browser-sync");

// 启动browser-sync服务
function startServer() {
	browserSync.init({
		port	: 3000,
		server	: {
			baseDir		: path.resolve("demo"),
			directory	: true
		}
	}, function(){
		console.log("打开 " + this.options.get("urls").toJS().local + " 进行开发");
	});

	chokidar.watch( "**/*.html" ).on("change", function(){
		browserSync.reload();
	})
}

// 启动start服务
function start(){
	build({ watch : true }, function(webpackConfig){
		if( browserSync.active ) {
			browserSync.reload();
		}else {
			startServer();
		}
	});
}

start();
