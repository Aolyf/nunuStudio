"use strict";

function CubeTextureEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Texture", Editor.filePath + "icons/misc/cube.png");

	var self = this;

	this.texture = null;

	//Dual division
	this.division = new DualDivision(this.element);
	this.division.setOnResize(function()
	{
		self.updateInterface();
	});
	this.division.tabPosition = 0.5;
	this.division.tabPositionMin = 0.3;
	this.division.tabPositionMax = 0.7;
	this.division.divB.style.overflow = "auto";
	
	//Canvas
	this.canvas = new Canvas(this.division.divA);

	//Renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = false;

	//Camera
	this.camera = new PerspectiveCamera(100, this.canvas.width/this.canvas.height);

	//Scene
	this.scene = new THREE.Scene();

	//Texture
	this.texture = null;

	//Form
	this.form = new Form(this.division.divB);
	this.form.position.set(10, 5);
	this.form.spacing.set(5, 5);

	this.form.addText("Cube Texture Editor");
	this.form.nextRow();

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.name = self.name.getText();
			self.updateMaterial();
			Editor.updateViewsGUI();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Minification filter
	this.form.addText("Min. filter");
	this.minFilter = new DropdownList(this.form.element);
	this.minFilter.size.set(150, 18);
	this.minFilter.addValue("Nearest", THREE.NearestFilter);
	this.minFilter.addValue("Linear", THREE.LinearFilter);
	this.minFilter.addValue("MIP Nearest Nearest", THREE.NearestMipMapNearestFilter);
	this.minFilter.addValue("MIP Nearest Linear", THREE.NearestMipMapLinearFilter);
	this.minFilter.addValue("MIP Linear Nearest", THREE.LinearMipMapNearestFilter);
	this.minFilter.addValue("MIP Linear Linear", THREE.LinearMipMapLinearFilter);
	this.minFilter.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.minFilter = self.minFilter.getValue();
			self.updateMaterial();
		}
	});
	this.form.add(this.minFilter);
	this.form.nextRow();

	//Magnification filter
	this.form.addText("Mag. filter");
	this.magFilter = new DropdownList(this.form.element);
	this.magFilter.size.set(150, 18);
	this.magFilter.addValue("Nearest", THREE.NearestFilter);
	this.magFilter.addValue("Linear", THREE.LinearFilter);
	this.magFilter.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.magFilter = self.magFilter.getValue();
			self.updateMaterial();
		}
	});
	this.form.add(this.magFilter);
	this.form.nextRow();

	//Mapping
	this.form.addText("Mapping");
	this.mapping = new DropdownList(this.form.element);
	this.mapping.size.set(150, 18);
	this.mapping.addValue("Reflection Mapping", THREE.CubeReflectionMapping);
	this.mapping.addValue("Refraction Mapping", THREE.CubeRefractionMapping);
	this.mapping.setOnChange(function()
	{
		self.texture.mapping = self.mapping.getValue();
		self.updateMaterial();
	});
	this.form.add(this.mapping);
	this.form.nextRow();

	//Size
	this.form.addText("Size");
	this.textureSize = new DropdownList(this.form.element);
	this.textureSize.size.set(120, 18);
	this.textureSize.setOnChange(function()
	{
		self.texture.size = self.textureSize.getValue();
		self.texture.updateImages();
	});
	this.form.add(this.textureSize);
	this.form.nextRow();

	//Size options
	for(var i = 2; i < 12; i++)
	{
		var size = Math.pow(2, i);
		this.textureSize.addValue(size + "x" + size, size);
	}

	//Mode
	this.form.addText("Mode");
	this.mode = new DropdownList(this.form.element);
	this.mode.size.set(120, 18);
	this.mode.setOnChange(function()
	{
		self.texture.mode = self.mode.getValue();
		self.texture.updateImages();
		self.updateMode();
		Editor.updateViewsGUI();
	});
	this.mode.addValue("Cube", CubeTexture.CUBE);
	this.mode.addValue("Cross", CubeTexture.CROSS);
	this.mode.addValue("Equirectangular", CubeTexture.EQUIRECTANGULAR);
	this.form.add(this.mode);
	this.form.nextRow();

	//Flip Y
	this.form.addText("Flip Y");
	this.flipY = new CheckBox(this.form.element);
	this.flipY.size.set(15, 15);
	this.flipY.setOnChange(function()
	{
		self.texture.flipY = self.flipY.getValue();
		self.updateMaterial();
	});
	this.form.add(this.flipY);
	this.form.nextRow();

	//Cube texture
	this.form.addText("Cube texture");
	this.form.nextRow();

	//Cube images
	this.images = new Division(this.form.element);
	this.images.element.style.pointerEvents = "auto";
	this.images.size.set(400, 300);
	this.form.add(this.images);
	this.form.nextRow();

	//Image
	this.image = new ImageChooser(this.images.element);
	this.image.position.set(0, 0);
	this.image.size.set(400, 200);
	this.image.setOnChange(function()
	{
		var image = self.image.getValue();
		self.texture.images[0] = image;
		self.texture.updateImages();
		Editor.updateViewsGUI();
	});
	this.image.updateInterface();

	//Cube faces
	this.cube = [];

	//Top
	this.top = new ImageChooser(this.images.element);
	this.top.position.set(100, 0);
	this.top.size.set(100, 100);
	this.top.setOnChange(function()
	{
		var image = self.top.getValue();
		self.texture.images[CubeTexture.TOP] = image;
		self.texture.updateImages();
		Editor.updateViewsGUI();
	});
	this.cube.push(this.top);

	//Left
	this.left = new ImageChooser(this.images.element);
	this.left.size.set(100, 100);
	this.left.position.set(0, 100);
	this.left.setOnChange(function()
	{
		var image = self.left.getValue();
		self.texture.images[CubeTexture.LEFT] = image;
		self.texture.updateImages();
		Editor.updateViewsGUI();
	});
	this.cube.push(this.left);

	//Front
	this.front = new ImageChooser(this.images.element);
	this.front.size.set(100, 100);
	this.front.position.set(100, 100);
	this.front.setOnChange(function()
	{
		var image = self.front.getValue();
		self.texture.images[CubeTexture.FRONT] = image;
		self.texture.updateImages();
		Editor.updateViewsGUI();
	});
	this.cube.push(this.front);

	//Right
	this.right = new ImageChooser(this.images.element);
	this.right.size.set(100, 100);
	this.right.position.set(200, 100);
	this.right.setOnChange(function()
	{
		var image = self.right.getValue();
		self.texture.images[CubeTexture.RIGHT] = image;
		self.texture.updateImages();
		Editor.updateViewsGUI();
	});
	this.cube.push(this.right);

	//Back
	this.back = new ImageChooser(this.images.element);
	this.back.size.set(100, 100);
	this.back.position.set(300, 100);
	this.back.setOnChange(function()
	{
		var image = self.back.getValue();
		self.texture.images[CubeTexture.BACK] = image;
		self.texture.updateImages();
		Editor.updateViewsGUI();
	});
	this.cube.push(this.back);

	//Bottom
	this.bottom = new ImageChooser(this.images.element);
	this.bottom.position.set(100, 200);
	this.bottom.size.set(100, 100);
	this.bottom.setOnChange(function()
	{
		var image = self.bottom.getValue();
		self.texture.images[CubeTexture.BOTTOM] = image;
		self.texture.updateImages();
		Editor.updateViewsGUI();
	});
	this.cube.push(this.bottom);
}

