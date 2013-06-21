# GeoMap.js


DEMO: <http://xbingoz.com/demo/geomap/example.html>


## 概述

* GeoMap.js是一个绘制矢量地图控件，基于jQuery、Raphael，

* 支持geoJSON格式的数据源

* 通过Raphael绘制地图，默认采用svg，低版本IE采用vml，兼容性较好



## 文件结构

	json/				//地图数据
	old/				//旧版本备份
	src/				//开发文件
	geomap-0.X.X.js		//发布文件

## 使用方法

基本操作：

```js
//实例化一个GeoMap对象
var map = new GeoMap();
	
//载入geoJSON格式的数据
map.load(geo_json_data);	

//渲染
map.render();
```


设置：

```js
//实例化GeoMap对象时可以传入设置项目的对象
var map = new GeoMap(cfg);

//不传参数时， 将使用内置的默认参数
defaultCfg = {
    //地图所在的位置
    container: 'body',
    //地图的偏移量, eg:{x:10, y:10}
    offset: null,
    //地图的缩放比例, eg:{x:10, y:10}
    scale: null,
    //地图样式
    mapStyle: {
        'fill': '#fff',
        'stroke': '#999',
        'stroke-width': 0.7
    },
    //是否显示鼠标跟随的十字刻度线
    crossline:{
        enable: false,
        color: '#ccc'
    },
    //地图背景
    background:'#fff'
};
```

指定渲染位置：

```js
//GeoMap默认在body元素下生成地图
//实例化时可以设置container指定渲染位置
var map = new GeoMap({
	container: '#map'
});
```
	
缩放与偏移：

```js
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
//如果不设置偏移，脚本会自动计算路径数据，并让地图从左上角开始渲染
```

清空画布：（since 0.4.7）

```js
map = new GeoMap({...});
map.load(data_1);
map.render();
//完成一次绘制后，map对象可以清空画布
map.clear();
//重新绘制其他地区数据
//重绘需要注意：如果不确定偏移和缩放是否能够沿用，最好清空一次，让load方法重新计算这两个值
map.config.scale = null;
map.config.offset = null;
map.load(data_2);   //载入新数据
map.render();   //重绘
```

属性绑定：

```js
//通过Raphael的data方法绑定地区的属性
```

操作地图上的区块：

```js
var map = new GeoMap(config);
map.load(data);
map.render();

//渲染之后，map的shapes属性即地图上的各个区块，可以添加事件
map.shapes.hover(function(){
	...
});
```

画点：

```js
//map对象有一个setPoint方法，该方法接受一个坐标参数（取实际经纬度坐标）
//比如北京坐标是x: 116.4551, y: 40.2539
//setPoint方法会根据当前地图的缩放和偏移自动计算图上坐标
point = map.setPoint({x: 116.4551, y: 40.2539});

//点是用Raphael的circle方法画出的，可以通过属性设置，更改点的大小
point.attr('r', 5);
```

计算一个点的实际经纬度：
```js
map.getGeoPosition([10, 10]); //=> 页面地图上10,10这个点的实际经纬度坐标
```

