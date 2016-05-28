
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    map : [],//存放网格状态的数组
    map_sprite : [],//存放网格放置的精灵数组
    
   	drag_index : null,//当前正在拖动精灵的序列
   	array_bottom : [],//底部三个可供拖拽的精灵
   	
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        
//      var spiret = new cc.Sprite(res.HelloWorld_png);
//      this.addChild(spiret,11);
//      spiret.opacity = 100;
        
//		this.setOpacity(200);
		this.createGridView();
		this.createBottom();
		
//		var item = new DiamondSprite(2);
//		item.attr({
//			anchorX : 0.5,
//			anchorY : 0.5,
//		});
//		this.addChild(item);
//		console.log(item);
//		item.setPosition(cc.p(100,100));
//		item.rotation = 40;
//		
//		
//		var item2 = new DiamondSprite(2);
//		this.addChild(item2);
//		item2.setPosition(cc.p(100,100));
		var self = this;
		
		cc.eventManager.addListener({
        	event:cc.EventListener.TOUCH_ONE_BY_ONE,
        	swallowTouches: true,
        	onTouchBegan:  function(touch, event){
        		var point  = touch.getLocation();
        		var y_offset = (cc.winSize.height - (PublicData.dialmond_height + 3) * PublicData.gridview_row) / 2;
        		if(point.y > point){
        			return ;
        		}
        		var x = Math.floor(point.x / (cc.winSize.width / 3));
//      		console.log(point.x + '-' + cc.winSize.width + "-" + (cc.winSize.width / 3) + "-" + x);
				self.drag_index = x;
				self.array_bottom[x].zIndex = 2;
	        	return true;
	    	},
	    	onTouchMoved : function(touch, event){
	            var endTouch  = touch.getLocation();

	            var offsetX = endTouch.x;
	            var offsetY = endTouch.y ;
	            var x = offsetX - self.array_bottom[self.drag_index].width / 2;
	            var y = offsetY + self.array_bottom[self.drag_index].height + PublicData.item_height;
//	            console.log(offsetY + "==" + y);
	            self.array_bottom[self.drag_index].setPosition(cc.p(x,y));
//	            item2.x = offsetX;
//	            item2.y = offsetY;
//	            item2.opacity = 0.6;
//	            
//	            self.showSelectBorder(offsetX,offsetY,1);
	    	},
	    	onTouchEnded : function(touch, event){
				var endTouch  = touch.getLocation();

	            var offsetX = endTouch.x;
	            var offsetY = endTouch.y ;
	            var point = {
	            	x : offsetX - self.array_bottom[self.drag_index].width / 2,
	            	y : offsetY + self.array_bottom[self.drag_index].height + PublicData.item_height
	            }
	            var ret = self.getTouchPoint(point);
	            if(ret.col >= PublicData.gridview_col || ret.col < 0
	            	|| ret.row >= PublicData.gridview_row || ret.row < 0
	            ){
	            	self.setBottomBack(self);
	            	return ;
	            }
	            
	            
	            var list = self.array_bottom[self.drag_index].vector;
	            for(var i = 0 ; i < list.length ; ++i){
	            	var map_row = list[i][0] + ret.row;
	            	var map_col = list[i][1]  + ret.col;
	            	if(map_row < 0 || map_row >= PublicData.gridview_row){
	            		self.setBottomBack(self);
	            		return;
	            	}
	            	if(map_col < 0 || map_col >= PublicData.gridview_col){
	            		self.setBottomBack(self);
	            		return;
	            	}
	            	if(self.map[map_row][map_col] == 1){
	            		self.setBottomBack(self);
	            		return;
	            	}
	            }

	            for(var i = 0 ; i < list.length ; ++i){
	            	self.map[list[i][0] + ret.row][list[i][1]  + ret.col] = 1;
	            	self.createGridViewItem(list[i][0] + ret.row,list[i][1]  + ret.col,self.array_bottom[self.drag_index].type);
	            }
//	            self.array_bottom[self.drag_index].setPosition(cc.p(ret.x,ret.y));
	            self.removeChild(self.array_bottom[self.drag_index]);
	            self.array_bottom[self.drag_index] = null;
				self.createBottomByIndex(self,self.drag_index);
				self.clearLine();
				if(!self.checkGameOver()){
					alert("Game Over");
				}
//				console.log(self.map);
	    	}
        },this);
		
        return true;
   	},
   	
   	/*游戏结束检测*/
   	checkGameOver : function(){
   		
		for(var i = 0;i < PublicData.gridview_row ; ++i) {
   			for(var j = 0; j < PublicData.gridview_col ; ++j){
   				if(this.map[i][j] == 1 ){
   					continue;
   				}
   				
   				for(var k = 0; k < this.array_bottom.length ; ++ k){
   					var list = this.array_bottom[k].vector;
   					var tag = 1;
   					for(var l = 0 ; l < list.length ; ++l){
   						var row = i + list[l][0];
   						var col = j + list[l][1];
   						
   						if(row < 0 || row >= PublicData.gridview_row){
   							tag = 3;
   							break;
		            	}
		            	if(col < 0 || col >= PublicData.gridview_col){
		            		tag = 3;
		            		break;
		            	}
		            	
   						if(this.map[row][col] == 1){
   							tag = 2;
   							break;
   						}
   					}
   					if(tag == 1) return true;
   				}
   			}
		}
		
		return false;
   	},
   	
   	/*清理满行*/
   	clearLine : function(){
   		for(var i = 0;i < PublicData.gridview_row ; ++i) {
   			var tag = true;
   			
   			for(var j = 0; j < PublicData.gridview_col ; ++j){
   				if(this.map[i][j] != 1 ){
   					tag = false;
   					break;
   				}
   			}
   			
   			if(tag){
   				for(var j = 0; j < PublicData.gridview_col ; ++j){
	   				this.map[i][j] = 0 ;
	   				this.removeChild(this.map_sprite[i][j]);
					this.map_sprite[i][j] = null ;
	   			}
   			}
   		}
   	},
   	
   	/*通过给定序列创建一个网格精灵*/
   	createGridViewItem : function(row,col,type){
   		var x_offset = (cc.winSize.width - (PublicData.dialmond_width + 3) * PublicData.gridview_col) / 2;
		var y_offset = (cc.winSize.height - (PublicData.dialmond_height + 3) * PublicData.gridview_row) / 2;
		var sprite = new cc.Sprite('res/color_'+type+'.png');
		sprite.attr({
			x : (PublicData.dialmond_width + 3) * col + x_offset,
			y : (PublicData.dialmond_height + 3) * row + y_offset + PublicData.dialmond_height / 2,
			anchorX : 0,
			anchorY : 1
		});
		this.addChild(sprite);
		this.map_sprite[row][col] = sprite;
   	},
   	
   	/*当前拖拽不合规范，重置拖拽精灵到底部*/
   	setBottomBack : function(self){
   		var y_offset = (cc.winSize.height - (PublicData.dialmond_height + 3) * PublicData.gridview_row) / 2;
		
		self.array_bottom[self.drag_index].attr({
			x : (cc.winSize.width / 3 * this.drag_index )+ (cc.winSize.width / 6) - self.array_bottom[self.drag_index].width / 2,
			y : (y_offset - PublicData.dialmond_height) / 2 + self.array_bottom[self.drag_index].height / 2,
		});	
   	},
   	
   	/*创建指定序列的底部精灵*/
   	createBottomByIndex : function(self,idx){
   		var y_offset = (cc.winSize.height - (PublicData.dialmond_height + 3) * PublicData.gridview_row) / 2;
		
		var type = Math.floor(Math.random() * 4) + 1;
		var sprite = new DiamondSprite(type);
		sprite.attr({
			x : (cc.winSize.width / 3 * idx) + (cc.winSize.width / 6) - sprite.width / 2,
			y : (y_offset - PublicData.dialmond_height) / 2 + sprite.height / 2,
		});	
		self.addChild(sprite);
		self.array_bottom[idx] = sprite;
   	},
   	
   	/*返回当前触摸点对应的网格序列*/
   	getTouchPoint : function(point){
   		var result = {
   			col : 0,
   			row : 0,
   			x : 0,
   			y : 0,
   		};
   		var start_x = (cc.winSize.width - PublicData.item_width * PublicData.gridview_col) / 2;
   		var start_y = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2;
   		
   		var col = Math.floor((point.x - start_x) / PublicData.item_width);
// 		console.log("col" + col);
   		var col_increa = (point.x - start_x) % PublicData.item_width;
   		if(col_increa > PublicData.item_width / 2){
   			++col;
   		}
   		
   		var row = Math.floor((point.y - start_y) / PublicData.item_height);
// 		console.log("row" + row);
   		var row_increa = (point.y - start_y) % PublicData.item_height;
   		if(row_increa > PublicData.item_height / 2){
   			++row;
   		}
// 		if(row_increa < PublicData.item_height / 2 && col_increa < PublicData.item_width / 2){
// 			--row;
// 			--col;
// 		}
// 		console.log(point.x + "--" + start_x + "==" + point.y + '--' + start_y);
   		result.col = col;
   		result.row = row;
   		result.x = start_x + col * PublicData.item_width;
   		result.y = start_y + PublicData.dialmond_height / 2 + row * PublicData.item_height;
// 		console.log(result);
   		return result;
   	},
   	
   	/*创建网格背景*/
   	createGridView : function(){

   		for(var i = 0 ; i < PublicData.gridview_row ; i++){
   			var tmp = [];
   			var map_tmp = [];
   			for(var j = 0  ; j < PublicData.gridview_col ; j++){
				tmp.push(0);
				map_tmp.push(null);
				
				var x_offset = (cc.winSize.width - (PublicData.dialmond_width + 3) * PublicData.gridview_col) / 2;
				var y_offset = (cc.winSize.height - (PublicData.dialmond_height + 3) * PublicData.gridview_row) / 2;
				var sprite = new cc.Sprite(res.Color_0_png);
				sprite.attr({
					x : (PublicData.dialmond_width + 3) * j + x_offset,
					y : (PublicData.dialmond_height + 3) * i + y_offset + PublicData.dialmond_height / 2,
					anchorX : 0,
					anchorY : 1
				});
				this.addChild(sprite);
   			}
   			this.map.push(tmp);
   			this.map_sprite.push(map_tmp);
   		}
   	},
   	
   	/*创建底部三个可供拖动的精灵*/
   	createBottom : function(){
		var y_offset = (cc.winSize.height - (PublicData.dialmond_height + 3) * PublicData.gridview_row) / 2;
		
   		for(var i = 0 ; i < 3 ; i++){
   			var type = Math.floor(Math.random() * 4) + 1;
// 			console.log('type====' + type);
			var sprite = new DiamondSprite(type);
			sprite.attr({
				x : (cc.winSize.width / 3 * i) + (cc.winSize.width / 6) - sprite.width / 2,
				y : (y_offset - PublicData.dialmond_height) / 2 + sprite.height / 2,
			});
			this.array_bottom.push(sprite);
			this.addChild(sprite);
			
//			console.log(sprite.getContentSize());
   		}
   	},
   	
