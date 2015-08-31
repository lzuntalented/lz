
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
//          scale: 0.5,
//          rotation: 180
        });
        this.addChild(this.sprite, 0);
        var l = cc.LayerColor.create(cc.color(255,255,0),100,100);
        l.runAction(cc.hide());
        this.addChild(l, 2);
        setTimeout(function(){
	        l.runAction(
	            cc.sequence(
	                cc.place(cc.p(size.width,size.height / 2)),
	                cc.show(),
	                cc.moveBy(1,cc.p(-size.width / 2 , 0 )),
	                cc.hide()
	            )
	        );	
        },1000);
        
        
//      this.sprite.runAction(
//          cc.sequence(
//              cc.rotateTo(2, 0),
//              cc.scaleTo(2, 1, 1)
//          )
//      );
        
        var self = this;
        
        function callback(){
        	self.sprite.runAction(
                cc.sequence(
	                cc.rotateTo(2, 180),
	                cc.scaleTo(2, 0.5, 0.5)
	            )
	        );
        }
        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );
        
        
        return true;
    }
});

Public = {
	panelWidth : 400,
	panelHeight : 400,
	
	eachSpace : 5 ,
	count : 4 ,
};


var Block = function(param){
	
	var bgColor = param.bgColor || cc.color(0,0,0);
	var valueColor = param.valueColor || cc.color(255,255,255);
	var value = param.value || 2;
	
	var col = param.col;
	var row = param.row;
	
	var x = col * Public.panelWidth / Public.count;
	var y = row * Public.panelHeight / Public.count;
	
	var width = param.width || (Public.panelWidth - Public.eachSpace * 2) / Public.count;
	var height = param.height || (Public.panelWidth - Public.eachSpace * 2) / Public.count;
	
	var lineHeight = param.lineHeight || Public.eachSpace;
	
    var panelDraw = cc.DrawNode.create();
    panelDraw.drawRect(
    	cc.p(x,y),
    	cc.p(x + width,y+ height),
    	bgColor,
    	lineHeight
    );
    
    var myLabel = new cc.LabelTTF(value,  'Times New Roman', width, cc.size(width,height), cc.TEXT_ALIGNMENT_CENTER);
	myLabel.x = x;
	myLabel.y = y;
	myLabel.anchorX = 0;
	myLabel.anchorY = 0;
	myLabel.setColor(valueColor);
	panelDraw.addChild(myLabel,2);
	
	this.val = value;
	this.col = col;
	this.row = row;
    this.relX = x;
	this.relY = y;
	
	this.toCol = -1;
	this.toRow = -1;
	
	this.content = panelDraw;
	
	return this;
};

