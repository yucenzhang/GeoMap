/*
*
* Author: Yang Dongxu
* Date: 12-12-29
* Time: 上午9:59
*
* GeoMap.js 矢量地图展示控件
*
*/

(function($){

	TN.Class.def('GeoMap', TN.Class.TNObject, {

		init : function(container,w,h){
			var self = this;
			self.superMethod();

			self.container = $(container).css('background','#fff');
			self.width = w || self.container.width();
			self.height = h || self.container.height();
			self.canvas = Raphael(self.container.get(0), self.width, self.height);

			// 记录地图上所有path的对象
			self.mapPaths = {};

			// 地图的偏移量和缩放比例
			self.offset = {},
			self.scale = {};

			self.defaultConfig = {
				'srcPath' : '',
				'scale' : {
					'x' : 1,
					'y' : 1
				},
				'style' : {
					'fill' : '#eee', //'#CFEBF7',
					'stroke' : '#fff',
					'stroke-width' : 0.5,
					'stroke-linejoin' : 'round',
					'cursor' : 'pointer'
				}
			};
		},
		
		// 绘制地图
		render : function(/* config, callback */){
			var self = this,
				canvas = self.canvas,
				xhr,
				sx,
				sy,
				argtype,
				callback = function(){},
				config = {};

			if(arguments.length == 1){
				argtype = {}.toString.call(arguments[0]);
				if(argtype == '[object Object]'){
					config = arguments[0];
				}else if(argtype == '[object Function]'){
					callback = arguments[0];
				}
			}else if(arguments.length == 2){
				config = arguments[0];
				callback = arguments[1];
			}	

			// 清空画布
			canvas.clear();
			// 清空mapPaths
			self.mapPaths = {};

			var tem = {};
			$.extend(true, tem, self.defaultConfig);
			$.extend(true, tem, config);
			config = tem;


			canvas.text(self.width/2, self.height/2, '载入数据');

			xhr = $.ajax({
				url: config.srcPath,
				dataType: 'json',
			}).done(function(geoJSON){

				canvas.clear();
				
				// 为了保证地图在容器的0，0坐标开始绘制
				// 需要确定每张地图的偏移量，即geoJSON对象的offset属性
				// 但是，geoJSON的标准格式不存在offset, 所以
				// 对于没有经过处理的数据源 需要动态判断offset
				if(!geoJSON.offset){
					console.log(geoJSON);
					var a = geoJSON.features,	//地区条目数组
						x = 180,
						y = 0,
						s, o, r, p;	//临时变量不重要

					for(var i = 0, len = a.length; i < len; i++){
						s = a[i].properties.name;
						o = a[i].geometry;
						r = o.coordinates;
						for(var j=0,l2=r.length;j<l2;j++){
							if(o.type == 'Polygon'){
								p = r[j];
							}else if(o.type == 'MultiPolygon'){
								p = r[j][0];
							}

							for(var u=0,l3=p.length;u<l3;u++){
								if(p[u][0]<x){
									x = p[u][0];
								}
								if(p[u][1]>y){
									y = p[u][1];
								}
							}
						}
						geoJSON.offset = {
							// x轴的偏移量 需要取实际坐标度数的负值
							x : -x,
							y : y
						};
					}
				}
				// 记录当前地图的偏移量和缩放倍数
				self.offset = geoJSON.offset;
				self.scale = config.scale;

				// 格式化json数据
				geoJSON = self.formatGeoJSON(geoJSON);

				sx = config.scale.x;
				sy = config.scale.y;

				// 绘制path
				$.each(geoJSON,function(k,v){
					var p = canvas.path(v).attr(config.style);
					p.scale(sx, sy, 0, 0);
					self.mapPaths[k] = p;
				});

				// 执行render的回调函数
				callback();

			}).fail(function(){
				canvas.clear();
				canvas.text(self.width/2, self.height/2, '地图数据载入失败！');
			});

		},
		
		// 画点
		setPoint : function(p){
			var self = this,
				// 点的默认样式
				a = {
					"x":0,
					"y":0,
					"r":1,
					"opacity":0.5,
					"fill": "#238CC3",
					"stroke": "#238CC3",
					"stroke-width": 0,
					"stroke-linejoin": "round",
					"cursor":"pointer"
				},
				x, y, c;
				
			$.extend(true, a, p);

			x = (a.x + self.offset.x) * self.scale.x;
			y = (self.offset.y - a.y) * self.scale.y;

			c = self.canvas.circle(x, y, a.r).attr(a);

			return c;
		},
		
		// 画线
		setLine : function(b){
			var self = this,
				a = {
					"ps":[],
					"stroke": "#238CC3",
					"stroke-width": 0.5,
					"stroke-linejoin": "round",
					"cursor":"pointer"
				},
				d = [],
				x, y, l;

			$.extend(true, a, b);

			for(var i=0, len=a.ps.length; i<len; i++){
				x = (a.ps[i].x + self.offset.x) * self.scale.x;
				y = (self.offset.y - a.ps[i].y) * self.scale.y;
				d.push(x+','+y);
			}

			d = 'M' + d.join('L');
			l = self.canvas.path(d).attr(a);

			return l;

		},

		// 格式化地理数据，构成path描述
		formatGeoJSON : function(g){

			var a = g.features,	// 地区条目数组
				x = g.offset.x,	// x轴偏移量
				y = g.offset.y,	// y轴偏移量
				d = {},	// 对象返回值：地区->路径字符串
				s, o, r, p;	// 临时变量不重要

			for(var i = 0, len = a.length; i < len; i++){
				s = a[i].properties.name;
				o = a[i].geometry;
				r = o.coordinates;
				for(var j=0,l2=r.length;j<l2;j++){

					// 判断数据结构，取出点数组的值
					if(o.type == 'Polygon'){
						p = r[j];
					}else if(o.type == 'MultiPolygon'){
						p = r[j][0];
					}

					// 将点数组转换为描述path的字符串
					for(var u=0,l3=p.length;u<l3;u++){
						// 调整地图位置，最左侧为美洲大陆最西端
						// 每洲大陆最西端坐标为西经168.5°左右
						if(p[u][0]< -168.5){
							p[u][0] = p[u][0] + 360;
						}
						p[u] = (p[u][0] + x) + ',' + (y - p[u][1]);
					}
					r[j] = 'M' + p.join('L') + 'z';
				}
				d[s] = r.join('');
			}
			return d;
		}

	});

})(jQuery);
