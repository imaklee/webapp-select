require("./index.less");

var extend	= require("extend");
var contentTpl	= require("./content.tpl");

function SelectList(options){
	//{{{ 初始化对象参数
	this.options	= extend({
		title	: "请选择",
		chains	: [],
		data	: [],
		callback: function(){ }
	}, options);

	// 缓存通过方法或者接口获取的数据，避免重复计算或者请求，第一级的key值使用"data"
	this.caches		= {}; 

	this.init();
	//}}}
}

extend(SelectList.prototype, {
	init : function(){
		//{{{
		//统一使用chains进行处理
		if( this.options.chains.length == 0 ) {
			this.options.chains	= [{
				title	: this.options.title,
				data	: this.options.data
			}];
		}

		this.render();
		this.bindEvents();

		var self	= this;
		var $ul		= this.content.find(".select-list ul:first-child");

		if(Object.prototype.toString.call(this.options.chains[0]) != "[object Array]") {
			this.showLoading($ul);
			this.getRemoteData(this.options.chains[0].data, function(data){
				self.rendItemList($ul, data);
			});
		}
		//}}}
	},

	render : function(){
		//{{{ 渲染列表选择弹窗，并绑定用户事件
		this.content	= $(contentTpl.render({
			title	: this.options.title,
			chains	: this.options.chains
		})).appendTo($("body"));
		//}}}
	},

	bindEvents : function(){
		//{{{ 绑定组件用户事件
		var self		= this;
		var chainLen	= this.options.chains.length;

		this.content.on("click", ".back-icon", function(event){
			//{{{ 返回上一级
			var $selectList	= self.content.find(".select-list"); 
			var curIndex	= $selectList.attr("data-index");

			$selectList.attr("data-index", curIndex - 1);
			$selectList.css({"left" : "-" + ((curIndex - 1) * 100) + "%"});

			self.updateTitle();
			self.toggleBackIcon();
			//}}}
		});

		this.content.on("click", ".close-icon", function(event){
			//{{{ 关闭下拉列表弹窗
			self.hide();
			//}}}
		});

		this.content.on("click", "li", function(event){
			//{{{ 点击选中列表项
			var ulIndex		= $(this).parent().index();
			var $selectList	= self.content.find(".select-list"); 

			$(this).addClass("selected");
			$(this).siblings(".selected").removeClass("selected");
			$selectList.attr("data-index", ulIndex + 1);

			//如果是存在子级列表，则切换到子级列表，否则隐藏列表并执行回调
			if( ulIndex < chainLen - 1 ) {
				self.updateTitle();
				self.toggleBackIcon();
				self.updateChildList();
				self.showLoading($(this).parent().next());
				$selectList.css({"left" : "-" + ((ulIndex + 1) * 100) + "%"});;
			}else {
				self.hide();
				self.options.callback.apply(self, self.getSelectedItems());		
			}
			//}}}
		});
		//}}}
	},

	toggleBackIcon : function(){
		//{{{ 多级联动，显示返回图标
		var $backIcon	= this.content.find(".title .back-icon");
		var curIndex	= this.content.find(".select-list").attr("data-index");

		if( curIndex == 0 ) {
			$backIcon.hide();
		}else {
			$backIcon.show();
		}
		//}}}
	},

	updateTitle : function(){
		//{{{ 更新列表的title名称
		var curIndex	= this.content.find(".select-list").attr("data-index");
		var itemData	= this.options.chains[curIndex];
		var title		= itemData.title || this.options.title;

		this.content.find(".title-name").html(title);
		//}}}
	},

	updateChildList : function(){
		//{{{ 根据上一级列表选中的内容，渲染当前级别的列表项
		var self		= this;
		var $selectList = this.content.find(".select-list");
		var ulIndex		= parseInt($selectList.attr("data-index"));
		var chainItem	= this.options.chains[ulIndex];
		var $ul			= $selectList.find("ul:nth-child(" + (ulIndex + 1) + ")");

		$ul.html("");

		this.getRemoteData(chainItem.data, function(data){
			return self.rendItemList($ul, data);
		});
		//}}}
	},

	rendItemList : function(ul, data){
		//{{{ 根据数据列表，更新dom节点
		$(ul).html(data.map(function(item){
			return "<li data-value='" + item.value + "' class='" + (item.selected ? "selected" : "") + "'>" 
				+ item.text 
				+ "</li>";			
		}).join(""));
		//}}}
	},

	getRemoteData : function(itemData, callback){
		//{{{ 获取数据源列表，并根据数据源更新列表内容
		var	self			= this;
		var selectedData	= this.getSelectedItems();

		// 计算key值并将数据换存在caches中, 如果是第一级，则直接使用data作为key值
		var curIndex	= this.content ? this.content.find(".select-list").attr("data-index") : 0;
		var keyName		= ["data"].concat(selectedData.map(function(item, index){
			return index < curIndex ? item.value : "";
		})).join("##");

		// 如果缓存中有，则直接使用缓存的数据
		if(typeof this.caches[keyName] != "undefined") {
			return callback && callback(this.caches[keyName]);
		}

		switch(Object.prototype.toString.call(itemData)) {
			case "[object String]" :
				return $.getJSON(itemData, function(result){
					self.getRemoteData(result, callback);	
				});
			case "[object Function]" : 
				// 真对方法返回结果重新判断一次，方便组装带不同参数的链接
				return this.getRemoteData(itemData.apply(null, selectedData), callback);
			case "[object Array]" :
				// 缓存数据
				this.caches[keyName] = itemData;
				callback && callback(itemData);
				break;
		} 
		//}}}
	},

	getSelectedItems : function(){
		//{{{ 获取已经选中的数据列表
		var $selectList		= this.content ? this.content.find(".select-list") : null;
		var selectedData	= $selectList ? $selectList.find("ul").map(function(index, ul){
			var $selected	= $(ul).find("li.selected");

			return $selected.length ? {
				text : $selected.text(),
				value: $selected.attr("data-value")
			} : null;
		}).toArray() : [];
					   
		return selectedData;
		//}}}
	},

	showLoading : function(ul){
		//{{{ 在列表数据项完成加载之前，显示loading图标，在网络情况良好的情况下就不用显示
		setTimeout(function(){
			$(ul).html() == "" && $(ul).html("<li class='loading'>加载中...</li>");
		}, 500);
		//}}}
	},

	hide : function(){
		//{{{ 隐藏当前弹窗
		this.content.hide();
		this.content.find(".select-list").css({"left" : "0%"}).attr("data-index", 0);

		this.updateTitle();
		this.toggleBackIcon();
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
