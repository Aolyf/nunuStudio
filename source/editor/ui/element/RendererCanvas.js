"use strict";

function RendererCanvas(parent)
{
	Canvas.call(this, parent, "canvas");

	this.renderer = null;

	this.createRenderer();
}

RendererCanvas.prototype = Object.create(Canvas.prototype);

RendererCanvas.prototype.createRenderer = function()
{
	if(Settings.render.followProject)
	{
		var antialiasing = Editor.program.antialiasing;
		var shadows = Editor.program.shadows;
		var shadowsType = Editor.program.shadowsType;
		var toneMapping = Editor.program.toneMapping;
		var toneMappingExposure = Editor.program.toneMappingExposure;
		var toneMappingWhitePoint = Editor.program.toneMappingWhitePoint;
	}
	else
	{
		var antialiasing = Settings.render.antialiasing;
		var shadows = Settings.render.shadows;
		var shadowsType = Settings.render.shadowsType;
		var toneMapping = Settings.render.toneMapping;
		var toneMappingExposure = Settings.render.toneMappingExposure;
		var toneMappingWhitePoint = Settings.render.toneMappingWhitePoint;
	}

	//Dispose old renderer
	if(this.renderer !== null)
	{
		this.renderer.dispose();
	}

	//Create renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.element, alpha: true, antialias: antialiasing});
	this.renderer.setSize(this.element.width, this.element.height);
	this.renderer.shadowMap.enabled = shadows;
	this.renderer.shadowMap.type = shadowsType;
	this.renderer.toneMapping = toneMapping;
	this.renderer.toneMappingExposure = toneMappingExposure;
	this.renderer.toneMappingWhitePoint = toneMappingWhitePoint;
};

RendererCanvas.prototype.updateInterface = function()
{
	Canvas.updateInterface.call(this);
	
	this.renderer.setSize(this.size.x, this.size.y);
};
