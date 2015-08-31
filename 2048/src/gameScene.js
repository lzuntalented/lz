

Public = {//配置数据
	panelWidth : 400,
	panelHeight : 400,
	
	eachSpace : 5 ,
	count : 4 ,
	
	cardWidth: 100,
	cardHeight:100,
};




var GameLayer = cc.Layer.extend({
	
	map: null,
	cardArr : null,//数字实体2维数组
	cardArrAction : null,//动画2维数组
	
	touchStart: {//记录起始坐标点
		x:0,
		y:0
	},
	
    ctor:function () {
        this._super();
        var self = this;
        var size = cc.winSize;
        
        Public.panelWidth = size.width;
        Public.panelHeight = size.width;
        Public.cardWidth = size.width / 4;
        Public.cardHeight = size.width / 4;
		
		this.initCardArray();
        this._createNewBlock();
        this._createNewBlock();
//      this._createNewBlock();
//      this._createNewBlock();
//      this._createNewBlock();
//      this._createNewBlock();
        
        cc.eventManager.addListener({
        	event:cc.EventListener.TOUCH_ONE_BY_ONE,
        	swallowTouches: true,
        	onTouchBegan:  function(touch, event){
	        	self.touchStart = touch.getLocation();
	        	return true;
//	        	alert(self.touchStart .x);
	    	},
	    	onTouchEnded : function(touch, event){
        		// 37左 38上 39右 40下
//      		var keyStr = self.getKeyStr(keyCode);
	            var endTouch  = touch.getLocation();
//	            alert(touch);
//	            
	            var offsetX = endTouch.x - self.touchStart.x;
	            var offsetY = endTouch.y - self.touchStart.y;
	            
	            var moved = false;
	            
	            if(Math.abs(offsetX) > Math.abs(offsetY)){
	            	if(offsetX < -5){
	            		moved = self.moveleft(self);
	            	}else if(offsetX > 5){
	            		moved = self.moveright(self);
	            	}
	            }else{
	            	if(offsetY < -5){
	            		moved = self.movedown(self);
	            		
	            	}else if(offsetY > 5){
	            		moved = self.moveup(self);
	            	}
	            }
	            
	             if(moved){
	            	
	            	if(self.checkWinGame()){
	            		self.showFinallyLayer("恭喜您，获得了胜利!");
	            		return ;
	            	}
	            	
	            	self._createNewBlock();
	            	
	            	if(self.checkGameOver()){
	            		self.showFinallyLayer("Game Over!");
	            		return ;
	            	}
	            	
	            	
	            }
	    	}
        },this);
        
//      cc.eventManager.addListener({//键盘触摸事件，便于pc浏览器测试使用
//      	event:cc.EventListener.KEYBOARD,
//      	onKeyPressed:  function(keyCode, event){
//      		// 37左 38上 39右 40下
////      		var keyStr = self.getKeyStr(keyCode);
//	            var moved = false;
//	            switch (keyCode){
//	            	case 37:
//	            		moved = self.moveleft(self);
//	            		break;
//          		case 38:
//          			moved = self.moveup(self);
//	            		break;
//          		case 39:
//          			moved = self.moveright(self);
//	            		break;
//          		case 40:
//          			moved = self.movedown(self);
//	            		break;
//	            }
//	            
//	            if(moved){
//	            	
//	            	if(self.checkWinGame()){
//	            		self.showFinallyLayer("恭喜您，获得了胜利!");
//	            		return ;
//	            	}
//	            	
//	            	self._createNewBlock();
//	            	
//	            	if(self.checkGameOver()){
//	            		self.showFinallyLayer("Game Over!");
//	            		return ;
//	            	}
//	            	
//	            	
//	            }
//	        }
//      },this);
   },
   
	checkWinGame : function(){//检测是否已经含有2048方块
		for (var i = 0; i < this.cardArr.length; i++) {
			for (var j = 0; j < this.cardArr[i].length; j++) {
				if(this.cardArr[i][j].number == "2048"){
					return true;
				}
			}
		}
		return false;
	},
	
	checkGameOver : function(){//检测是否还可以移动方片
		var isOver = true;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if(this.cardArr[i][j].number == ""||
					(i > 0 && this.cardArr[i][j].number == this.cardArr[i-1][j].number)||
					(i < 3 && this.cardArr[i][j].number == this.cardArr[i+1][j].number)||
					(j > 0 && this.cardArr[i][j].number == this.cardArr[i][j-1].number)||
					(j < 3 && this.cardArr[i][j].number == this.cardArr[i][j+1].number)
				){
					isOver = false;
				}
			}
		}
		
		return isOver;
	},
	
	showFinallyLayer : function (txt){//显示结束画面
		var size = cc.director.getWinSize();
		var self = this;
		
		var showLayer = cc.LayerColor.create(cc.color(0,0,0,100),size.width,size.height);
		
		var txt = cc.LabelTTF.create(txt,"Arial",50);
		txt.setPosition(size.width / 2,size.height / 3 * 2);
//		txt.color = cc.color(0,0,0);
		
		var but = new  cc.MenuItemLabel(cc.LabelTTF.create("再来一次","Arial",50),function(){
			this.initCardArray();
	        this._createNewBlock();
	        this._createNewBlock();
        
			self.removeChild(showLayer);
		},this);
		but.x = 0;
		but.y = 0;
//		but.color = cc.color(0,0,0);
		
		but.color = cc.color(255,255,255);
		
		var menu = new  cc.Menu(but);
		menu.x = size.width / 2;
		menu.y = size.height / 3;
		
		showLayer.addChild(txt);
		showLayer.addChild(menu);
		
		
		this.addChild(showLayer,5);
	},
   
    initCardArray : function (){//初始化卡片数组
    	this.cardArr = initArray2WithDefault(4,4,null);
    	this.cardArrAction = initArray2WithDefault(4,4,null);
    	
		for (var i = 0; i < this.cardArr.length; i++) {
			for (var j = 0; j < this.cardArr[i].length; j++) {
				this.cardArr[i][j] = CardSprite.createCard("",Public.cardWidth,Public.cardHeight,j*Public.cardWidth,i*Public.cardHeight);
				this.addChild(this.cardArr[i][j]);
			}
		}
		
		for (var i = 0; i < this.cardArrAction.length; i++) {
			for (var j = 0; j < this.cardArrAction[i].length; j++) {
				this.cardArrAction[i][j] = CardSprite.createCard("",Public.cardWidth,Public.cardHeight,j*Public.cardWidth,i*Public.cardHeight);
				this.addChild(this.cardArrAction[i][j],2);
				this.cardArrAction[i][j].cardLayer.runAction(cc.hide());
			}
		}
   	},
   	
   
	_createNewBlock : function(){//随机生成数字
   		var index = Math.floor(Math.random()*Public.count*Public.count);
   		var col = index % 4;
   		var row = parseInt(index / 4);
   		
   		var num = Math.floor(Math.random()*10);
   		if(num == 9)
   			num = 4;
   		else	
   			num = 2;
   			
   		if(this.cardArr[row][col].number == ""){
			this.cardArr[row][col].setNumber(num);
			this.cardArr[row][col].cardLayer.runAction(cc.sequence(cc.scaleTo(0,0),cc.scaleTo(0.3,1)));
   		}else{
   			var tag =true;
   			
   			for (var i = 0; i < this.cardArr.length; i++) {
   				for (var j = 0; j < this.cardArr[i].length; j++) {
	   				if(this.cardArr[i][j].number == ""){
	   					tag = false;
	   				}
	   			}
   			}
   			
   			if(tag){
   				return ;
   			}
   			
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
	
	
	moveleft : function(self){
		var moved = false;
		for (var i = 0; i < Public.count; i++) {
			
			for (var j = 0 ; j < Public.count ; j++ ) {
				
				for (var k = j + 1; k < Public.count; k++) {
					if(self.cardArr[i][k].number != ""){
						if(self.cardArr[i][j].number == ""){
							
							self.cardArrAction[i][k].setNumber(self.cardArr[i][k].number);
							self.cardArrAction[i][k].cardLayer.runAction(
								cc.sequence(
									cc.place(cc.p(Public.cardWidth*k , Public.cardHeight*i)),
									cc.show(),
									cc.moveBy(0.1,cc.p(-Public.cardWidth*(k - j),0)),
									cc.hide()
									)
								);
								
							self.cardArr[i][j].setNumber(self.cardArr[i][k].number);
							self.cardArr[i][k].setNumber("");
							moved = true;
							j--;
						}else{
							
							if(self.cardArr[i][j].number == self.cardArr[i][k].number){
								self.cardArrAction[i][k].setNumber(self.cardArr[i][k].number);
								self.cardArrAction[i][k].cardLayer.runAction(
									cc.sequence(
										cc.place(cc.p(Public.cardWidth*k , Public.cardHeight*i)),
										cc.show(),
										cc.moveBy(0.1,cc.p(-Public.cardWidth*(k - j),0)),
										cc.hide()
										)
									);
								
								self.cardArr[i][j].setNumber(self.cardArr[i][k].number * 2);
								self.cardArr[i][k].setNumber("");
								self.cardArr[i][j].cardLayer.runAction(
									cc.sequence(
										cc.scaleTo(0.1,1.2),
										cc.scaleTo(0.1,1.0)
										)
								);
								
								moved = true;
							}
							
						}
						
						break;
					}
				}
			}
			
		}
		
		return moved;
	},
	moveright : function(self){
		var moved = false;
		
		for (var i = 0; i < Public.count; i++) {
			
			for (var j = Public.count - 1 ; j >= 0  ; j-- ) {
				
				for (var k = j - 1; k >= 0; k--) {
					if(self.cardArr[i][k].number != ""){
						if(self.cardArr[i][j].number == ""){
							
							self.cardArrAction[i][k].setNumber(self.cardArr[i][k].number);
							self.cardArrAction[i][k].cardLayer.runAction(
								cc.sequence(
									cc.place(cc.p(Public.cardWidth*k , Public.cardHeight*i)),
									cc.show(),
									cc.moveBy(0.1,cc.p(-Public.cardWidth*(k - j),0)),
									cc.hide()
									)
								);
								
							self.cardArr[i][j].setNumber(self.cardArr[i][k].number);
							self.cardArr[i][k].setNumber("");
							j++;
							moved = true;
							
						}else if(self.cardArr[i][j].number == self.cardArr[i][k].number){
							self.cardArrAction[i][k].setNumber(self.cardArr[i][k].number);
							self.cardArrAction[i][k].cardLayer.runAction(
								cc.sequence(
									cc.place(cc.p(Public.cardWidth*k , Public.cardHeight*i)),
									cc.show(),
									cc.moveBy(0.1,cc.p(-Public.cardWidth*(k - j),0)),
									cc.hide()
									)
								);

							
								self.cardArr[i][j].setNumber(self.cardArr[i][k].number * 2);
								self.cardArr[i][k].setNumber("");
								
								self.cardArr[i][j].cardLayer.runAction(
									cc.sequence(
										cc.scaleTo(0.1,1.2),
										cc.scaleTo(0.1,1.0)
										)
								);
								
								moved = true;
							}
							
							
						
						break;
					}
				}
			}
			
		}
		return moved;
	},
	movedown : function(self){
		var moved = false;

		for (var i = 0; i < Public.count; i++) {
			
			for (var j = 0 ; j < Public.count ; j++ ) {
				
				for (var k = j + 1; k < Public.count; k++) {
					if(self.cardArr[k][i].number != ""){
						
						if(self.cardArr[j][i].number == ""){
							
							self.cardArrAction[k][i].setNumber(self.cardArr[k][i].number);
							self.cardArrAction[k][i].cardLayer.runAction(
								cc.sequence(
									cc.place(cc.p(Public.cardWidth*i,Public.cardHeight*k)),
									cc.show(),
									cc.moveBy(0.1,cc.p(0 , -Public.cardHeight*(k - j))),
									cc.hide()
									)
								);
							self.cardArr[j][i].setNumber(self.cardArr[k][i].number);
							self.cardArr[k][i].setNumber("");
							
							moved = true;
							j--;
							
						}else if(self.cardArr[j][i].number == self.cardArr[k][i].number){
							
							self.cardArrAction[k][i].setNumber(self.cardArr[k][i].number);
							self.cardArrAction[k][i].cardLayer.runAction(
								cc.sequence(
									cc.place(cc.p(Public.cardWidth*i,Public.cardHeight*k)),
									cc.show(),
									cc.moveBy(0.1,cc.p(0 , -Public.cardHeight*(k - j))),
									cc.hide()
									)
								);
							
							
								self.cardArr[j][i].setNumber(self.cardArr[k][i].number * 2);
								self.cardArr[k][i].setNumber("");
								
								self.cardArr[j][i].cardLayer.runAction(
									cc.sequence(
										cc.scaleTo(0.1,1.2),
										cc.scaleTo(0.1,1.0)
										)
								);
								
								moved = true;
						}
						
						break;
					}
				}
			}
			
		}
		
		return moved;
	},
	moveup : function(self){
		var moved = false;
		
		for (var i = 0; i < Public.count; i++) {
			
			for (var j = Public.count - 1 ; j >= 0  ; j-- ) {
				
				for (var k = j - 1; k >= 0; k--) {
					if(self.cardArr[k][i].number != ""){
						if(self.cardArr[j][i].number == ""){
							
							self.cardArrAction[k][i].setNumber(self.cardArr[k][i].number);
							self.cardArrAction[k][i].cardLayer.runAction(
								cc.sequence(
									cc.place(cc.p(Public.cardWidth*i,Public.cardHeight*k)),
									cc.show(),
									cc.moveBy(0.1,cc.p(0 , -Public.cardHeight*(k - j))),
									cc.hide()
									)
								);
								
							self.cardArr[j][i].setNumber(self.cardArr[k][i].number);
							self.cardArr[k][i].setNumber("");
							moved = true;
							
							j++;
							
						}else if(self.cardArr[j][i].number == self.cardArr[k][i].number){
							self.cardArrAction[k][i].setNumber(self.cardArr[k][i].number);
							self.cardArrAction[k][i].cardLayer.runAction(
								cc.sequence(
									cc.place(cc.p(Public.cardWidth*i,Public.cardHeight*k)),
									cc.show(),
									cc.moveBy(0.1,cc.p(0 , -Public.cardHeight*(k - j))),
									cc.hide()
									)
								);

							self.cardArr[j][i].setNumber(self.cardArr[k][i].number * 2);
							self.cardArr[k][i].setNumber("");
							self.cardArr[j][i].cardLayer.runAction(
									cc.sequence(
										cc.scaleTo(0.1,1.2),
										cc.scaleTo(0.1,1.0)
										)
								);
								
							moved = true;
							
						}
						
						break;
					}
				}
			}
			
		}
		
		return moved;
	},
 });
 
var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
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

/*用初始值 初始化2维数组*/
function initArray2WithDefault(row,col,def){
	var result = [] ;
	for (var i = 0; i < row; i++) {
		var temp = [];
		for (var j = 0; j < col; j++) {
			temp.push(def);
		}
		result.push(temp);
	}
	
	return result;
}