CubeTextureEditor.prototype = Object.create(TabElement.prototype);

//Update test material
CubeTextureEditor.prototype.updateMaterial = function()
{
	this.texture.needsUpdate = true;
	
	//TODO <ADD CHANGE TO HISTORY>
};

//Update input elements
CubeTextureEditor.prototype.updateMode = function()
{
	var mode = this.mode.getValue();

	if(mode === CubeTexture.CUBE)
	{
		this.image.visible = false;

		for(var i = 0; i < this.cube.length; i++)
		{
			this.cube[i].visible = true;
			this.cube[i].updateInterface();
		}
	}
	else
	{
		this.image.visible = true;
	
		for(var i = 0; i < this.cube.length; i++)
		{
			this.cube[i].visible = false;
			this.cube[i].updateInterface();
		}

		if(mode === CubeTexture.CROSS)
		{
			this.image.size.set(400, 300);
		}
		else
		{
			this.image.size.set(400, 200);
		}
	}

	this.image.updateInterface();
};

//Check if texture is attached to tab
CubeTextureEditor.prototype.isAttached = function(texture)
{
	return this.texture === texture;
};

//Activate
CubeTextureEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	Editor.mouse.setCanvas(this.canvas.element);
};

//Destroy
CubeTextureEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer = null;
	}
};

//Update object data
CubeTextureEditor.prototype.updateMetadata = function()
{
	if(this.texture !== null)
	{
		//Set name
		if(this.texture.name !== undefined)
		{
			this.setName(this.texture.name);
			this.name.setText(this.texture.name);
		}

		//If not found close tab
		if(Editor.program.textures[this.texture.uuid] === undefined)
		{
			this.close();
		}
	}
};

//Attach texure
CubeTextureEditor.prototype.attach = function(texture)
{
	this.texture = texture;
	this.updateMetadata();

	this.scene.background = texture;

	this.name.setText(texture.name);
	this.magFilter.setValue(texture.magFilter);
	this.minFilter.setValue(texture.minFilter);
	this.mapping.setValue(texture.mapping);
	this.textureSize.setValue(texture.size);
	this.mode.setValue(texture.mode);
	this.flipY.setValue(texture.flipY);

	if(texture.mode === CubeTexture.CROSS || texture.mode === CubeTexture.EQUIRECTANGULAR)
	{
		this.image.setValue(texture.images[0]);
	}
	else
	{
		this.top.setValue(texture.images[CubeTexture.TOP]);
		this.bottom.setValue(texture.images[CubeTexture.BOTTOM]);
		this.left.setValue(texture.images[CubeTexture.LEFT]);
		this.right.setValue(texture.images[CubeTexture.RIGHT]);
		this.front.setValue(texture.images[CubeTexture.FRONT]);
		this.back.setValue(texture.images[CubeTexture.BACK]);
	}

	this.updateMode();
};

//Update
CubeTextureEditor.prototype.update = function()
{
	if(Editor.mouse.buttonPressed(Mouse.LEFT))
	{
		var delta = Editor.mouse.delta.x * 0.004;
		this.camera.rotation.y += delta;
	}

	this.renderer.render(this.scene, this.camera);
};

//Update
CubeTextureEditor.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{	
		//Dual division
		this.division.size.copy(this.size);
		this.division.updateInterface();

		//Canvas
		this.canvas.size.set(this.size.x * this.division.tabPosition, this.size.y);
		this.canvas.updateInterface();
		
		//Renderer
		this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
		this.camera.aspect = this.canvas.size.x/this.canvas.size.y;
		this.camera.updateProjectionMatrix();

		//Form
		this.form.updateInterface();

		//Element
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
