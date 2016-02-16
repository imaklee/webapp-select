require("./index.less");

var SelectList	= require("../../index.js");

// 初始化所有的select列表
SelectList.init();

// 通过接口获取数据列表
$("#education-name").on("click", function(event){
	return SelectList.init("education", {
		title	: "请选择学历",
		data	: "/edu-list",
		callback: function(item){
			$("#education-name").html(item.text);
			$("#education").val(item.value);
		}
	});
});

// 通过方法获取数据列表
$("#hobby-name").on("click", function(event){
	return SelectList.init("hobby", {
		title	: "请选择爱好",
		data	: function(){
			return [
				{ text : "游戏", value : 0, selected : true },
				{ text : "看书", value : 1 },
				{ text : "旅游", value : 2 },
				{ text : "运动", value : 3 },
				{ text : "其它", value : 4 },
			];
		},
		callback: function(item){
			$("#hobby").val(item.value);
			$("#hobby-name").html(item.text);
		}
	});
});

// 设置多维度联动功能
$("#area-name").on("click", function(event){
	return SelectList.init("area", {
		title	: "请选择省份",
		chains	: [{
			title	: "请选择省份",
			data	: [
				{ text : "北京", value : 0, selected : true },
				{ text : "浙江省", value : 1 },
			]
		}, {
			title	: "请选择城市",
			data	: function(){
				return [
					{ text : "北京市", value : 2, selected : true }
				];
			}
		}, {
			title	: "请选择区",
			data	: "/county-list"
		}],
		callback : function(prov, city, county){
			var area	= [prov.text, city.text, county.text].join(" ");

			$("#area-name").html(area);
			$("#area").val(area);
		}
	});
}).trigger("click");
