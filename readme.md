# GeoMap.js	<sup style="font-size:14px">beta2</sup>

## 概述

* GeoMap.js是一个绘制矢量地图控件，基于jQuery、Raphael，

* 支持geoJSON格式的数据源

* 通过Raphael绘制地图，默认采用svg，低版本IE采用vml，兼容性较好


## 文件结构
	
	json/				//地图数据
	old/				//旧版（实现方法有问题，不建议使用）
	geomap.js			//主文件
	example.html		//示例文件
	

## 使用方法

基本操作：

	//实例化一个GeoMap对象
	var map = new GeoMap();	
	
	//载入json数据
	$.ajax({
		url: '…'
		dataType: 'json'
	}).done(function(json){
		map.load(json);		//将数据载入GeoMap的实例对象
	});
	
	
	//渲染
	map.render();


设置：

	//实例化GeoMap对象时可以传入设置项目的对象
	var map = new GeoMap({
		…
	});


指定渲染位置：

	//GeoMap默认在body元素下生成地图
	//实例化时可以设置container指定渲染位置
	var map = new GeoMap({
		container: '#map'
	});
	
缩放与偏移：

	//geoJSON数据是真实地理经纬度数据
	//转换到页面显示需要设置偏移和缩放
	var map = new GeoMap({
		//偏移：确定地图位置
	  	offset: {
        	x: 0, y: 0	//世界地图默认不需位移
        },
        //缩放：确定地图大小
        scale:{
            x: 2.6, y: 3
        }
	});