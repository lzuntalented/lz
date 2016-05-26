var DiamondSprite = cc.Layer.extend({
	type : null,
	drawNode : null,
	vector : [],
	ctor : function(type){
		this._super();
		
		this.anchorX = 0;
		this.anchorY = 1;
		
		this.type = type;
		this.vector = [];
		this.drawItem(type);
	},
	
	drawItem : function(type){
		switch (type){
			case 1:
				this.drawPoint(cc.p(0,0 + PublicData.item_height),true);
				break;
			case 2:
				this.drawTian();
				break;
			case 3:
				this.drawTu();
				break;
			case 4:
				this.drawLong();
				break;
				
			default:
				break;
		}
	},
	
	drawPoint : function(orgin,tag){
		var orgin = orgin || cc.p(0,0);
		var sprite = new cc.Sprite('res/color_'+this.type+'.png');
		sprite.attr({
			anchorX : 0,
			anchorY : 1,
			x : orgin.x,
			y : orgin.y - PublicData.item_height,
		})
		this.addChild(sprite);
		
		if(tag){
			this.width = PublicData.item_width;
			this.height = PublicData.item_height;
			console.log(this.height);
			this.vector.push([0,0]);
		}
//		var orgin = orgin || cc.p(0,0);
//		var dest = dest || cc.p(PublicData.dialmond_width,PublicData.dialmond_height);
//		var color = color || cc.color(255,0,0,this.opacity);
//		
//      
//      var draw = this.drawNode;
//      draw.drawRect(orgin,dest,color);
//      this.addChild(res.Color_0_png);
	},
	
	drawTian : function(){
		this.drawPoint();
		this.drawPoint(
			cc.p(PublicData.item_width,0)
		);
		this.drawPoint(
			cc.p(0,PublicData.item_height)
		);
		this.drawPoint(
			cc.p(PublicData.item_width , PublicData.item_height)
		);
		this.width = PublicData.item_width * 2;
		this.height = PublicData.item_height * 2;
		
		this.vector.push([0,0]);
		this.vector.push([0,1]);
		this.vector.push([-1,0]);
		this.vector.push([-1,1]);
	},
	
	drawTu : function(dir){
//		if(dir == 0){
			this.drawPoint(cc.p(PublicData.item_width , 0));
			this.drawPoint(cc.p(0 , PublicData.item_height));
			this.drawPoint(cc.p(PublicData.item_width , PublicData.item_height));
			this.drawPoint(cc.p(PublicData.item_width * 2, PublicData.item_height));
			
			this.width = PublicData.item_width * 3;
			this.height = PublicData.item_height * 2;
			
			this.vector.push([0,0]);
			this.vector.push([0,1]);
			this.vector.push([0,2]);
			this.vector.push([-1,1]);
//		}else if(dir == 1){
//			
//		}else if(dir == 2){
//			
//		}else if(dir == 3){
//			
//		}
		
		
		
	},
	
	drawLong : function(dir){
//		if(dir == 0){
			this.drawPoint(cc.p(0,0 + PublicData.item_height));
			this.drawPoint(cc.p(PublicData.item_width , 0 + PublicData.item_height));
			this.drawPoint(cc.p(PublicData.item_width * 2 , 0 + PublicData.item_height));
			this.drawPoint(cc.p(PublicData.item_width * 3 , 0 + PublicData.item_height));
			
			this.width = PublicData.item_width * 4;
			this.height = PublicData.item_height;
			
			this.vector.push([0,0]);
			this.vector.push([0,1]);
			this.vector.push([0,2]);
			this.vector.push([0,3]);
//		}else if(dir == 1){
//			
//		}else if(dir == 2){
//			
//		}else if(dir == 3){
//			
//		}
		
		
		
	},
	
	setAlpha : function(num){
		this.removeChild(this.drawNode);
		this.opacity = num;
		this.drawItem(this.type);
	}
});