var GameLayer = cc.Layer.extend({
	
	map: null,
	
    ctor:function () {
        this._super();
        var self = this;
        var size = cc.winSize;
        
        var panelDraw = cc.DrawNode.create();
	    panelDraw.drawRect(
	    	cc.p(0,0),
	    	cc.p(Public.panelWidth,size.panelHeight),
	    	cc.color(255,255,255)
	    );
        
        for (var i = 0; i < Public.count; i++) {
        	for (var j = 0; j < Public.count; j++) {
        	 	 panelDraw.drawRect(
			    	cc.p(i * Public.panelWidth / Public.count,j * Public.panelWidth / Public.count),
			    	cc.p((i+1) * Public.panelWidth / Public.count,(j+1) * Public.panelWidth / Public.count),
			    	cc.color(145,130,130)
			    );
        	}
        }
        
        this.map = new Array(Public.count);
        for (var i = 0; i < Public.count; i++) {
    		this.map[i] = new Array(Public.count);
        }
        
        for (var i = 0; i < Public.count; i++) {
        	for (var j = 0; j < Public.count; j++) {
        		this.map[i][j]= null;
        	}
        }
        
        this.addChild(panelDraw);
        
        var index = Math.floor(Math.random()*Public.count*Public.count);
        
        this.addChild(this._createNewBlock().content,1);
        this.addChild(this._createNewBlock().content,1);
        this.addChild(this._createNewBlock().content,1);
        this.addChild(this._createNewBlock().content,1);
        
        cc.eventManager.addListener({
        	event:cc.EventListener.KEYBOARD,
        	onKeyPressed:  function(keyCode, event){
        		// 37左 38上 39右 40下
//      		var keyStr = self.getKeyStr(keyCode);
	            
	            switch (keyCode){
	            	case 37:
	            		self.moveleft1(self);
	            		break;
            		case 38:
	            		break;
            		case 39:
	            		break;
            		case 40:
	            		break;
	            }
	        }
        },this);
   },
   
	_createNewBlock : function(){
   		var index = Math.floor(Math.random()*Public.count*Public.count);
   		var col = index % 4;
   		var row = parseInt(index / 4);
   		
   		cc.log("create: col - row :" + col + "-" +row);
   		if(this.map[row][col] == null){
   			var block = new Block({
				'col' : col,
				'row' : row,
//				bgColor : cc.color(5,34,4)
			});
			cc.log("=: col - row :" + col + "-" +row);
			this.map[row][col] = block;
   			return block;
   		}else{
   			
   			return this._createNewBlock();
   		}
	},
	
	cloneArray2 : function (arr){
		var result  = [];
		for (var i = 0; i < arr.length; i++) {
			var temp = [];
			for (var j = 0; j < arr[i].length; j++) {
				temp.push(cc.clone(arr[i][j]));
			}
			result.push(temp);
		}
		
		return result;		
	},
	
	
	moveleft1 : function(self){
		
		var copy = cloneObject(self.map);
		
		for (var i = 0; i < self.map.length; i++) {
			var row = self.map[i];
			
			var delTemp = [];
			var delMoveTemp = [];
			
			for (var j = 1 ; j < row.length ; j++ ) {
				
				var last = row[j];
				if(last == null){
					continue;
				}
				
//				delTemp.push(clone3(self.map[i][j]));
				var to ;
				var isfirst = true;
				
				for (var k = j - 1; k >= 0; k--) {
					
					if(row[k] == null){
						self.map[i][k] = copy[i][j];
						
						if(isfirst){
							delTemp.push(copy[i][j]);
							isfirst = false;
						}
						
						self.map[i][j] = null;
						to = k;
						
						continue;
					}
					
					if(row[k] != null){
						
						if(row[k].val == last.val){
							
							self.map[i][k].val = row[k].val * 2;
							delTemp.push(copy[i][j]);
							self.map[i][j] = null;
							to = k;
							
						}else{
							self.map[i][k+1] = self.map[i][j];
							delTemp.push(copy[i][j]);
							self.map[i][j] = null;
							to = k + 1;
						}
						
						break;
					}
				}
				
				//delTemp.push(self.map[i][j]);
				delMoveTemp.push({from:j,to:to});
				self.map[i][j] = null;
			}
			
			for (var j = 0 ; j < delTemp.length ; j++ ) {
				var now = delTemp[j];
				if(now != null){
					now.content.runAction(
						cc.sequence(
							cc.moveBy(0.1,cc.p(- delMoveTemp[j].to * Public.panelWidth / Public.count,0)),
							cc.callFunc(function(e,data){
								self.map[data.toRow][data.toCol] = new Block({
									'col' : data.toCol,
									'row' : data.toRow,
									'value' : data.value
								});
								self.removeChild(data.remove);
								self.addChild(self.map[data.toRow][data.toCol].content);
								
							},this,{toRow:i,toCol:j,value:self.map[i][delMoveTemp[j].to].val,remove:now.content})
						)
					);
				}
			}
//			for (var j = 1 ; j < self.map[i].length ; j++ ) {
//				var now = self.map[i][j];
//				if(now != null){
//					now.content.runAction(
//						cc.sequence(
//							cc.moveBy(0.1,cc.p(-j * Public.panelWidth / Public.count,0)),
//							cc.callFunc(function(e,data){
//								self.map[data.toRow][data.toCol] = new Block({
//									'col' : data.toCol,
//									'row' : data.toRow,
//									'value' : data.value
//								});
//								self.addChild(self.map[data.toRow][data.toCol].content);
//								
//							},this,{toRow:i,toCol:j,value:self.map[i][j].val})
//						)
//					);
//				}
//			}
			
//			for (var j = 1 ; j < copy[i].length ; j++ ) {
//				var now = copy[i][j];
//				if(now != null){
//					if(now.toCol != -1){
//						now.runAction(
//							cc.sequence(
//								cc.moveBy(0.1,cc.p(now.toCol * Public.panelWidth / Public.count,y)),
//								cc.callFunc(function(e,data){
//									self.map[data.toRow][data.toCol] = new Block({
//										'col' : data.toCol,
//										'row' : data.toRow,
//									});
//								},this,now)
//							)
//						);
//					}
//				}
//			}
			
		}
	},
	moveleft : function(self){
		function  digi(i,j,k){
			if(k < 0)
				return ;
				
			if(self.map[i][k] == null){
//				cc.log(self.map[i][j].relX - Public.panelWidth / Public.count + "=" + self.map[i][j].relY );
				var active = self.map[i][j];
				self.map[i][j].content.runAction(
					cc.sequence(
						cc.moveBy(0.1,cc.p(0 - Public.panelWidth / Public.count,0 )),
						cc.callFunc(function(e,active){
							cc.log("digi ing=" +active.relX + "=" + active.relY);
								var aive = e;
								active.relX = active.relX - Public.panelWidth / Public.count;
							},this,active),
						cc.callFunc(digi(i,j,k-1))
					)
				);
				
				return ;
			}
			
			if(self.map[i][k].val == self.map[i][j].val){
				
				var value = self.map[i][k] * 2;
				var active = self.map[i][j];
				var before = self.map[i][k];
				
				active.content.runAction(cc.sequence(
					cc.moveTo(0.1,cc.p(0 - Public.panelWidth / Public.count ,0)),
					cc.callFunc(function(){
						
						self.removeChild(self.map[i][j].content);
						self.removeChild(self.map[i][j].content);
						
						self.map[i][j] = null;
						self.map[i][j] = null;
						
						self.map[i][k] = new Block({
							'col' : i,
							'row' : k,
							'value' : value
						});
					})
				));
				
			}
			
		}
		
		for (var i = 0; i < Public.count; i++) {
			
			for (var j = 0; j < Public.count; j++) {
				
				if(self.map[i][j] == null){
					continue;
				}
				cc.log("digi begin");
				digi(i,j,j-1);
//				for (var k = j - 1; k >= 0; k--) {
//					if(self.map[i][k] == null){
////						cc.log(self.map[i][j].relX - Public.panelWidth / Public.count + "=" + self.map[i][j].relY );
//						var active = self.map[i][j];
//						self.map[i][j].content.runAction(
//							cc.sequence(
//								cc.moveTo(0.1,cc.p(self.map[i][j].relX - Public.panelWidth / Public.count,self.map[i][j].relY )),
//								cc.callFunc(function(e,active){
//										var aive = e;
//										active.relX = active.relX - Public.panelWidth / Public.count;
//									},this,active)
//							)
//						);
//						continue;
//					}
//					if(self.map[i][k].val == self.map[i][j].val){
//						var value = self.map[i][k] * 2;
//						self.map[i][j].content.runAction(cc.sequence(
//							cc.moveTo(0.1,cc.p(self.map[i][k].relX,self.map[i][k].relY)),
//							cc.callFunc(function(){
//								self.map[i][k] = new Block({
//									'col' : i,
//									'row' : k,
//									'value' : value
//								});
//							})
//						));
//						
//					}else{
//						break;
//					}
//				}
				
			}
		}
	}
 });
 
var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

function cloneObject(obj){ 
	var o = obj.constructor === Array ? [] : {}; 
	
	for(var i in obj){ 
		if(obj.hasOwnProperty(i)){ 
			o[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i]; 
		} 
	} 
	
	return o; 
} 