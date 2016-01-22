/**
 * 构建webpack任务
 * @author mgrush
 * @date 2016-01-19
 */

var fs		= require("fs-extra");
var path	= require("path");
var webpack	= require("webpack");
var webpackConfig	= require("../webpack.config.js");
var compiler		= webpack(webpackConfig);

// 执行webpack编译
function build( handler ){
	return compiler.run( handler );
}

// 执行webpack编译并持续监听
function watch( handler ) {
	return compiler.watch({
		aggregateTimeout : 200	// 轮询间隔时间
	}, handler );
}

// 构建完成的回调函数
function handler( err, stats ) {
	if( err ) {
		return console.log("webpack编译异常：" + err.stack);
	}

	if( stats.hasErrors() ) {
		return console.log("webpack编译出错：\n" + stats.toString({
			colors	: true,
			hash	: false,
			version	: false,
			timings	: false,
			assets	: false,
			chunks	: false,
			children	: false,
			chunkModules: false,
			modules		: false
		}));
	}

	console.log("webpack编译成功：" + (stats.endTime - stats.startTime) + "ms\n");
}

module.exports	= function( options, callback ){
	// 清理旧的构建文件
	fs.removeSync( webpackConfig.output.path );

	// 执行构建操作
	( options.watch ? watch : build )(function( err, stats ){
		handler( err, stats );
		callback && callback(webpackConfig);
	});
}

