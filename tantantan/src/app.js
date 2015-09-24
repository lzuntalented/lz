
var HelloWorldLayer = cc.Layer.extend({
    _ball : null,
    _wand : null,
    
    _equation : null,//方程式
    _equation_a : 0,//方程式x的系数
    _equation_b : 0,//方程式的增量b
    
    _increaseX : 1,//x的增量
    
    _ballSize : 0,//球在显示时的真实半径
    
    ctor:function () {
        this._super();
		
		this.init();
        return true;
    },
    
    init : function(){
    	this._ball = new cc.Sprite(res.Start_normal_png);
    	this._ball.attr({
    		x : PublicData.SCREEN_WIDTH / 2,
    		y : PublicData.SCREEN_HEIGHT,
    		scale : 0.3
    	});
    	this._ballSize = this._ball.width * 0.3;
    	this.addChild(this._ball);
    	
    	/**/
    	var dire = Math.floor(Math.random()*2);
    	this._equation_a = Math.random() + 1;
    	this._increaseX = PublicData.increase;
    	
    	if(dire == 1){
    		this._increaseX = -PublicData.increase;
    		this._equation_a = 0 - this._equation_a;
    	}
    	
    	this._equation_b = PublicData.SCREEN_HEIGHT - PublicData.SCREEN_WIDTH / 2 * this._equation_a;
    	
    	this.scheduleUpdate();
    },
    
    getBallY : function(x){
    	return x * this._equation_a + this._equation_b;
    },
    
    getEquationB : function(x,y){
    	return y - this._equation_a * x;
    },
    
    update : function(dt){

    	if(this._ball.x < 0){
    		this._increaseX = PublicData.increase;
    		this._equation_a = 0 - this._equation_a;
    	}
    	
    	if(this._ball.x > PublicData.SCREEN_WIDTH){
    		this._increaseX = -PublicData.increase;
    		this._equation_a = 0 - this._equation_a;
    		
    		if(this._equation_a > 0){
    			this._equation_b = this._ball.y - Math.abs(this._ball.y - this._equation_b);
    		}else{
    			this._equation_b = this._ball.y + Math.abs(this._ball.y - this._equation_b);
    		}
    	}
    	
    	if(this._ball.y > PublicData.SCREEN_HEIGHT){
    		this._equation_a = 0 - this._equation_a;
    		
    		if(this._equation_a > 0){
    			this._equation_b = this._ball.y - Math.abs(this._ball.y - this._equation_b);
    		}else{
    			this._equation_b = this._ball.y + Math.abs(this._ball.y - this._equation_b);
    		}
    	}
    	
    	if(this._ball.y < 0){
    		this._equation_a = 0 - this._equation_a;
    		
    		if(this._equation_a > 0){
    			this._equation_b = 0 - this._equation_b;
    		}else{
    			this._equation_b = Math.abs(this._equation_b);
    		}
    	}
    	
    	this._ball.x += this._increaseX;
    	this._ball.y = this.getBallY(this._ball.x);
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
