$(function(){
  // 创建地图画布
  $.ajax({
    url: '../json/world.geo.json',
    dataType: 'json'
  }).done(function(data){
    m1 = geodemo(data, '#map', {x:2.5,y:3}, null);
  });
  $.ajax({
    url: '../json/0.json',
    dataType: 'json'
  }).done(function(data){
    map = geodemo(data, '#chinamap', {x:5.9, y:8.1}, null);
    map.shapes.click(function(){
      var id = this.data('id');
      $.ajax({
        url: '../json/' + id + '.json',
        dataType: 'json'
      }).done(function(data){
        m2 = geodemo(data, '#citymap', null, null);
      });
    });
  });
});

function geodemo(data, container, scale, offset){
  var map = new GeoMap({
      container: container,
      scale: scale,
      offset: offset,
      background: '#eee'
    }),
    tooltip = $('#tooltip');
  map.load(data);
  map.render();
  map.setPoint({x: 116.4551, y: 40.2539}).attr('r', 5);
  map.shapes.hover(function(e){
    var self = this;
    self.animate({
      fill: '#369'
    },100);
  },function(){
    this.animate({
      fill: '#fff'
    },100)
  }).mousemove(function(e){
      var self = this,
        $win = $(window),
        top = $win.scrollTop() + e.clientY,
        left = $win.scrollLeft() + e.clientX,
        pos = map.getGeoPosition([e.layerX + map.config.offset.x, e.layerY + map.config.offset.y]);

      tooltip.html(self.data('properties').name + '<br />指针坐标：<br />lng = ' + pos[0].toFixed(2) + '<br />lat = ' + pos[1].toFixed(2)).css({
        "top" : top + 20,
        "left" : left + 20,
        "line-height" : "200%",
        "font-size": "12px"
      }).show();
    }).mouseout(function(){
      tooltip.empty().hide();
    });
  return map;
}
