# webapp-select
单项以及联动下拉列表组件，专为移动端设计

# Examples 

##### 1. 对页面已有的所有select进行初始化

```
Select.init();
```

##### 2. 通过设置数据源显示列表弹窗

* 显式设置具体的数据源数据列表

```
Select.init({
	title	: "Select-List",
	data	: [
		{ text : "item 01", value : "1", selected : true },
		{ text : "item 02", value : "2" },
		{ text : "item 03", value : "3" },
		{ text : "item 04", value : "4" },
		{ text : "item 05", value : "5" },
		{ text : "item 06", value : "6" }
	],
	callback : function(item){
		console.log(item);
	}
});
``` 

* 通过链接的形式返回数据源列表

```
Select.init({
	title	: "Select-List",
	data	: "/cont/getList",
	callback: function(item){
		console.log(item);
	}
});
```

* 通过方法设置数据源列表

```
Select.init({
	title	: "Select-List",
	data	: function(){
		return [
			{ text : "item 01", value : "1", selected : true },
			{ text : "item 02", value : "2" },
			{ text : "item 03", value : "3" },
			{ text : "item 04", value : "4" },
			{ text : "item 05", value : "5" },
			{ text : "item 06", value : "6" }
		];
	},
	callback : function(item){
		console.log(item);
	}
});
```

##### 3. 设置多维度联动功能

```
Select.init({
	title	: "Province",
	chains	: [{
		title	: "Province",
		data	: [
			{ text : "Beijing", value : "Beijing", selected : true },
			{ text : "Shanghai", value : "Shanghai" },
			{ text : "Zhejiang", value : "Zhejiang" },
			{ text : "Jiangxi", value : "Jiangxi" },
		]
	}, {
		title	: "City",
		data	: [
			{ text : "Miyun", value : "Miyun", selected : true },
			{ text : "Huilongguan", value : "Huilongguan" }
		]
	}],
	callback : function(province, city){
		console.log(arguments);
	}
});
```
