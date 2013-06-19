GeoMap.prototype.mosaic = function(cfg){

  var deCfg = {
    fill: '#333',
    'stroke-width': 0,
    opacity: 0.8,
    sideSize: 10
  };

  var self = this,
    sideSize = deCfg.sideSize,
    halfSideSize = sideSize / 2,
    left = self.left - halfSideSize,
    top = self.top - halfSideSize,
    width = self.width + left,
    height = self.height + top,
    shapes = self.shapes;

  var arrPos = [];

  var i, j, ilen, jlen, x, y, temKey;

  for(i = 0, ilen = width / sideSize; i < ilen; i++){

    x = i * sideSize + halfSideSize;

    for(j = 0, jlen = height / sideSize; j < jlen; j++){

      y = j * sideSize + halfSideSize;

      temKey = false;

      shapes.forEach(function(shape, idx, arr){

        if(shape.isPointInside(x, y)) temKey = true;

      });
      console.log(temKey);

      if(temKey) arrPos.push([x, y]);

    }

  }

  console.log(arrPos);

};