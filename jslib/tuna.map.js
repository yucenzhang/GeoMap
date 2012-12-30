(function(){
TN.Class.def('SB.ChinaMap', TN.Class.TNObject, {
    init:function(container, config) {
        var self = this;
        self.superMethod();

        self.container = jQuery(container);
        self.width = self.container.width();
        self.height = self.container.height();
        self.canvas = Raphael(self.container.get(0), self.width, self.height);
        self.pathMap = {};
        self.tooltip = jQuery('<div class="chinamap-tooltip"><div class="tooltip-corner"></div><div class="tooltip-content"></div></div>').hide().appendTo(document.body);
        self.tooltipContent = self.tooltip.find('.tooltip-content');

        var defaultConfig = {
            hoverColor: "#CABEE9",
            'defaultPathAttr':{
                "fill": "#CFEBF7",
                "stroke": "#FFF",
                "stroke-width": 1,
                "stroke-linejoin": "round",
                'cursor':'pointer'
            },
            buildToolTip:function(path){
                return 'good';
            }
        };

        self.config = jQuery.extend(true, defaultConfig, config);
        self.renderMap();
    },
    showToolTip:function(tip, x, y) {
        var self = this;
        if (self.tipTimer) {
            clearTimeout(self.tipTimer);
            self.tipTimer = null;
        }
        self.tooltipContent.html(tip);
        self.tooltip.css({
        'left':x + 'px',
        'top':y + 30 + 'px'
        }).show();
    },
    hideToolTip:function() {
        var self = this;
        if (self.tipTimer) return;
        self.tipTimer = setTimeout(function(){
                self.tooltip.hide();
        }, 100);
    },
    renderMap:function() {
        var self = this;
        var path;
        for (var provinceName in CHINA_PATH) {
            path = self.canvas.path(CHINA_PATH[provinceName]).attr(self.config['defaultPathAttr']).data('name',provinceName);
            path.scale(1, 1, 0, 0);
//            path.translate(-40, -30);

            self.pathMap[provinceName] = path; 
            path.hover(function(e) {
                this.lastColor = this.attr('fill');
                this.attr({
                    fill:self.config.hoverColor
                });

                e = jQuery.event.fix(e);
                self.showToolTip(self.config.buildToolTip(this), e.pageX, e.pageY); 
            }, function () {
                this.attr({
                    fill: this.lastColor
                });
                self.hideToolTip();
            });

            path.mousemove(function(e){
                e = jQuery.event.fix(e);
                self.showToolTip(self.config.buildToolTip(this), e.pageX, e.pageY); 
            });
        }
    },
    renderData:function(data) {
        var self = this;
        jQuery.each(self.pathMap, function(i, v){
            v.data('data', null);
        });

        jQuery.each(data, function(i, v){
            var province = v['province'];
            var path = self.pathMap[province];
            if (!path) {
                TN.warn('unkown province ' + province);
                return;
            }
            path.data('data', v);
            path.attr({'fill':v['color']});
        });
    }
});

TN.Class.def('SB.ChinaMapPro', SB.ChinaMap, {
	renderMap:function(){
	        var self = this;
        var path;
        for (var i=0,len=chinamap.length;i<len;i++) {
            path = self.canvas.path(chinamap[i]).attr(self.config['defaultPathAttr']);
            path.scale(10, 13, 0, 0);
            path.translate(-60, 60);
       
            path.hover(function(e) {
                this.lastColor = this.attr('fill');
                this.attr({
                    fill:self.config.hoverColor
                });

                e = jQuery.event.fix(e);
                self.showToolTip(self.config.buildToolTip(this), e.pageX, e.pageY); 
            }, function () {
                this.attr({
                    fill: this.lastColor
                });
                self.hideToolTip();
            });

            path.mousemove(function(e){
                e = jQuery.event.fix(e);
                self.showToolTip(self.config.buildToolTip(this), e.pageX, e.pageY); 
            });
        }
	},
	setPoint:function(p){
		var self = this;
		p.x *= 10;
		p.y *= 13; 
		var c = self.canvas.circle(p.x,p.y,3).attr({
			"fill": "#c00",
			"stroke": "#FFF",
			"stroke-width": 0,
			"stroke-linejoin": "round",
			'cursor':'pointer'
		});
		c.translate(-600,60*13);
	},
	setLine:function(s,e){
		var self = this;
		var m = 'M' + s.x + ',' + (-s.y) + 'L' + e.x + ',' + (-e.y);
		console.log(m);
		var path = self.canvas.path(m).attr({
                "fill": "#CFEBF7",
                "stroke": "#c00",
                "stroke-width": 1,
                "stroke-linejoin": "round",
                'cursor':'pointer'
        });
		path.scale(10, 13, 0, 0);
		path.translate(-60, 60);
	}
});



})();
