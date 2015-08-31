var CardSprite = cc.Sprite.extend({
	number : 0,
	label : null,
	cardLayer : null,
	
	ctor : function(num,cardWidth,cardHeight,px,py){
		this._super();
		
		this.number = num;
		
		this.cardLayer = cc.LayerColor.create(cc.color(200,190,180),cardWidth - 5 ,cardHeight - 5);
		this.cardLayer.setPosition(cc.p(px,py));
		
		this.label = cc.LabelTTF.create(num,"Arial", 50);
		
		this.label.setPosition(cardWidth / 2 , cardHeight / 2);
		this.cardLayer.addChild(this.label);
		
		this.addChild(this.cardLayer);
	},
	
	setNumber : function (num){
		number = num;
		this.number = num;
		//根据不同的数字范围显示不同的颜色
		if (number >= 0 && number < 16)
		{
			this.label.fontSize = 50;
		}
		if (number >= 16 && number < 128)
		{
			this.label.fontSize = 40;
		}
		if (number >= 128 && number < 1024)
		{
			this.label.fontSize = 30;
		}
		if (number >= 1024)
		{
			this.label.fontSize = 20;
		}
		
		if (number == 0 || number == "")
		{
			this.cardLayer.color = cc.color(200, 190, 180);
		}
		if (number == 2)
		{
			this.cardLayer.color = cc.color(240, 230, 220);
		}
		if (number == 4)
		{
			this.cardLayer.color = cc.color(51, 153, 51);
		}
		if (number == 8){
			this.cardLayer.color = cc.color(255, 153, 102);
		}
		if (number == 16)
		{
			this.cardLayer.color = cc.color(153, 204, 153);
		}
		if (number == 32)
		{
			this.cardLayer.color = cc.color(153, 204, 255);
		}
		if (number == 64)
		{
			this.cardLayer.color = cc.color(255, 204, 204);
		}
		if (number == 128)
		{
			this.cardLayer.color = cc.color(204, 102, 0);
		}
		if (number == 256)
		{
			this.cardLayer.color = cc.color(153, 204, 51);
		}
		if (number == 512)
		{
			this.cardLayer.color = cc.color(255, 102, 102);
		}
		if (number == 1024)
		{
			this.cardLayer.color = cc.color(204, 204, 255);
		}
		if (number == 2048)
		{
			this.cardLayer.color = cc.color(255, 204, 00);
		}
	
		this.label.string = num;
	}
});

CardSprite.createCard = function(num,cardWidth,cardHeight,px,py){
	return new CardSprite(num,cardWidth,cardHeight,px,py);
}

//var HelloWorldScene = cc.Scene.extend({
//  onEnter:function () {
//      this._super();
//      var layer = CardSprite.createCard(2,100,100,200,200);
//      
//      this.addChild(layer);
//  }
//});