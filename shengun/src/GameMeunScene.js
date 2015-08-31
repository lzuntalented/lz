var GameObjMap = cc.Node.extend({
	bg1 : null,
	bg2 : null,
	
	ctor : function(){
		this._super();
		
		this.bg1 = new cc.Sprite(res.Background2_png);
		this.bg1.attr({
			x : 0,
			y : 0,
			anchorX : 0,
			anchorY : 0,
		});
		
		this.bg2 = new cc.Sprite(res.Background2_png);
		this.bg2.attr({
			x : PublicData.SCREEN_WIDTH,
			y : 0,
			anchorX : 0,
			anchorY : 0,
		});
//		bg1.x = PublicData.width / 2 ;
//		bg1.y = PublicData.height / 2 ;
		
		this.addChild(this.bg1);
		this.addChild(this.bg2);
		this.scheduleUpdate();
	},
	
	update : function(){
		var next1x = this.bg1.x - 1;
		var next2x = this.bg2.x - 1;
		
		if(next1x < -PublicData.SCREEN_WIDTH){
			this.bg1.x = PublicData.SCREEN_WIDTH;
		}
		
		if(next2x < -PublicData.SCREEN_WIDTH){
			this.bg2.x = PublicData.SCREEN_WIDTH;
		}
		this.bg1.x -= 1;
		this.bg2.x -= 1;
		
		
	}
	
});

var GameMeunLayer = cc.Layer.extend({
	ctor : function(){
		this._super();
		
		var backMap = new GameObjMap();
		
		backMap.attr({
			x: 0,
			y: 0,
			width : PublicData.SCREEN_WIDTH,
			height : PublicData.SCREEN_HEIGHT
		});
		
		
		this.addChild(backMap);
	}
});

var GameMeunScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        var layer = new GameMeunLayer();
        this.addChild(layer);
    }
});