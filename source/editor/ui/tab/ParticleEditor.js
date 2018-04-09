"use strict";

function ParticleEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Particle", Editor.filePath + "icons/misc/particles.png");

	//Main container
	this.main = new DualDivision(this.element);
	this.main.tabPosition = 0.6;
	this.main.tabPositionMin = 0.05;
	this.main.tabPositionMax = 0.95;

	//Change main div aspect
	this.main.divB.style.overflow = "auto";
	this.main.divB.style.cursor = "default";
	this.main.divB.style.backgroundColor = Editor.theme.panelColor;

	//Self pointer
	var self = this;

	//Canvas
	this.canvas = new Canvas(this.main.divA);

	//Element atributes
	this.children = [];

	//Renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = false;
	
	//Particle preview
	this.scene = new THREE.Scene();
	this.scene.matrixAutoUpdate = false;
	this.scene.add(new THREE.GridHelper(50, 50, 0x888888));
	this.scene.add(new THREE.AxesHelper(50));

	//Particle
	this.particle = null;

	//Camera
	this.camera = new PerspectiveCamera(90, this.canvas.size.x/this.canvas.size.y);
	this.cameraRotation = new THREE.Vector2(0, 0.5);
	this.cameraDistance = 5;
	this.updateCamera();
	this.scene.add(this.camera);

	//Form
	this.form = new Form(this.main.divB);
	this.form.defaultTextWidth = 80;
	this.form.position.set(10, 8);
	this.form.spacing.set(10, 5);
	
	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.particle !== null)
		{
			Editor.history.add(new ChangeAction(self.particle, "name", self.name.getText()));
			Editor.updateViewsGUI();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture");
	this.texture = new TextureChooser(this.form.element);
	this.texture.size.set(100, 100);
	this.texture.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.particle.group, "texture", self.texture.getValue()));
		self.particle.reload();
	});
	this.form.add(this.texture);
	this.form.nextRow();

	//Max particle count
	this.form.addText("Particle count");
	this.maxParticleCount = new NumberBox(this.form.element);
	this.maxParticleCount.setStep(1.0);
	this.maxParticleCount.size.set(100, 18);
	this.maxParticleCount.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.group, "maxParticleCount", self.maxParticleCount.getValue()));
		self.particle.reload();
	});
	this.form.add(this.maxParticleCount);
	this.form.nextRow();

	//Blending mode
	this.form.addText("Blending Mode");
	this.blending = new DropdownList(this.form.element);
	this.blending.size.set(100, 18);
	this.blending.addValue("None", THREE.NoBlending);
	this.blending.addValue("Normal", THREE.NormalBlending);
	this.blending.addValue("Additive", THREE.AdditiveBlending);
	this.blending.addValue("Subtractive", THREE.SubtractiveBlending);
	this.blending.addValue("Multiply", THREE.MultiplyBlending);
	this.blending.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.group, "blending", self.blending.getValue()));
		self.particle.reload();
	});
	this.form.add(this.blending);
	this.form.nextRow();

	//Direction (Time scale)
	this.form.addText("Direction");
	this.direction = new DropdownList(this.form.element);
	this.direction.size.set(100, 18);
	this.direction.addValue("Forward", 1);
	this.direction.addValue("Backward", -1);
	this.direction.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.emitter, "direction", self.direction.getValue()));
		self.particle.reload();
	});
	this.form.add(this.direction);
	this.form.nextRow();

	//Particle Count
	this.form.addText("Particle rate");
	this.particleCount = new NumberBox(this.form.element);
	this.particleCount.size.set(50, 18);
	this.particleCount.setStep(1);
	this.particleCount.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.emitter, "particleCount", self.particleCount.getValue()));
		self.particle.reload();
	});
	this.form.add(this.particleCount);
	this.form.nextRow();

	//Particle Duration
	this.form.addText("Duration");
	this.duration = new NumberBox(this.form.element);
	this.duration.size.set(50, 18);
	this.duration.setRange(0, Number.MAX_SAFE_INTEGER);
	this.duration.setOnChange(function()
	{
		var duration = self.duration.getValue();
		if(duration === 0)
		{
			duration = null;
		}

		Editor.history.add(new ChangeAction(self.particle.emitter, "duration", duration));
		self.particle.reload();
	});
	this.form.add(this.duration);
	this.form.nextRow();

	//Emmitter type
	this.form.addText("Emitter Type");
	this.type = new DropdownList(this.form.element);
	this.type.size.set(100, 18);
	this.type.addValue("Box", SPE.distributions.BOX);
	this.type.addValue("Sphere", SPE.distributions.SPHERE);
	this.type.addValue("Disc", SPE.distributions.DISC);
	this.type.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.emitter, "type", self.type.getValue()));
		self.particle.reload();
	});
	this.form.add(this.type);
	this.form.nextRow();

	//Max age
	this.form.addText("Max Age");
	this.maxAgeValue = new NumberBox(this.form.element);
	this.maxAgeValue.size.set(60, 18);
	this.maxAgeValue.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxAgeValue.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.maxAge, "value", self.maxAgeValue.getValue()));
		self.particle.reload();
	});
	this.form.add(this.maxAgeValue);
	this.form.addText("+/-", true);
	this.maxAgeSpread = new NumberBox(this.form.element);
	this.maxAgeSpread.size.set(60, 18);
	this.maxAgeSpread.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxAgeSpread.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.maxAge, "spread", self.maxAgeSpread.getValue()));
		self.particle.reload();
	});
	this.form.add(this.maxAgeSpread);
	this.form.nextRow();

	//Position
	this.form.addText("Position");
	this.form.nextRow();

	this.form.addText("Initial");
	this.positionValue = new CoordinatesBox(this.form.element);
	this.positionValue.setOnChange(function()
	{
		self.particle.emitter.position.value.copy(self.positionValue.getValue());
		self.particle.reload();
	});
	this.form.add(this.positionValue);
	this.form.nextRow();

	this.form.addText("Variation");
	this.positionSpread = new CoordinatesBox(this.form.element);
	this.positionSpread.setOnChange(function()
	{
		self.particle.emitter.position.spread.copy(self.positionSpread.getValue());
		self.particle.reload();
	});
	this.form.add(this.positionSpread);
	this.form.nextRow();

	//Velocity
	this.form.addText("Velocity");
	this.form.nextRow();

	this.form.addText("Initial");
	this.velocityValue = new CoordinatesBox(this.form.element);
	this.velocityValue.setOnChange(function()
	{
		self.particle.emitter.velocity.value.copy(self.velocityValue.getValue());
		self.particle.reload();
	});
	this.form.add(this.velocityValue);
	this.form.nextRow();

	this.form.addText("Variation");
	this.velocitySpread = new CoordinatesBox(this.form.element);
	this.velocitySpread.setOnChange(function()
	{
		self.particle.emitter.velocity.spread.copy(self.velocitySpread.getValue());
		self.particle.reload();
	});
	this.form.add(this.velocitySpread);
	this.form.nextRow();

	//Acceleration
	this.form.addText("Acceleration");
	this.form.nextRow();

	this.form.addText("Initial");
	this.accelerationValue = new CoordinatesBox(this.form.element);
	this.accelerationValue.setOnChange(function()
	{
		self.particle.emitter.acceleration.value.copy(self.accelerationValue.getValue());
		self.particle.reload();
	});
	this.form.add(this.accelerationValue);
	this.form.nextRow();

	this.form.addText("Variation");
	this.accelerationSpread = new CoordinatesBox(this.form.element);
	this.accelerationSpread.setOnChange(function()
	{
		self.particle.emitter.acceleration.spread.copy(self.accelerationSpread.getValue());
		self.particle.reload();
	});
	this.form.add(this.accelerationSpread);
	this.form.nextRow();

	//Wiggle
	this.form.addText("Wiggle");
	this.wiggleValue = new NumberBox(this.form.element);
	this.wiggleValue.size.set(60, 18);
	this.wiggleValue.setRange(0, Number.MAX_SAFE_INTEGER);
	this.wiggleValue.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.wiggle, "value", self.wiggleValue.getValue()));
		self.particle.reload();
	});
	this.form.add(this.wiggleValue);
	this.form.addText("+/-", true);
	this.wiggleSpread = new NumberBox(this.form.element);
	this.wiggleSpread.size.set(60, 18);
	this.wiggleSpread.setRange(0, Number.MAX_SAFE_INTEGER);
	this.wiggleSpread.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.wiggle, "spread", self.wiggleSpread.getValue()));
		self.particle.reload();
	});
	this.form.add(this.wiggleSpread);
	this.form.nextRow();
	
	//Opacity graph
	this.form.addText("Opacity");
	this.opacity = new Graph(this.form.element);
	this.opacity.size.set(200, 120)
	this.opacity.setOnChange(function(value)
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.opacity, "value", value));
	});
	this.opacity.addGraph("spread", "#AAAAAA");
	this.opacity.setOnChange(function(value)
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.opacity, "spread", value));
	}, "spread");
	this.form.add(this.opacity);
	this.form.nextRow();

	//Scale
	this.form.addText("Scale");
	this.form.addText("Min", true);
	this.scaleMin = new NumberBox(this.form.element);
	this.scaleMin.size.set(50, 18);
	this.scaleMin.setOnChange(function()
	{
		var min = self.scaleMin.getValue();
		var max = self.scaleMax.getValue();
		self.scale.setRange(min, max);
	});
	this.form.add(this.scaleMin);
	this.form.addText("Max", true);
	this.scaleMax = new NumberBox(this.form.element);
	this.scaleMax.size.set(50, 18);
	this.scaleMax.setOnChange(function()
	{
		var min = self.scaleMin.getValue();
		var max = self.scaleMax.getValue();
		self.scale.setRange(min, max);
	});
	this.form.add(this.scaleMax);
	this.form.nextRow();

	//Scale graph
	this.form.addText("");
	this.scale = new Graph(this.form.element);
	this.scale.size.set(200, 120)
	this.scale.setOnChange(function(value)
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.size, "value", value));
	});
	this.scale.addGraph("spread", "#AAAAAA");
	this.scale.setOnChange(function(value)
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.size, "spread", value));
	}, "spread");
	this.form.add(this.scale);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.form.addText("Min", true);
	this.angleMin = new NumberBox(this.form.element);
	this.angleMin.size.set(50, 18);
	this.angleMin.setOnChange(function()
	{
		var min = self.angleMin.getValue();
		var max = self.angleMax.getValue();
		self.angle.setRange(min, max);
	});
	this.form.add(this.angleMin);
	this.form.addText("Max", true);
	this.angleMax = new NumberBox(this.form.element);
	this.angleMax.size.set(50, 18);
	this.angleMax.setOnChange(function()
	{
		var min = self.angleMin.getValue();
		var max = self.angleMax.getValue();
		self.angle.setRange(min, max);
	});
	this.form.add(this.angleMax);
	this.form.nextRow();

	//Rotation graph
	this.form.addText("");
	this.angle = new Graph(this.form.element);
	this.angle.size.set(200, 120)
	this.angle.setOnChange(function(value)
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.angle, "value", value));
	});
	this.angle.addGraph("spread", "#AAAAAA");
	this.angle.setOnChange(function(value)
	{
		Editor.history.add(new ChangeAction(self.particle.emitter.angle, "spread", value));
	}, "spread");
	this.form.add(this.angle);
	this.form.nextRow();

	//Color
	this.form.addText("Color");
	this.form.nextRow();

	this.form.addText("Base");
	this.colorValue = new ColorGradientChooser(this.form.element);
	this.colorValue.size.set(190, 20);
	this.colorValue.setOnChange(function(color, index)
	{
		Editor.history.add(new CallbackAction(new ChangeAction(self.particle.emitter.color.value, index, color.clone()), function()
		{
			self.particle.reload();
		}));
	});
	this.form.add(this.colorValue);
	this.form.nextRow();
	
	this.form.addText("Spread");
	this.colorSpread = new ColorGradientChooser(this.form.element);
	this.colorSpread.size.set(190, 20);
	this.colorSpread.setOnChange(function(color, index)
	{
		Editor.history.add(new CallbackAction(new ChangeAction(self.particle.emitter.color.spread, index, new THREE.Vector3(color.r, color.g, color.b)), function()
		{
			self.particle.reload();
		}));
	});
	this.form.add(this.colorSpread);
	this.form.nextRow();
}

