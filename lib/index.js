require("./index.less");

var extend	= require("extend");
var contentTpl	= require("./content.tpl");

function SelectList(options){
	//{{{ 初始化对象参数
	this.options	= extend({
		title	: "请选择",
		chains	: [],
		data	: [{ text : "尚未设置数据源", value : "", selected : true }],
		callback	: function(){
			console.log(arguments);
		}
	}, options);

	if( this.options.chains.length == 0 ) {
		this.options.chains	= [{
			title	: this.options.title,
			data	: this.options.data
		}];
	}

	this.init();
	//}}}
}

extend(SelectList.prototype, {
	init : function(){
		//{{{
		this.render();
		this.bindEvents();
		//}}}
	},

	render : function(){
		//{{{ 渲染列表选择弹窗
		this.content	= $(contentTpl.render({
			title	: this.options.title,
			chains	: this.options.chains
		})).appendTo($("body"));
		//}}}
	},

	bindEvents : function(){
		//{{{ 绑定组件用户事件
		var self	= this;

		$("body").off("click", ".webapp-select-list .close-icon");
		$("body").on("click", ".webapp-select-list .close-icon", function(event){
			//{{{ 关闭下拉列表弹窗
			self.hide();
			//}}}
		});

		$("body").off("click", ".webapp-select-list li");
		$("body").on("click", ".webapp-select-list li", function(event){
			//{{{ 点击选中列表项
			var item = {
				text	: $(this).html(),
				value	: $(this).attr("data-value")
			};

			$(this).addClass("selected");
			$(this).siblings(".selected").removeClass("selected");

			self.hide();
			self.options.callback.apply(self, [item]);		
			//}}}
		});
		//}}}
	},

	hide : function(){
		//{{{ 隐藏当前弹窗
		this.content.hide();
		//}}}
	},

	show : function(){
		//{{{ 显示弹窗
		this.content.show();
		//}}}
	}
});

// 根据ID返回单例对象
module.exports	= (function(){
	var instList = {};

	return function(selectId, options){
		if(!instList[selectId]) {
			instList[selectId] = new SelectList(options);
		}else {
			instList[selectId].show();
		}

		return instList[selectId];
	};
})();
