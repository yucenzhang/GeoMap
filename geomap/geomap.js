/**
 * User: yangdongxu
 * Date: 12-12-29
 * Time: 上午9:59
 *
 * 矢量地图展示
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
		
		// 地图上的所有区块
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
			
	        // 记录当前地图的偏移量和缩放倍数

            if(!geoJSON.offset){
                console.log(geoJSON);
                var a = geoJSON.features,	//地区条目数组
                	x = 180,//g.offset.x,	//x轴偏移量
        	        y = 0,//g.offset.y,	//y轴偏移量
                	d = {},	//对象返回值：地区->路径字符串
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
                            // 调整地图位置，最左侧为美洲大陆最西端
                //            if(p[u][0]< -168.5){
                //                p[u][0] = p[u][0] + 360;
                //            }
                //            p[u] = (p[u][0] + x) + ',' + (y - p[u][1]);
                        }
                //        r[j] = 'M' + p.join('L') + 'z';
                    }
                    geoJSON.offset = {
                        x:-x,y:y
                    };
                    console.log(geoJSON.offset);
                //    d[s] = r.join('');
                }

            }

	        self.offset = geoJSON.offset;
	        self.scale = config.scale;
			
			geoJSON = self.formatGeoJSON(geoJSON);
			
			sx = config.scale.x;
			sy = config.scale.y;
			
			$.each(geoJSON,function(k,v){
				var p = canvas.path(v).attr(config.style);
				p.scale(sx, sy, 0, 0);
				self.mapPaths[k] = p;
			});
			
			callback();
			
		}).fail(function(){
			canvas.clear();
			canvas.text(self.width/2, self.height/2, '地图数据载入失败！');
		}).always(function(){

		});
		
	},
	setPoint : function(p){
		var self = this,
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
	
	//格式化地理数据，构成path描述
	formatGeoJSON : function(g){
        
        var a = g.features,	//地区条目数组
        	x = g.offset.x,	//x轴偏移量
        	y = g.offset.y,	//y轴偏移量
        	d = {},	//对象返回值：地区->路径字符串
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
                    // 调整地图位置，最左侧为美洲大陆最西端
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
