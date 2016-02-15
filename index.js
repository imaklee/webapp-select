var getSignInst = require("./lib/index.js");

module.exports	= {
	init	: function(selectId, options){
		//{{{ 初始化下拉列表
		if( arguments.length == 0 ) {
			return this.initAllPgSelect();
		}else{
			return getSignInst(selectId, options);
		}
		//}}}
	},

	initAllPgSelect : function(){
		//{{{ 初始化页面已有的下拉列表标签
		var autoIdIndex	= 1;

		// 递归初始化所有的select列表
		$("select").each(function(index, select){
			// 组件的id，作为组件唯一标示，用于标记单例对象
			var selectId	= $(select).attr("id") || ("select" + autoIdIndex++);

			// 数据列表
			var $selectedOpt= $(select).find("option[selected]");
			var title		= $(select).siblings("label").text();
			var data		= $(select).find("option").map(function(index, option){
				var text	= $(option).text();
				var value	= $(option).attr("value");
				var selected= index == 0 && !$selectedOpt.length || typeof $(option).attr("selected") != "undefined";

				return { text : text, value : value, selected : selected };
			}).toArray();

			// 通过input和span代替select
			var $input		= $("<input type='text' value='" + $(select).val() + "'/>").insertAfter($(select));
			var $span		= $("<span class='webapp-select-item'>" + $selectedOpt.html() + "</span>").insertAfter($(select));

			// 复制所有的属性
			$.each(select.attributes, function(index, item){
				$input.attr(item.nodeName, item.nodeValue);
			});

			// 点击弹出下拉列表
			$span.on("click", function(){
				return getSignInst(selectId, {
					title	: title, 
					data	: data,
					callback	: function(item){
						$input.val(item.value);
						$span.html(item.text);
					}
				});
			})
			.addClass($(select).attr("class"))
			.css({ width : $(select).width(), height : $(select).height() });
			
			// 删除原始select节点
			$(select).remove();
		});			  
		//}}}
	}
};
