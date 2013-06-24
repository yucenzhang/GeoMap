GeoMap.isPointInsidePath = function(pts, pt) {
  var i,
    j,
    k,
    n = pts.length,
    wn = 0;

  for(i = n-1, j = 0; j < n; i = j, j++) {
    k = (pt[0] - pts[i][1]) * (pts[j][2] - pts[i][2]) - (pts[j][1] - pts[i][1]) * (pt[1] - pts[i][2]);
    if((pt[1] >= pts[i][2] && pt[1] <= pts[j][2])||(pt[1] <= pts[i][2] && pt[1] >= pts[j][2])) {
      if( k < 0){
        wn++;
      }else if(k > 0){
        wn--;
      }else{
        if( (pt[1] <= pts[i][2] && pt[1] >= pts[j][2] && pt[0] <= pts[i][1] && pt[0] >= pts[j][1]) ||
          (pt[1] <= pts[i][2] && pt[1] >= pts[j][2] && pt[0] >= pts[i][1] && pt[0] <= pts[j][1]) ||
          (pt[1] >= pts[i][2] && pt[1] <= pts[j][2] && pt[0] <= pts[i][1] && pt[0] >= pts[j][1]) ||
          (pt[1] >= pts[i][2] && pt[1] <= pts[j][2] && pt[0] >= pts[i][1] && pt[0] <= pts[j][1]) ){
          return 0; //点在多边形边界上
        }
      }

    }
  }
  if(wn == 0){
    return 1; //点在多边形外部
  }else{
    return -1; //点在多边形内部
  }
};


GeoMap.prototype.mosaic = function() {

	var self = this,
	shapes = self.shapes,
	paths = self.paths,
	canvas = self.canvas,
	config = self.config,
	style = config.mapStyle,
	offset = config.offset,
	scale = config.scale,
	background = config.background,
	width = self.width,
	height = self.height,
	mapleft = convertor.xmin,
	maptop = convertor.ymin,
	mapwidth = convertor.xmax - convertor.xmin,
	mapheight = convertor.ymax - convertor.ymin,
	aPath = null,
  sideSize = config.sideSize,
  halfSide = sideSize / 2,
	back, i, len, currentPath;

	if (!scale) {
		var temx = width / mapwidth,
		temy = height / mapheight;
		temx > temy ? temx = temy: temy = temx;
		temx = temy * 0.73;
		self.config.scale = scale = {
			x: temx,
			y: temy
		};
	}

	if (!offset) {
		self.config.offset = offset = {
			x: mapleft,
			y: maptop
		};
	}

	back = canvas.rect(mapleft, maptop, mapwidth, mapheight).scale(scale.x, scale.y, 0, 0).attr({
		'fill': background,
		'stroke-width': 0
	});

	for (i = 0, len = paths.length; i < len; i++) {
		currentPath = paths[i];
		if (currentPath.type == 'point' || currentPath.type == 'MultiPoint') {
			//TODO
		} else {
			aPath = canvas.path(currentPath.path).data({
        'ps': currentPath.path,
				'properties': currentPath.properties,
				'id': currentPath.id
			}).attr({
        'fill': background,
        'stroke-width': 0
      });
		}
		shapes.push(aPath);
	}

  var arrPos = [],
    bbox,
    startX,
    startY,
    i,
    j,
    temX,
    temY;

  shapes.forEach(function(v){

    bbox = v.getBBox();
    startX = ~~( (bbox.x - halfSide) / sideSize ) * sideSize;
    startY = ~~( (bbox.y- halfSide) / sideSize ) * sideSize;
    i, j;
    temX, temY;

    for(i = 0; i * sideSize + startX <= bbox.x2; i++){
      
      temX = i * sideSize + startX;

      for(j = 0; j * sideSize + startY <= bbox.y2; j++){

        temY = j * sideSize + startY;

        if(GeoMap.isPointInsidePath(v.attrs.path, [temX, temY]) != 1){
          arrPos.push([temX, temY]);
        }

      }

    }
  
  });

  arrPos.forEach(function(v){

    canvas.rect(v[0] - 1, v[1] - 1, sideSize * 0.8, sideSize * 0.8)
      .attr(style)
      .scale(scale.x, scale.y, offset.x, offset.y);

  });

};

