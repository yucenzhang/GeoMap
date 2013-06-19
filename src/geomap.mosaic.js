GeoMap.prototype.mosaic = function(cfg) {

	// todo: 需要将render方法的前一半copy过来，在各个path未变换matrix前使用getBBox和isPointInside
	var deCfg = {
		fill: '#333',
		'stroke-width': 0,
		opacity: 0.8,
		sideSize: 10
	};

	var self = this,
	shapes = self.shapes,
	paths = self.paths,
	canvas = self.canvas,
	config = self.config,
	style = config.mapStyle,
	offset = config.offset,
	scale = config.scale,
	background = config.background,
	crossline = config.crossline,
	width = self.width,
	height = self.height,
	left = self.left + 5,
	top = self.top + 7,
	mapleft = convertor.xmin,
	maptop = convertor.ymin,
	mapwidth = convertor.xmax - convertor.xmin,
	mapheight = convertor.ymax - convertor.ymin,
	aPath = null,
	linehead, linex, liney, back, i, len, currentPath;

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

  var arrPos = [];
  var sideSize = 1;
  var halfSide = sideSize / 2;

  shapes.forEach(function(v, idx){
  
    if(idx > 30 || idx < 30) return;

    var bbox = v.getBBox();
    var startX = bbox.x;
    var startY = bbox.y;
    var i, j, oKey;
    var temX, temY;

    //console.log(bbox);

    for(i = 0; i * sideSize < bbox.width; i++){
      
      temX = i * sideSize + startX;

      for(j = 0; j * sideSize < bbox.height; j++){

        temY = j * sideSize + startY;

        console.log(temX + ' , ' + temY);
        
//        canvas.circle(temX, temY, i);
        

        if(Raphael.isPointInsidePath(v.data('ps'), temX, temY)){
        //if(v.isPointInside(temX, temY)){

          arrPos.push([temX, temY]);

        }

      }

    }
  
  });


  console.log(arrPos);
  
  arrPos.forEach(function(v){
  
    canvas.circle(v[0], v[1], 5);
  
  });


  /*

	if (Raphael.svg) {
		canvas.setViewBox(offset.x, offset.y, width, height, false);
		shapes.attr(style).scale(scale.x, scale.y, mapleft, maptop);
	} else {
		shapes.attr(style).translate(offset.x - 450, offset.y - 50).scale(scale.x, scale.y, mapleft, maptop);
	}

  */

};

