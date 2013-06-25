$(function(){
  var m2 = new GeoMap({
      container: '#citymap',
      background: '#eee'
    }),
    tooltip = $('#tooltip');
  // 创建地图画布
  $.ajax({
    url: '../json/world.geo.json?23322323',
    dataType: 'json'
  }).done(function(data){
    m1 = geodemo(data, '#map', null, null);


      //绘制一个马赛克效果的地图
      /*
      mosaicMap = new GeoMap({
        container: '#mosaic-map',
        background: '#fff',
        mapStyle:{
          'stroke-width': 0,
          fill: '#999'
        },
        scale: {x:2.5, y:2.5}
      });

      mosaicMap.load(data);

      mosaicMap.mosaic();
      */
  });
  $.ajax({
    url: '../json/china.geo.json',
    dataType: 'json'
  }).done(function(data){
    map3 = geodemo(data, '#chinamap', null, null);

    map3.shapes.click(function(){
      var id = this.data('id');
      $.ajax({
        url: '../json/' + id + '.geo.json',
        dataType: 'json'
      }).done(function(data){
          m2.clear();
          m2.scale = null;
          m2.offset = null;
          m2.load(data);
          m2.render();
      });
    });
  });

});

function geodemo(data, container, scale, offset){
  var map = new GeoMap({
      container: container,
      scale: scale,
      offset: offset,
      background: '#fff',
      mapStyle: {
        fill: '#ddd',
        stroke: '#fff'
      }
    }),
    tooltip = $('#tooltip');
  map.load(data);
  map.render();
  map.setPoint({x: 116.4551, y: 40.2539}).attr('r', 5);
  map.shapes.hover(function(){
    var self = this;
    self.animate({
      fill: '#369'
    },100);
  },function(){
    this.animate({
      fill: '#ddd'
    },100)
  }).mousemove(function(e){
      
    e = $.event.fix(e);

      var self = this,
        top = e.pageY,
        left = e.pageX,
        box = map.container.offset(),
        boxTop = top - box.top,
        boxLeft = left - box.left,
        pos = map.getGeoPosition([boxLeft, boxTop]);

      tooltip.html(self.data('properties').name + '<br />指针坐标：<br />lng = ' + pos[0].toFixed(2) + '<br />lat = ' + pos[1].toFixed(2)).css({
        "top" : top + 10,
        "left" : left + 10,
        "line-height" : "200%",
        "font-size": "12px"
      }).show();
    }).mouseout(function(){
      tooltip.empty().hide();
    });
  return map;
}