// 	
// 	drawRoundRect : function(draw,origin,destination,radius,lineWidth,bFill,color){
// 		var segment = Math.max(destination.width,destination.height);
// 		var tl = {
// 			'begin' : cc.p(origin.x,origin.y - radius),
// 			'control' : origin,
// 			'end' : cc.p(origin.x + radius,origin.y )
// 		};
// 		var tr = {
// 			'begin' : cc.p(origin.x + (destination.width - radius), origin.y),
// 			'control' : cc.p(origin.x + destination.width,origin.y),
// 			'end' : cc.p(origin.x + destination.width , origin.y - radius )
// 		};
// 		var br = {
// 			'begin' : cc.p(origin.x + destination.width , origin.y - (destination.height - radius)),
// 			'control' : cc.p(origin.x + destination.width , origin.y - destination.height),
// 			'end' : cc.p(origin.x + destination.width - radius , origin.y - destination.height )
// 		};
// 		var bl = {
// 			'begin' : cc.p(origin.x + radius , origin.y - destination.height),
// 			'control' : cc.p(origin.x,origin.y - destination.height),
// 			'end' : cc.p(origin.x,origin.y - (destination.height - radius) )
// 		};
// 		
// 		draw.drawQuadBezier(tl.begin,tl.control,tl.end, segment, lineWidth, color);
// 		draw.drawSegment(tl.end,tr.begin, 0, color);
// 		
// 		draw.drawQuadBezier(tr.begin,tr.control,tr.end, segment, lineWidth, color);
// 		draw.drawSegment(tr.end,br.begin, 0, color);
// 		
// 		draw.drawQuadBezier(br.begin,br.control,br.end, segment, lineWidth, color);
// 		draw.drawSegment(br.end,bl.begin, 0, color);
// 		
// 		draw.drawQuadBezier(bl.begin,bl.control,bl.end, segment, 1, color);
// 		draw.drawSegment(bl.end,tl.begin, 0, color);
//
// 		
//// 		draw.drawCircle(cc.p(origin.x + radius,origin.y - radius), radius, 0, radius, false, lineWidth,color);
// 	},
   	
