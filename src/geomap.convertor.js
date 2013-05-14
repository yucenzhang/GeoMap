var convertor = {
  "xmin": 360,
  "xmax": 0,
  "ymin": 180,
  "ymax": 0,
  /*!Private
      让阿拉斯加地区在地图右侧显示
   */
  "formatPoint": function(p){
    return [
      (p[0] < -168.5 ? p[0] + 360 : p[0]) + 170, 
      90 - p[1]
    ];
  },
  "makePoint": function(p){
    var self = this,
      point = self.formatPoint(p),
      x = point[0],
      y = point[1];
    if(self.xmin > x) self.xmin = x;
    if(self.xmax < x) self.xmax = x;
    if(self.ymin > y) self.ymin = y;
    if(self.ymax < y) self.ymax = y;
    return [x, y];
  },
  "Point": function(coordinates){
    coordinates = this.makePoint(coordinates);
    return coordinates.join(',');
  },
  "LineString": function(coordinates){
    var str = '',
      self = this,
      i = 0,
      len = coordinates.length,
      point;

    for( ; i < len; i++){
      point = self.makePoint(coordinates[i]);
      if(i == 0){
        str = 'M' + point.join(',');
      }else{
        str = str + 'L' + point.join(',');
      }
    }
    return str;
  },
  "Polygon": function(coordinates){
    var str = '',
      i = 0,
      len = coordinates.length;

    for(; i < len; i++){
      str = str + convertor.LineString(coordinates[i]) + 'z';
    }
    return str;
  },
  "MultiPoint": function(coordinates){
    var arr = [],
      i = 0,
      len = coordinates.length;
    for(; i < len; i++){
      arr.push(convertor.Point(coordinates[i]));
    }
    return arr;
  },
  "MultiLineString": function(coordinates){
    var str = '',
      i = 0,
      len = coordinates.length;
    for(; i < len; i++){
      str += convertor.LineString(coordinates[i]);
    }
    return str;
  },
  "MultiPolygon": function(coordinates){
    var str = '',
      i = 0,
      len = coordinates.length;
    for(; i < len; i++){
      str += convertor.Polygon(coordinates[i]);
    }
    return str;
  }
};
