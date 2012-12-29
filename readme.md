#GeoMap.js
---
## 文件结构
	
	js/
		jquery-1.8.2.min.js		// 大家都知道
		raphael-min.js			// 很有名的矢量图类库
		tuna.js					// 面向对象类库
		
	geomap/
		geomap.js				// 封装GeoMap对象
		json/
			china.geo.json		// 中国地图数据
			world.geo.json		// 世界地图数据
	
---
## 使用方法

#### 实例化一个GeoMap对象
	
	var map = GeoMap.create(element, width, height);
	// element: 放置map的位置，支持tagName #id .class
	
#### 渲染一张地图

##### 基本方法

	// 渲染地图的参数
	var config = {
		//数据文件的路径
		srcPath: '../json/china.map.data.json',
		//缩放比例，x轴和y轴采用不同的缩放比例
		scale:{x:2,y:3}
	};
	
	// 渲染地图的回调函数
	function callback(){
		// 可以对地图进行操作
	}
	
	// 渲染
	map.render(config, callback);
	
#### 画点

##### 基本方法
	map.setPoint({
		x:10.1,	//经度
		y:100.2	//纬度
	});	
##### 高级设置

	
#### 画线
	
	// 参数对象的ps属性是数组
	// 数组中的坐标对象就是线段上的各个点
	map.setLine({
		ps : [
			{x:1,y:2},{x:2,y:3}
			//...
		]
	});
	