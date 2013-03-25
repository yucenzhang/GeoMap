(function($){
  var DrewShape = {
    "Point": function(coordinates){
      coordinates = setOffset(coordinates);
      return coordinates.join(',');
    },
    "LineString": function(coordinates){
      var str = '';
      coordinates.forEach(function(point, idx){
        point = setOffset(point);
        if(idx == 0){
          str = 'M' + point.join(',');
        }else{
          str = str + 'L' + point.join(',');
        }
      });
      return str;
    },
    "Polygon": function(coordinates){
      var str = '';
      coordinates.forEach(function(line, idx){
        str = str + DrewShape.LineString(line) + 'z';
      });
      return str;
    },
    "MultiPoint": function(coordinates){
      var arr = [];
      coordinates.forEach(function(p){
        arr.push(DrewShape.Point(p));
      });
      return arr;
    },
    "MultiLineString": function(coordinates){
      var str = '';
      coordinates.forEach(function(line){
        str += DewShape.LineString(line);
      });
      return str;
    },
    "MultiPolygon": function(coordinates){
      var str = '';
      coordinates.forEach(function(line){
        str += DrewShape.Polygon(line);
      });
      return str;
    },
    "GeometryCollection": function(){}
  };

  function setOffset(p){
    var x = (p[0] < -168.5 ? p[0] + 360 : p[0]) + 170,
        y = 90 - p[1];
    return [x, y];
  }

  var GeoMap = function(cfg){
    var self = this;

    defaultCfg = {
      container: 'body',
      width: '100%',
      height: '100%',
      offset: {
        x: 170, y: 90
      },
      scale:{
        x: 2.6, y: 3
      },
      mapStyle: {
        'fill': '#000',
        'stroke': '#0c0',
        'stroke-width': 0.7
      }
    };
    $.extend(true, defaultCfg, cfg);
    self.container = $(defaultCfg.container);
    self.width = defaultCfg.width || self.container.width();
    self.height = defaultCfg.height || self.container.height();
    self.canvas = new Raphael(self.container.get(0), self.width, self.height);
    self.mapStyle = defaultCfg.mapStyle;
    self.scale = defaultCfg.scale,
    self.shapes = {};
    self.json = null;
    self.paths = null;
  };

  GeoMap.prototype = {
    load: function(json){
      this.paths = this.json2path(json);
    },
    render: function(){
      var self = this,
          paths = self.paths,
          canvas = self.canvas,
          style = self.mapStyle,
          aPath = null,
          scalex = self.scale.x,
          scaley = self.scale.y;
      paths.forEach(function(path){
        aPath = canvas.path(path.path).attr(style).scale(scalex, scaley, 0, 0);
      });
    },
    json2path: function(json){
      var self = this,
        offset = self.offset,
        shapes = json.features,
        shapeType,
        shapeCoordinates,
        str,
        pathArray = [];
      shapes.forEach(function(shape, idx, arr){
        if(shape.type !== 'Feature') return;
        shapeType = shape.geometry.type;
        shapeCoordinates = shape.geometry.coordinates;
        str = DrewShape[shapeType](shapeCoordinates);
        pathArray.push({
          type: shapeType,
          path: str,
          property: shape.geometry.properties
        });
      });
      return pathArray;
    }
  };
  window.GeoMap = GeoMap;
})(jQuery);