// 	showSelectBorder : function(x , y ,type ,dir){
// 		var area = {
// 			x : 0,
// 			y : PublicData.dialmond_height * 2
// 		}
// 		
// 		var row = Math.floor(x / PublicData.dialmond_width) ;
// 		row = x % PublicData.dialmond_width > PublicData.dialmond_width / 2 ? row : row - 1 ;
// 		var col = Math.floor((y - PublicData.dialmond_height * 2) / PublicData.dialmond_height);
// 		col = (y - PublicData.dialmond_height * 2) % PublicData.dialmond_height > PublicData.dialmond_height / 2 ? col : col - 1;
// 		
// 		console.log(row + ":" + col);
// 		
// 		this.draw && this.removeChild(this.draw);
// 		this.draw = new cc.DrawNode();
// 		this.draw.drawRect(
// 					cc.p(PublicData.dialmond_width * row, PublicData.dialmond_height * (2 + col)),
// 					cc.p(PublicData.dialmond_width * (row + 1) , PublicData.dialmond_height * (3 + col)),
// 					cc.color(255,255,0,200)
// 				);
// 		this.addChild(this.draw);		
// 		switch (type){
// 			case 1:
// 				break;
// 			case 2:
// 				
// 				break;
// 			default:
// 				break;
// 		}
// 	}
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