ParticleEditor.prototype = Object.create(TabElement.prototype);

//Update object data
ParticleEditor.prototype.updateMetadata = function()
{
	if(this.particle !== null)
	{
		this.setName(this.particle.name);
		this.name.setText(this.particle.name);
		
		//Check if object has a parent
		if(this.particle.parent === null)
		{
			this.close();
			return;
		}

		//Check if object exists in parent
		var children = this.particle.parent.children;
		for(var i = 0; i < children.length; i++)
		{
			if(this.particle.uuid === children[i].uuid)
			{
				return;
			}
		}

		//If not found close tab
		if(i >= children.length)
		{
			this.close();
		}
	}
};

//Attach particle to particle editor
ParticleEditor.prototype.attach = function(particle)
{
	//Attach particle
	this.particle = particle;
	this.updateMetadata();
	
	//Group attributes
	this.name.setText(particle.name);
	this.texture.setValue(particle.group.texture);
	this.maxParticleCount.setValue(particle.group.maxParticleCount);
	this.blending.setValue(particle.group.blending);
	this.direction.setValue(particle.emitter.direction);

	//Emitter attributes
	this.particleCount.setValue(particle.emitter.particleCount);
	if(particle.emitter.duration !== null)
	{
		this.duration.setValue(particle.emitter.duration);
	}
	else
	{
		this.duration.setValue(0);
	}
	this.type.setValue(particle.emitter.type);
	this.maxAgeValue.setValue(particle.emitter.maxAge.value);
	this.maxAgeSpread.setValue(particle.emitter.maxAge.spread);
	this.positionValue.setValue(particle.emitter.position.value);
	this.positionSpread.setValue(particle.emitter.position.spread);
	this.velocityValue.setValue(particle.emitter.velocity.value);
	this.velocitySpread.setValue(particle.emitter.velocity.spread);
	this.accelerationValue.setValue(particle.emitter.acceleration.value);
	this.accelerationSpread.setValue(particle.emitter.acceleration.spread);
	this.wiggleValue.setValue(particle.emitter.wiggle.value);
	this.wiggleSpread.setValue(particle.emitter.wiggle.spread);

	this.opacity.setValue(particle.emitter.opacity.value);
	this.opacity.setValue(particle.emitter.opacity.spread, "spread");

	this.scale.setValue(particle.emitter.size.value);
	this.scale.setValue(particle.emitter.size.spread, "spread");
	this.scaleMin.setValue(this.scale.min);
	this.scaleMax.setValue(this.scale.max);

	this.angle.setValue(particle.emitter.angle.value);
	this.angle.setValue(particle.emitter.angle.spread, "spread");
	this.angleMin.setValue(this.angle.min);
	this.angleMax.setValue(this.angle.max);

	this.colorValue.setValue(particle.emitter.color.value);

	var colorSpread = [];
	for(var i = 0; i < 4; i++)
	{
		var color = particle.emitter.color.spread[i];
		colorSpread.push(new THREE.Color(color.x, color.y, color.z));
	}
	this.colorSpread.setValue(colorSpread);

	//Create runtime particle to preview particle
	this.particle.reload();
};

