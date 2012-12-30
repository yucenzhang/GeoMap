# GeoMap.js

## 概述

* GeoMap.js是一个绘制矢量地图的JavaScript控件，基于jQuery、Raphael、Tuna这三个类库

* 支持geoJSON格式的数据源

* 通过Raphael绘制地图，默认采用svg，低版本IE采用vml，兼容性较好


## 文件结构
	
	jslib/						// 使用到的类库
		jquery-1.8.2.min.js		// 大家都知道
		raphael-min.js			// 很有名的矢量图类库
		tuna.js					// 面向对象类库
		
	geomap/						
		geomap.js				// 封装GeoMap对象
		json/					// 地图数据
			china.geo.json		// 中国地图数据
			world.geo.json		// 世界地图数据
	

## 使用方法

#### 实例化一个GeoMap对象
	
	var map = GeoMap.create(element, width, height);
	// element: 放置map的位置，支持tagName/#id/.class
	
#### 渲染一张地图

	// 渲染地图的参数
	var config = {
		// 数据文件的路径
		srcPath: '../json/china.map.data.json',
		// 缩放比例，x轴和y轴采用不同的缩放比例
		scale:{x:2,y:3}
	};
	
	// 渲染地图的回调函数
	function callback(){
		// 可以对地图进行操作
	}
	
	// 渲染
	map.render(config, callback);

#### 操作地图上的地区
	
	// 实例化的GeoMap对象里，拥有一个mapPaths属性，其中记录了当前地图上的所有地区
	map.render(function(){
		// 在回调函数中，给各个地区增加鼠标经过事件
		$.each(map.mapPaths, function(k, v){
			
			v.hover(function(){
				this.attr({fill:"#369"});
			});
			
		});
	});
	
	

#### 画点
	
	// 定义一个点（如果半径大，就是一个圆形）
	var oPoint = {
		"x" : 10.1,		// 经度（必须）
		"y" : 100.2,	// 纬度（必须）
		"r" : 1,		// 点的半径
		"opacity" : 0.5,	// 点的透明度
		"fill" : "#238CC3",		// 点的颜色
		"stroke" : "#238CC3",	// 外边框的颜色
		"stroke-width" : 0.1	// 外边框的粗度
	};
	
	// 把点画到地图上
	var p = map.setPoint(oPoint);	
	
	// 把点删掉
	p.remove();

	
#### 画线
	
	// 数组中的坐标对象就是线段上的各个点
	var aPoints = [{x:1,y:2},{x:2,y:3},…];
	
	// 定义一条线
	var oLine = {
		"ps": aPoints 			// ps属性就是点数组
		"stroke": "#369"		// 线的颜色
		"stroke-width": 0.5		// 线的粗细
	}；
	
	// 把线画出来
	var l = map.setLine(oLine);
	
	// 把线删掉
	l.remove();
	