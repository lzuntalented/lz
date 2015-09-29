
var HelloWorldLayer = cc.Layer.extend({
    _ball : null,
    _wand : null,
    
    _ballSize : 0,//球在显示时的真实半径
    
    ctor:function () {
        this._super();
		
		this.init();
        return true;
    },
    
    init : function(){
    	this._ball = new cc.Sprite(res.Start_normal_png);
    	this._ballSize = this._ball.width * 0.1 / 2;
    	this._ball.attr({
    		x : PublicData.SCREEN_WIDTH / 2,
    		y : PublicData.SCREEN_HEIGHT - this._ballSize,
    		scale : 0.1
    	});
    	this.addChild(this._ball);
    	
    	
    	var spY = Math.floor(Math.random() * 5) + PublicData.increase;//随机y方向的速度
    	var spX = Math.floor(Math.random() * 2); //随机x方向
    	
    	this._ball.speedY = 0 - spY;
    	this._ball.speedX = spX > 0 ? PublicData.increase : -PublicData.increase;
    	
    	this.initWand();
    	PublicData.gameStatus == PublicData.GAME_START;
    	this.scheduleUpdate();
    },
    
    initWand : function(){
    	this._wand = new cc.Sprite(res.Stick_jpg);
    	this._wand.attr({
    		x : PublicData.SCREEN_WIDTH / 2,
    		y : 0
    	});
    	this.addChild(this._wand);
    	
    	var self = this;
    	cc.eventManager.addListener({
        	event:cc.EventListener.TOUCH_ONE_BY_ONE,
        	swallowTouches: true,
        	onTouchBegan:  function(touch, event){
        		if(PublicData.gameStatus == PublicData.GAME_OVER)
        			return ;
        			
	        	var pos = touch.getLocation();

	        	self._wand.runAction(cc.moveTo(0.1,cc.p(pos.x,0)));
	    	}
        },this);
    },
    
    getBallY : function(x){
//  	console.log(x,this._equation_a,this._equation_b,x * this._equation_a + this._equation_b,this._ball.y)
    	return x * this._equation_a + this._equation_b;
    },
    
    getEquationB : function(){
    	return this._ball.y - this._equation_a * this._ball.x;
    },
    
    update : function(dt){
    	if(PublicData.gameStatus == PublicData.GAME_OVER){
    		return ;
    	}
    	
    	if(this._ball.x < this._ballSize || this._ball.x > PublicData.SCREEN_WIDTH - this._ballSize)
    		this._ball.speedX = -this._ball.speedX;
    		
    	if(this._ball.y < this._ballSize || this._ball.y > PublicData.SCREEN_HEIGHT - this._ballSize)
    		this._ball.speedY = -this._ball.speedY;
    		
    	if(this._ball.y < this._ballSize)
	    	if(Math.abs(this._wand.x - this._ball.x) >= this._wand.width / 2){
	    		PublicData.gameStatus = PublicData.GAME_OVER;
	    		this.showGameOver();
			}
    	
		this._ball.x += this._ball.speedX;
		this._ball.y += this._ball.speedY;
    },
    
    showGameOver : function(){
		
		var size  = cc.director.getWinSize();
		this.layerGameOver = cc.LayerColor.create(cc.color(255,255,255,200));
		this.addChild(this.layerGameOver,10);
		
		var label = cc.LabelTTF.create("再来一次","Aria",64);
		label.color = cc.color(0,0,0);
		var self = this;
		
		var mlabel = new cc.MenuItemLabel(label,function(){
			PublicData.gameStatus = PublicData.GAME_START;
			self.removeChild(self.layerGameOver);
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

 
var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

function lzLog(){
	var str = "";
	for (var i = 0; i < arguments.length; i++) {
		str += arguments[i] + "=";
	}
	console.log(str);
}
