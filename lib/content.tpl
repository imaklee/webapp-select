<div class="webapp-select-list">
	<div class="wrap"></div>
	<div class="content">
		<h3 class="title">
			<span class="close-icon"></span>
			<span class="back-icon"></span>
			{{=it.title}}
		</h3>
		<!-- data-index: 当前显示的列表的index序号，从0开始计算 -->
		<div class="select-list" data-index="0">
		{{ for(var index in it.chains){ }}
		{{ var title	= it.chains[index].title || ""; }}
		{{ var dataList	= it.chains[index].data || []; }}
			<ul>
			{{ for(var num in dataList){ }}
				<li data-value="{{=dataList[num].value}}" class="{{=dataList[num].selected ? 'selected' : ''}}">{{=dataList[num].text}}</li>
			{{ } }}
			</ul>
		{{ } }}
		</div>
	</div>
</div>
