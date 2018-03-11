"use strict";

function GeometryAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Editor.filePath + "icons/misc/scene.png");
	
	//Self pointer
	var self = this;

	//Image
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5px";
	this.element.appendChild(this.image);

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption("Rename", function()
		{
			Editor.history.add(new ChangeAction(self.asset, "name", prompt("Rename", self.asset.name)));
			Editor.updateViewsGUI();
		});
		
		context.addOption("Delete", function()
		{
			Editor.program.removeFont(self.asset, Editor.defaultFont);
			Editor.updateViewsGUI();
		});

		context.addOption("Copy", function()
		{
			try
			{
				Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
			}
			catch(e){}
		});
		
		context.updateInterface();
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		//Insert into drag buffer
		if(self.asset !== null)
		{
			event.dataTransfer.setData("uuid", self.asset.uuid);
			DragBuffer.pushDragElement(self.asset);
		}
	};

	//Drag end (called after of ondrop)
	this.element.ondragend = function(event)
	{
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);
	};
}

GeometryAsset.prototype = Object.create(Asset.prototype);

//Set object to file
GeometryAsset.prototype.setAsset = function(geometry)
{
	this.asset = geometry;
	this.updateMetadata();
};

//Update material preview
GeometryAsset.prototype.updateMetadata = function()
{
	if(this.asset !== null)
	{
		this.setText(this.asset.name);

		var image = this.image;

		GeometryRenderer.render(this.asset, function(url)
		{
			image.src = url;
		});
	}
};

//Update interface
GeometryAsset.prototype.updateInterface = function()
{
	Asset.prototype.updateInterface.call(this);

	this.image.width = this.size.x * this.scale.x;
	this.image.height = this.size.y * this.scale.y;
	this.image.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
};