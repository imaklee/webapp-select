/**
 * 启动构建&监听
 * @author mgrush
 */

var fds		= require("fe-dev-server");
var path	= require("path");
var extend	= require("extend");
var chokidar	= require("chokidar");
var build		= require("./build");
var browserSync	= require("browser-sync");

// 启动browser-sync服务
function startServer() {
	console.log("正在启动browserSync服务...");

	browserSync.init({
		port	: 3000,
        reloadDebounce: 50,
        watchOptions: {
            ignoreInitial: true
        },
		proxy	: {
			target		: "http://localhost:3050"  // 代理fe-dev-server服务，默认3000端口
		}
	}, function(){
		console.log("打开 " + this.options.get("urls").toJS().local + " 进行开发");
	});

	chokidar.watch( "**/*.html" ).on("change", function(){
		browserSync.reload();
	})
}

// 启动fe-dev-server服务实现mock数据的访问
function startFds() {
	var fdsConfig	= {};

	try {
		fdsConfig	= require(path.resolve("fds-config.js"));
	}catch(e){
		console.log("Error: 读取fds-config.js配置文件失败！");
		process.exit();
	}

	return fds(fdsConfig);
}

// 启动start服务
function start(){
	build({ watch : true }, function(webpackConfig){
		if( browserSync.active ) {
			browserSync.reload();
		}else {
			startFds();

			setTimeout(function(){
				startServer();
			}, 3000);
		}
	});
}

start();
