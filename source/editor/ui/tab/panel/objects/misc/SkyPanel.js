"use strict";

function SkyPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Sky color
	this.form.addText("Sky color");
	this.form.nextRow();

	function updateSky()
	{
		self.obj.updateSky();
	}

	//Top color
	this.form.addText("Top color");
	this.colorTop = new ColorGradientChooser(this.form.element);
	this.colorTop.size.set(190, 20);
	this.colorTop.setOnChange(function(color, index)
	{
		Editor.history.add(new CallbackAction(new ChangeAction(self.obj.colorTop, index, color.clone()), updateSky));
	});
	this.form.add(this.colorTop);
	this.form.nextRow();

	//Bottom color
	this.form.addText("Bottom color");
	this.colorBottom = new ColorGradientChooser(this.form.element);
	this.colorBottom.size.set(190, 20);
	this.colorBottom.setOnChange(function(color, index)
	{
		Editor.history.add(new CallbackAction(new ChangeAction(self.obj.colorBottom, index, color.clone()), updateSky));
	});
	this.form.add(this.colorBottom);
	this.form.nextRow();

	//Sun color
	this.form.addText("Sun Color");
	this.sunColor = new ColorChooser(this.form.element);
	this.sunColor.size.set(80, 18);
	this.sunColor.setOnChange(function()
	{
		Editor.history.add(new CallbackAction(new ChangeAction(self.obj, "sunColor", self.sunColor.getValueHex()), updateSky));
	});
	this.form.add(this.sunColor);
	this.form.nextRow();

	//Moon color
	this.form.addText("Moon Color");
	this.moonColor = new ColorChooser(this.form.element);
	this.moonColor.size.set(80, 18);
	this.moonColor.setOnChange(function()
	{
		Editor.history.add(new CallbackAction(new ChangeAction(self.obj, "moonColor", self.moonColor.getValueHex()), updateSky));
	});
	this.form.add(this.moonColor);
	this.form.nextRow();

	//Intensity
	this.form.addText("Intensity");
	this.intensity = new Slider(this.form.element);
	this.intensity.size.set(160, 18);
	this.intensity.setStep(0.01);
	this.intensity.setRange(0, 1);
	this.intensity.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "intensity", self.intensity.getValue()));
	});
	this.form.add(this.intensity);
	this.form.nextRow();

	//Day time
	this.form.addText("Day time");
	this.form.nextRow();

	//Auto update
	this.form.addText("Auto update");
	this.autoUpdate = new CheckBox(this.form.element);
	this.autoUpdate.size.set(15, 15);
	this.autoUpdate.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "autoUpdate", self.autoUpdate.getValue()));
	});
	this.form.add(this.autoUpdate);
	this.form.nextRow();

	//Day time
	this.form.addText("Day duration");
	this.dayTime = new NumberBox(this.form.element);
	this.dayTime.size.set(60, 18);
	this.dayTime.setStep(0.1);
	this.dayTime.setOnChange(function()
	{
		//Check and set day time
		var dayTime = self.dayTime.getValue();
		if(dayTime < 0)
		{
			dayTime = 0;
			self.dayTime.setValue(dayTime);
		}
		Editor.history.add(new ChangeAction(self.obj, "dayTime", dayTime));

		//Check actual time
		if(self.obj.time > dayTime)
		{
			Editor.history.add(new ChangeAction(self.obj, "time", dayTime));
			self.time.setValue(dayTime);
		}

		self.time.setRange(0, dayTime);
		self.obj.updateSky();
	});
	this.form.add(this.dayTime);
	this.form.addText("s", true);
	this.form.nextRow();

	//Actual time 
	this.form.addText("Time");
	this.time = new NumberBox(this.form.element);
	this.time.size.set(60, 18);
	this.time.setStep(0.1);
	this.time.setOnChange(function()
	{
		var time = self.time.getValue();

		if(time < 0)
		{
			time = 0;
			self.time.setValue(time);
		}
		else if(time > self.obj.dayTime)
		{
			time = self.obj.dayTime;
			self.time.setValue(time);
		}

		Editor.history.add(new ChangeAction(self.obj, "time", time));
		self.obj.updateSky();
	});
	this.form.add(this.time);
	this.form.addText("s", true);
	this.form.nextRow();

	//Sun distance
	this.form.addText("Sun distance");
	this.sunDistance = new NumberBox(this.form.element);
	this.sunDistance.size.set(60, 18);
	this.sunDistance.setStep(10);
	this.sunDistance.setOnChange(function()
	{
		Editor.history.add(new CallbackAction(new ChangeAction(self.obj, "sunDistance", self.sunDistance.getValue()), updateSky));
	});
	this.form.add(this.sunDistance);
	this.form.nextRow();

	//Shadow map
	this.form.addText("Shadows");
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form.element);
	this.form.addText("Cast Shadows");
	this.castShadow.size.set(15, 15);
	this.castShadow.position.set(5, 85);
	this.castShadow.updateInterface();
	this.castShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.sun, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Shadow resolution
	this.form.addText("Resolution");
	this.shadowWidth = new DropdownList(this.form.element);
	this.shadowWidth.size.set(60, 18);
	this.shadowWidth.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.sun.shadow.mapSize, "width", self.shadowWidth.getValue()));
		self.obj.sun.updateShadowMap();
	});
	this.form.add(this.shadowWidth);
	this.form.addText("x", true);
	this.shadowHeight = new DropdownList(this.form.element);
	this.shadowHeight.size.set(60, 18);
	this.shadowHeight.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.sun.shadow.mapSize, "height", self.shadowHeight.getValue()));
		self.obj.sun.updateShadowMap();
	});
	this.form.add(this.shadowHeight);
	this.form.nextRow();

	for(var i = 5; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.shadowWidth.addValue(size.toString(), size);
		this.shadowHeight.addValue(size.toString(), size);
	}

	//Shadowmap camera near
	this.form.addText("Near");
	this.shadowNear = new NumberBox(this.form.element);
	this.shadowNear.size.set(60, 18);
	this.shadowNear.setStep(0.1);
	this.shadowNear.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.sun.shadow.camera, "near", self.shadowNear.getValue()));
		self.obj.sun.updateShadowMap();
	});
	this.form.add(this.shadowNear);
	this.form.nextRow();
	
	//Shadowmap camera far
	this.form.addText("Far");
	this.shadowFar = new NumberBox(this.form.element);
	this.shadowFar.size.set(60, 18);
	this.shadowFar.setStep(0.1);
	this.shadowFar.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.sun.shadow.camera, "far", self.shadowFar.getValue()));
		self.obj.sun.updateShadowMap();
	});
	this.form.add(this.shadowFar);
	this.form.nextRow();

	//Shadowmap camera left
	this.form.addText("Left");
	this.shadowLeft = new NumberBox(this.form.element);
	this.shadowLeft.size.set(60, 18);
	this.shadowLeft.setStep(0.1);
	this.shadowLeft.setOnChange(function()
	{
		self.obj.sun.shadow.camera.left = self.shadowLeft.getValue();
		self.obj.sun.updateShadowMap();
	});
	this.form.add(this.shadowLeft);
	this.form.nextRow();

	//Shadowmap camera right
	this.form.addText("Right");
	this.shadowRight = new NumberBox(this.form.element);
	this.shadowRight.size.set(60, 18);
	this.shadowRight.setStep(0.1);
	this.shadowRight.setOnChange(function()
	{
		self.obj.sun.shadow.camera.right = self.shadowRight.getValue();
		self.obj.sun.updateShadowMap();
	});
	this.form.add(this.shadowRight);
	this.form.nextRow();

	//Shadowmap camera top
	this.form.addText("Top");
	this.shadowTop = new NumberBox(this.form.element);
	this.shadowTop.size.set(60, 18);
	this.shadowTop.setStep(0.1);
	this.shadowTop.setOnChange(function()
	{
		self.obj.sun.shadow.camera.top = self.shadowTop.getValue();
		self.obj.sun.updateShadowMap();
	});
	this.form.add(this.shadowTop);
	this.form.nextRow();

	//Shadowmap camera bottom
	this.form.addText("Bottom");
	this.shadowBottom = new NumberBox(this.form.element);
	this.shadowBottom.size.set(60, 18);
	this.shadowBottom.setStep(0.1);
	this.shadowBottom.setOnChange(function()
	{
		self.obj.sun.shadow.camera.bottom = self.shadowBottom.getValue();
		self.obj.sun.updateShadowMap();
	});
	this.form.add(this.shadowBottom);
	this.form.nextRow();
}

