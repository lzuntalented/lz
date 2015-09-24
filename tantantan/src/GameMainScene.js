
var GameStartMenuLayer = cc.Layer.extend({
	_map : [],
	score : 0,
	_labelScore:null,
	
	ctor : function(){
		this._super();
		this.init();
	},
	
	/*初始化操作*/
	init : function(){
		PublicData.PANEL_WIDTH = PublicData.SCREEN_WIDTH;
		PublicData.PANEL_HEIGHT = PublicData.PANEL_WIDTH;
		
		PublicData.CARD_SIZE = (PublicData.PANEL_WIDTH - (PublicData.CARD_COL * PublicData.CARD_SPACE)) / PublicData.CARD_COL;
		
		var draw = new cc.DrawNode();
		for (var i = 0; i < PublicData.CARD_ROW; i++) {
			this._map.push([]);
			for (var j = 0; j < PublicData.CARD_COL; j++) {
				draw.drawRect(cc.p(PublicData.CARD_SIZE * j , PublicData.CARD_SIZE * i),
								cc.p(PublicData.CARD_SIZE * (j + 1) , PublicData.CARD_SIZE * ( i + 1 )),
								cc.color(0,0,0)
							);//绘制底部方格
				
				var card = CardSprite.create(Math.floor(Math.random() * PublicData.CARD_TYPE));//创建卡片
				this._map[i].push(card);
				card.x = PublicData.CARD_SIZE * (j + 0.5);
				card.y = PublicData.CARD_SIZE * (i + 0.5);
				card.row = i;
				card.col = j;
				this.addChild(card,2);
			}
		}
		
		this.addChild(draw);
		var self = this;
		cc.eventManager.addListener({
        	event:cc.EventListener.TOUCH_ONE_BY_ONE,
        	swallowTouches: true,
        	onTouchBegan:  function(touch, event){
        		var pos = touch.getLocation();
        		var row = Math.floor(pos.y/PublicData.CARD_SIZE);
        		var col = Math.floor(pos.x / PublicData.CARD_SIZE);
        		var flag = self.canCancle(self,row ,col);
        		
	        	self.clearPos = [];
	        	
	        	if(flag){
	        		self.clearPoints(self,self._map[row][col],self._map[row][col].type);
	        		
	        		for(var i=0;i<self.clearPos.length;i++){
	        			self.removeChild(self.clearPos[i]);
	        		}
	        		
	        		self.addScore(self.clearPos.length);
	        		
	        		self.createNewPoint(self);
	        	}
	        	return false;
	    	}
        },this);
        
        this.initTopTitle();
	},
	
	initTopTitle: function(){
		var label = cc.LabelTTF.create("当前分数：" + this.score,"Aria",50);
		label.anchorY = 1;
		
		label.x = PublicData.SCREEN_WIDTH / 2;
		label.y = PublicData.SCREEN_HEIGHT;
		
		this._labelScore = label;
		this.addChild(this._labelScore,1);
	},
	
	addScore : function(num){
		this.score = parseInt(this.score + num) ;
		this._labelScore.string = "当前分数：" + this.score;
	},
	
	createNewPoint : function(self){
		for (var i = 0; i < PublicData.CARD_COL; i++) {
			var count = 0;
			
			for (var j = 0; j < PublicData.CARD_ROW; j++) {
				if(self._map[j][i].type == -1){
					count++;

				}else if(count > 0){
					self._map[j - count][i] = self._map[j][i];
					self._map[j - count][i].row = j - count;
					self._map[j - count][i].runAction(cc.moveBy(PublicData.CARD_MOVE_SPEED,cc.p(0,-PublicData.CARD_SIZE * count)));
				}
			}
			
			var idx = 1;
			for(var j = count ; j > 0 ; --j){
				var row = PublicData.CARD_ROW - j;
				
				var card = CardSprite.create(Math.floor(Math.random() * PublicData.CARD_TYPE));//创建卡片
				self._map[row][i] = card ;
				self.addChild(card);
				
				card.x = PublicData.CARD_SIZE * (i + 0.5);
				card.y = PublicData.CARD_SIZE * PublicData.CARD_ROW + PublicData.CARD_SIZE * idx++ ;
				card.row = row;
				card.col = i;
				
				card.runAction(cc.moveTo(PublicData.CARD_MOVE_SPEED,cc.p(PublicData.CARD_SIZE * (i + 0.5),PublicData.CARD_SIZE * (row + 0.5))));
			}
		}
	},
	
	update : function(dt){
	},
	
	canCancle : function(self,row,col){
		
		var arrayPoint = self._map;
		var tempH = [];
		for (var i = col + 1; i < arrayPoint.length; i++) {
			if(arrayPoint[row][col].type == arrayPoint[row][i].type) {
				tempH.push(arrayPoint[row][i]);
			}else{
				break;
			}
		}
		
		for (var i = col - 1; i >= 0 ; i--) {
			if(arrayPoint[row][col].type == arrayPoint[row][i].type) {
				tempH.push(arrayPoint[row][i]);
			}else{
				break;
			}
		}
		
		var tempV = [];
		for (var i = row + 1; i < arrayPoint.length; i++) {
			if(arrayPoint[row][col].type == arrayPoint[i][col].type) {
				tempV.push(arrayPoint[i][col]);
			}else{
				break;
			}
		}
		
		for (var i = row - 1; i >= 0 ; i--) {
			if(arrayPoint[row][col].type == arrayPoint[i][col].type) {
				tempV.push(arrayPoint[i][col]);
			}else{
				break;
			}
		}
		
		var result = false;
		if(tempH.length > 0 || tempV.length > 0){
			return true;
		}
		
		return result;
	},
	
	clearPos : [],
	clearPoints: function (self,point,type){
		if(type == -1){
			console.log("内部错误！");
		}
		var arrayPoint = self._map;
		self._map[point.row][point.col].type = -1;
		
		self.clearPos.push(point);
		var numH = PublicData.CARD_COL;
		var numV = PublicData.CARD_ROW;
		
		if(point.col < numH - 1 && arrayPoint[point.row][point.col + 1].type != -1 && type == arrayPoint[point.row][point.col + 1].type){
			self.clearPoints(self,arrayPoint[point.row][point.col + 1],type);
		}
		
		if(point.col > 0 && arrayPoint[point.row][point.col - 1].type != -1 && type == arrayPoint[point.row][point.col - 1].type){
			self.clearPoints(self,arrayPoint[point.row][point.col - 1],type);
		}
		
		if(point.row < numV - 1 && arrayPoint[point.row + 1][point.col].type != -1 && type == arrayPoint[point.row + 1][point.col].type){
			self.clearPoints(self,arrayPoint[point.row + 1][point.col],type);
			
		}
		
		if(point.row > 0 && arrayPoint[point.row - 1][point.col].type != -1 && type == arrayPoint[point.row - 1][point.col].type){
			self.clearPoints(self,arrayPoint[point.row - 1][point.col],type);
		}
		
		return ;
	}
});

var GameStartMenuScene = cc.Scene.extend({
	onEnter: function(){
		this._super();
		
		var layer = new GameStartMenuLayer();
		this.addChild(layer);
	}
});

function logType(arr){
	var result ="";
	for (var i = arr.length - 1; i >= 0 ; --i) {
		var str = "";
		for (var j = 0 ; j < arr[i].length ; ++j) {
			str += arr[i][j].type + ",";
		}
		console.log(str);
	}
}
