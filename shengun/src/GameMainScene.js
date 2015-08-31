var PublicData = {//配置数据
	pillarScaleX : 10,//木桩横向放大比例
	lineIncrease : 0.01,//桥梁增长比例
	
	timeMoveMonkeyLeft : 1,//主角移动到最左边使用时间
	timeMoveMonkeyNext : 1//主角移动到下一个木桩使用时间
}

var GameStartMenuLayer = cc.Layer.extend({
	curPillar : null,//当前木桩
	nextPillar : null,//下一个木装
	menu : null,//开始菜单
	lable : null,//游戏标题
	line : null,//桥梁精灵
	monkey : null,//主角精灵
	
	originMonkey : null,//主角初始属性
	origincurPillar : null,//主角站立木桩的属性
	originnextPillar : null,//下一个木桩的属性
	originline : null,//桥梁初始属性
	
	layerGameOver : null,//游戏结束界面容器
	isGameOver : false,//标记游戏是否已经结束
	
	score : null,
	
	canClick : false,
	
	ctor : function(){
		this._super();
		
		var size = cc.winSize;
		var self = this;
		
		layer_bg = new cc.Sprite(res.Background2_png);
		layer_bg.attr({
			anchorX : 0,
			anchorY :0
		});
		
		this.addChild(layer_bg);
		
		var but_start = new cc.MenuItemImage(
			res.Start_normal_png,
			res.Start_select_png,
			function(){
				self.removeChild(self.menu);
				self.removeChild(self.label);
				
				self.curPillar.runAction(cc.sequence(cc.moveTo(1,cc.p(self.curPillar.width * 10/2,0)),cc.callFunc(self.initBegin,self,self)));
//				self.curPillar.runAction(cc.moveTo(1,cc.p(self.curPillar.width * 10/2,0)));
				this.monkey.runAction(cc.moveTo(PublicData.timeMoveMonkeyLeft,cc.p(this.monkey.width / 2,this.originMonkey.y)));
				self.crateNextPillar(self);
				
				self.addScoreItem();
			},
			this);
			
		but_start.attr({
			x : size.width / 2,
			y : size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
            scale : 3,
            opacity : 0
		});
		
		cc.eventManager.addListener({
        	event:cc.EventListener.TOUCH_ONE_BY_ONE,
        	swallowTouches: true,
        	onTouchBegan:  function(touch, event){
        		if(self.isGameOver || !self.canClick){
        			return false;
        		}
        		
	        	self.scheduleUpdate();
	        	return true;
	    	},
	    	onTouchEnded : function(touch, event){
	            self.unscheduleAllCallbacks();
	            self.canClick = false;
	            self.line.runAction(cc.sequence(cc.rotateTo(0.5,90),cc.callFunc(self.moveMonkey,self,self)));
	    	}
        },this);
		
		
		this.menu = new cc.Menu(but_start);
		this.menu.x = 0;
		this.menu.y = 0;
		
		this.addChild(this.menu,1);
		but_start.runAction(
			cc.spawn(
				cc.fadeIn(1),
				cc.scaleTo(1,1)
				)
			);
			
		this.label = cc.LabelTTF.create("神棍传奇","Aria",64);
		this.label.x = size.width / 2;
		this.label.y = size.height / 3 * 2;
		this.label.color = cc.color(0,0,0);
		this.label.runAction(
			cc.jumpTo(0.6, cc.p(size.width / 2, size.height / 4 * 3) , 50 , 4)
		);
		
		this.addChild(this.label,1);
		
		this.init();
	},
	
	/*添加分数提示*/
	addScoreItem : function(){
		var layer = new cc.LayerColor(cc.color(124, 118, 118,200),150,100);
		layer.attr({
			x : cc.winSize.width / 2 - 75,
			y : cc.winSize.height - 200,
		});
		
		this.addChild(layer);
		
		this.score = cc.LabelTTF.create("0","Aria",32);
		this.score.color = cc.color(255,255,255);
		this.score.attr({
			x : layer.width / 2,
			y : layer.height / 2
		});
		layer.addChild(this.score);
	},
	
	addScore : function(){
		this.score.string = parseInt(this.score.string) + 1;
		this.score.runAction(cc.sequence(cc.scaleTo(0.1,2),cc.scaleTo(0.1,1)));
	},
	
	/*初始化操作*/
	init : function(){
		var size = cc.winSize;
		
		isGameOver = false;
		//游戏主页面精灵添加begin=================================
		this.curPillar = cc.Sprite.create(res.Stick_black_png);//主角站立的木桩
		this.origincurPillar = {
			x : size.width / 2,
			anchorY : 0,
			y : 0,
			scaleX : PublicData.pillarScaleX
		}
		this.curPillar.attr(this.origincurPillar);
		this.addChild(this.curPillar,2);
	
		this.line = cc.Sprite.create(res.Stick_black_png);//桥梁
		this.originline = {
			x : this.curPillar.width * PublicData.pillarScaleX,
			y : this.curPillar.height,
			anchorX : 1,
			anchorY : 0,
			scaleY : 0
		}
		this.line.attr(this.originline);
		this.addChild(this.line,2);
		
		this.monkey = new cc.Sprite("#z0001.png");
		this.originMonkey = {
			x : size.width / 2,
			y : this.curPillar.height,
			anchorY : 0
		}
		this.monkey.attr(this.originMonkey);
		this.addChild(this.monkey,3);
	},
	
	initBegin : function(){
		
		this.canClick = true;
	},
	
	/*创建下一个木桩*/
	crateNextPillar : function(self){
		var size = cc.director.getWinSize();
		
		self.nextPillar = cc.Sprite.create(res.Stick_black_png);
		
		var newX = Math.floor(Math.random() * (size.width - this.nextPillar.width * PublicData.pillarScaleX * 2)) ;
		newX = newX + this.nextPillar.width * PublicData.pillarScaleX / 2 * 3;
		self.nextPillar.x = size.width + newX ;
		self.nextPillar.anchorY = 0;
		self.nextPillar.y = 0;
		self.nextPillar.scaleX = PublicData.pillarScaleX;
		self.addChild(self.nextPillar,2);
		
		self.nextPillar.runAction(cc.moveTo(1,cc.p(newX, 0)));
	},
	
	update : function(dt){
		this.line.scaleY += PublicData.lineIncrease;
	},
	
	/*移动精灵至下一个木桩*/
	moveMonkey : function(self,data){//回调函数-data指向传递的数据，这里使用this指示GameStartMenuLayer对象
		var move = cc.moveTo(0.5,cc.p(self.scaleY * self.height + data.monkey.width ,data.monkey.y));
		var callback = cc.callFunc(data.moveToInit,this);
		data.monkey.runAction(cc.sequence(move,callback));
	},
	
	moveToInit : function(){
		if(this.nextPillar.x - this.curPillar.x < this.line.height * this.line.scaleY
			||this.nextPillar.x - this.curPillar.x - this.nextPillar.width * PublicData.pillarScaleX > this.line.height * this.line.scaleY){
			this.monkey.rotation = 90;
			this.monkey.runAction(cc.moveBy(0.5,cc.p(0,-this.curPillar.height)));
			this.showGameOver();
			return ;
		}
			
		this.addScore();
		
		this.removeChild(this.curPillar);
		this.curPillar = this.nextPillar;
		this.curPillar.runAction(cc.moveTo(1,cc.p(this.curPillar.width * 10/2,0)));
//		this.monkey.runAction(cc.moveTo(1,cc.p(this.monkey.width / 2,this.originMonkey.y)));
		this.monkey.runAction(cc.sequence(cc.moveTo(1,cc.p(this.monkey.width / 2,this.originMonkey.y)),cc.callFunc(this.initBegin,this)));
		this.crateNextPillar(this);
		
		this.line.scaleY = 0;
		this.line.rotation = 0;
		
	},
	
	/*显示游戏结束画面*/
	showGameOver : function(){
		this.isGameOver = true;
		
		var size  = cc.director.getWinSize();
		this.layerGameOver = cc.LayerColor.create(cc.color(255,255,255,200));
		this.addChild(this.layerGameOver,10);
		
		var label = cc.LabelTTF.create("再来一次","Aria",64);
		label.color = cc.color(0,0,0);
		
		var mlabel = new cc.MenuItemLabel(label,function(){
			cc.director.pushScene(new GameStartMenuScene());
		});
		
		mlabel.x = size.width / 2;
		mlabel.y = size.height / 3 * 2;
		
		var draw = new cc.DrawNode();
		draw.drawRect(cc.p(0,0),cc.p(label.width,label.height),cc.color(173,90,92));
		label.addChild(draw,-1);
		
		var menuAgain = new cc.Menu(mlabel);
		menuAgain.x = 0;
		menuAgain.y = 0;
		this.layerGameOver.addChild(menuAgain);
		
	}
});

var GameStartMenuScene = cc.Scene.extend({
	onEnter: function(){
		this._super();
		
		var layer = new GameStartMenuLayer();
		this.addChild(layer);
	}
});