"use strict";

function SpinePanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Animation
	this.form.addText("Animation");
	this.animation = new DropdownList(this.form.element);
	this.animation.size.set(100, 18);
	this.animation.setOnChange(function()
	{
		self.obj.setAnimation(0, self.animation.getValue());
	});
	this.form.add(this.animation);
	this.form.nextRow();

	//Skin
	this.form.addText("Skin");
	this.skin = new DropdownList(this.form.element);
	this.skin.size.set(100, 18);
	this.skin.setOnChange(function()
	{
		self.obj.setSkin(self.skin.getValue());
	});
	this.form.add(this.skin);
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form.element);
	this.form.addText("Cast Shadow");
	this.castShadow.size.set(15, 15);
	this.castShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Receive shadow
	this.receiveShadow = new CheckBox(this.form.element);
	this.form.addText("React Shadow");
	this.receiveShadow.size.set(15, 15);
	this.receiveShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "receiveShadow", self.receiveShadow.getValue()));
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();
}

SpinePanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
SpinePanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
		
	this.animation.clearValues();
	this.skin.clearValues();
	
	var animations = this.obj.getAnimations();
	for(var i = 0; i < animations.length; i++)
	{
		this.animation.addValue(animations[i].name, animations[i].name);
	}

	var skins = this.obj.getSkins();
	for(var i = 0; i < skins.length; i++)
	{
		this.skin.addValue(skins[i].name, skins[i].name);
	}

	this.animation.setValue(this.obj.animation);
	this.skin.setValue(this.obj.skin);
	this.castShadow.setValue(this.obj.castShadow);
	this.receiveShadow.setValue(this.obj.receiveShadow);
};
