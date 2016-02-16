<div class="webapp-select-list">
	<div class="wrap"></div>
	<div class="content">
		<h3 class="title">
			<span class="close-icon"></span>
			<span class="back-icon"></span>
			<span class="title-name">{{=it.title}}</span>
		</h3>
		<!-- data-index: 当前显示的列表的index序号，从0开始计算 -->
		<div class="select-list" data-index="0" style="width: {{=it.chains.length * 100}}%; left: 0%;">
		{{ for(var index in it.chains){ }}
		{{ var title	= it.chains[index].title || ""; }}
		{{ var dataList	= it.chains[index].data || []; }}
			<ul style="width: {{=100/it.chains.length}}%;">
			{{ if( Object.prototype.toString.call(dataList) == "[object Array]" ){ }}
				{{ for(var num in dataList){ }}
				<li data-value="{{=dataList[num].value}}" class="{{=dataList[num].selected ? 'selected' : ''}}">{{=dataList[num].text}}</li>
				{{ } }}
			{{ } }}
			</ul>
		{{ } }}
		</div>
	</div>
</div>
