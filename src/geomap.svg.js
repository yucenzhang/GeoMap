var GeoMap = function(cfg){
  var self = this,
    defaultCfg = {
      container: 'body',
      offset: null,
      scale: null,
      mapStyle: {
        'fill': '#fff',
        'stroke': '#999',
        'stroke-width': 0.7
      },
      background:'#fff',
      sideSize: 4
    };

  $.extend(true, defaultCfg, cfg);

  self.container = $(defaultCfg.container);

  self.offset = defaultCfg.offset;
  self.scale = defaultCfg.scale;

  if(self.container.length == 0){
    throw new Error('map container is not defined!');
  }

  self.width = defaultCfg.width || self.container.width();
  self.height = defaultCfg.height || self.container.height();
  self.canvas = new Raphael(self.container.get(0), self.width, self.height);
  self.shapes = self.canvas.set();
  self.config = defaultCfg;
  self.paths = null;
};

GeoMap.prototype = {
  clear: function(){
    this.offset = null;
    this.scale = null;
    this.shapes.remove();
  },
  load: function(json){
    this.paths = json2path(json, this);
  },
  render: function(){
    var self = this,
      shapes = self.shapes,
      paths = self.paths,
      canvas = self.canvas,
      config = self.config,
      style = config.mapStyle,
      aPath = null, i, len, currentPath;

    for(i = 0, len = paths.length; i < len; i++){
      currentPath = paths[i];
      if(currentPath.type == 'point' || currentPath.type == 'MultiPoint'){
        //TODO
      }else{
        aPath = canvas.path(currentPath.path).data({'properties': currentPath.properties, 'id': currentPath.id}).attr(style);
      }
      shapes.push(aPath);
    }

  },
  /*!
      将平面上的一个点的坐标，转换成实际经纬度坐标
   */
  getGeoPosition: function(p){
    var self = this,
      x = p[0],
      y = p[1];

    x = x / self.scale.x + self.offset.x - 170;
    x = x > 180 ? x - 360 : x;
    y = 90 - (y / self.scale.y + self.offset.y);

    return [x, y];
  },
  geo2pos: function(p){
    var self = this;
    convertor.offset = self.offset;
    convertor.scale = self.scale;
    if(typeof p.x != 'number') p.x *= 1;
    if(typeof p.y != 'number') p.y *= 1;
    p = convertor.makePoint([p.x, p.y]);
    return p;
  },
  setPoint: function(p){
    // 点的默认样式
    var	self = this,
      a = {
        "x": 0,
        "y": 0,
        "r": 1,
        "opacity": 0.5,
        "fill": "#238CC3",
        "stroke": "#238CC3",
        "stroke-width": 0,
        "stroke-linejoin": "round"
      };
    p = self.geo2pos(p);
    p = {x:p[0],y:p[1]};
    $.extend(true, a, p);
    return self.canvas.circle(p.x, p.y, a.r).attr(a);
  },
  line: function(type, points){ 
    // type: 'geo' or 'plane' or 'points', default 'geo'
    // points: [{x:1,y:1}, {x:2, y:2}, ...]
    if(typeof type !== 'string'){
      points = type;
      type = 'geo';
    }
    var makePathString = type == 'geo' ? 
      function(p){ 
        return p.x + ',' + p.y;
      } : function(p){
        p = geo2pos(p);
        return p[0] + ',' + p[1];
      };
    var str = '';
    var op = '';
    $.each(points, function(k, v){
      op = k == 0 ? 'M' : 'L';
      str += op + makePathString(v);
    });
    return this.canvas.path(str);
  },
  drawLineByMapPoints: function(pointsArray){
    var str = '';
    var op = '';
    $.each(pointsArray, function(k, v){
      op = k == 0 ? 'M' : 'L';
      str += op + v.attrs.x + ',' + v.attrs.y;
    });
    return this.canvas.path(str);
  }
};

//TODO: heat map
