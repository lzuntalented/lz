var CardSprite = cc.Sprite.extend({
	type : 0,
	ctor : function(type){
		this.type = type;
		this._super("res/fruit/fruit_" + type + ".png");
		
	}
});

CardSprite.create = function(type){
//	if(cc.pool.hasObject(CardSprite)){
//		return cc.pool.getFromPool(CardSprite,type);
//	}
	
	return new CardSprite(type);
}
