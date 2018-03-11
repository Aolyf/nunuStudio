"use strict";

function VideoAsset(parent)
{
	Asset.call(this, parent);

	this.preview = document.createElement("video");
	this.preview.volume = 0;
	this.preview.draggable = true;
	this.preview.style.position = "absolute";
	this.preview.style.top = "5%";
	this.preview.style.left = "17%";
	this.preview.style.width = "65%";
	this.preview.style.height = "65%";
	this.element.appendChild(this.preview);

	this.setIcon(Editor.filePath + "icons/misc/video.png");

	//Self pointer
	var self = this;

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption("Rename", function()
		{
			if(self.asset !== null)
			{
				Editor.history.add(new ChangeAction(self.asset, "name", prompt("Rename", self.asset.name)));
				Editor.updateViewsGUI();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.asset !== null && confirm("Delete?"))
			{
				Editor.program.removeVideo(self.asset);
				Editor.updateViewsGUI();
			}
		});

		context.addOption("Copy", function()
		{
			if(self.asset !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
				}
				catch(e){}
			}
		});

		context.addOption("Export", function()
		{
			if(Nunu.runningOnDesktop())
			{
				FileSystem.chooseFile(function(files)
				{
					if(files.length > 0)
					{
						self.asset.export(files[0].path);
					}
				}, "." + self.asset.encoding, true);
			}
			else
			{
				FileSystem.chooseFileName(function(file)
				{
					self.asset.export(file);
				}, "." + self.asset.encoding);
			}
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
		//Try to remove font from drag buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);
	};
}

VideoAsset.prototype = Object.create(Asset.prototype);

//Set object to file
VideoAsset.prototype.setAsset = function(video)
{
	this.asset = video;
	this.preview.src = video.data;

	this.updateMetadata();
};

//Update material preview
VideoAsset.prototype.updateMetadata = function()
{
	if(this.asset !== null)
	{
		this.setText(this.asset.name);
	}
};