//Check if particle is attached to tab
ParticleEditor.prototype.isAttached = function(particle)
{
	return this.particle === particle;
};

//Update camera position and rotation from variables
ParticleEditor.prototype.updateCamera = function()
{
	//Calculate direction vector
	var cosAngleY = Math.cos(this.cameraRotation.y);
	var position = new THREE.Vector3(this.cameraDistance * Math.cos(this.cameraRotation.x)*cosAngleY, this.cameraDistance * Math.sin(this.cameraRotation.y), this.cameraDistance * Math.sin(this.cameraRotation.x)*cosAngleY);
	this.camera.position.copy(position);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));
};

//Activate code editor
ParticleEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	Editor.mouse.setCanvas(this.canvas.element);
};

//Destroy
ParticleEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);
	
	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer = null;
	}
};

//Update material editor
ParticleEditor.prototype.update = function()
{
	//Graphs
	this.opacity.update();
	this.scale.update();
	this.angle.update();
	
	//Get mouse input
	if(Editor.mouse.insideCanvas())
	{
		//Move camera
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			this.cameraRotation.x -= 0.003 * Editor.mouse.delta.x;
			this.cameraRotation.y -= 0.003 * Editor.mouse.delta.y;

			//Limit Vertical Rotation to 90 degrees
			if(this.cameraRotation.y < -1.57)
			{
				this.cameraRotation.y = -1.57;
			}
			else if(this.cameraRotation.y > 1.57)
			{
				this.cameraRotation.y = 1.57;
			}
		}

		//Camera zoom
		this.cameraDistance += Editor.mouse.wheel * 0.005;
		if(this.cameraDistance < 0.1)
		{
			this.cameraDistance = 0.1;
		}

		this.updateCamera();
	}
	
	if(this.renderer !== null)
	{
		this.particle.matrixWorld.getInverse(this.scene.matrixWorld, false);

		//Render grid and axis
		this.renderer.autoClearColor = true;
		this.renderer.autoClearDepth = true;
		this.renderer.autoClearStencil = true;
		this.renderer.render(this.scene, this.camera);

		//Render particle
		this.renderer.autoClearColor = false;
		this.renderer.autoClearDepth = false;
		this.renderer.autoClearStencil = false;
		this.renderer.render(this.particle, this.camera);
	}
};

//Update division
ParticleEditor.prototype.updateInterface = function()
{
	if(this.visible)
	{
		//Main container
		this.main.size.copy(this.size);
		this.main.updateInterface();

		//Canvas
		this.canvas.size.set(this.size.x * this.main.tabPosition, this.size.y);
		this.canvas.updateInterface();

		//Renderer and canvas
		this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
		this.camera.aspect = this.canvas.size.x/this.canvas.size.y
		this.camera.updateProjectionMatrix();

		//Children
		for(var i = 0; i < this.children.length; i++)
		{
			this.children[i].updateInterface();
		}

		this.form.updateInterface();

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