SkyPanel.prototype = Object.create(Panel.prototype);

SkyPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	this.colorTop.setValue(this.obj.colorTop);
	this.colorBottom.setValue(this.obj.colorBottom);
	
	this.sunColor.setValueHex(this.obj.sunColor);
	this.moonColor.setValueHex(this.obj.moonColor);
	this.intensity.setValue(this.obj.intensity);

	this.autoUpdate.setValue(this.obj.autoUpdate);
	this.dayTime.setValue(this.obj.dayTime);
	this.time.setValue(this.obj.time);
	this.sunDistance.setValue(this.obj.sunDistance);

	this.castShadow.setValue(this.obj.sun.castShadow);
	this.shadowWidth.setValue(this.obj.sun.shadow.mapSize.width);
	this.shadowHeight.setValue(this.obj.sun.shadow.mapSize.height);
	this.shadowNear.setValue(this.obj.sun.shadow.camera.near);
	this.shadowFar.setValue(this.obj.sun.shadow.camera.far);
	this.shadowLeft.setValue(this.obj.sun.shadow.camera.left);
	this.shadowRight.setValue(this.obj.sun.shadow.camera.right);
	this.shadowTop.setValue(this.obj.sun.shadow.camera.top);
	this.shadowBottom.setValue(this.obj.sun.shadow.camera.bottom);
};
