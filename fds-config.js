module.exports = {
    // 服务器基础路径
    basePath: __dirname,

    // view 模板目录（相对于 basePath）
    viewFolder: '.',

    // 静态资源目录 (相对于 basePath)
    publicFolder: '.',

    // 模拟数据目录 （相对于 basePath）
    mockFolder: '.',

    // 路由配置文件 （相对于 basePath）
    routeFile: 'routes.js',

    // url 代理设置
    proxy: null,

    // 模拟数据的扩展名支持
    mockExts: ['.mock', '.json'],

    // 启用java服务器
    enableJava: true,

	// 服务端口
	port: 3050
};
