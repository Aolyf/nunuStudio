"use strict";

function MeshLambertMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;
	
	//Skinning
	this.form.addText("Skinning");
	this.skinning = new CheckBox(this.form.element);
	this.skinning.size.set(15, 15);
	this.skinning.updateInterface();
	this.skinning.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "skinning", self.skinning.getValue()));
	});
	this.form.add(this.skinning);
	this.form.nextRow();

	//Morph targets
	this.form.addText("Morph targets");
	this.morphTargets = new CheckBox(this.form.element);
	this.morphTargets.size.set(15, 15);
	this.morphTargets.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "morphTargets", self.morphTargets.getValue()));
	});
	this.form.add(this.morphTargets);
	this.form.nextRow();

	//Wireframe
	this.form.addText("Wireframe");
	this.wireframe = new CheckBox(this.form.element);
	this.wireframe.size.set(15, 15);
	this.wireframe.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "wireframe", self.wireframe.getValue()));
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	//Shading mode
	this.form.addText("Shading");
	this.flatShading = new DropdownList(this.form.element);
	this.flatShading.position.set(100, 85);
	this.flatShading.size.set(100, 18);
	this.flatShading.addValue("Smooth", false);
	this.flatShading.addValue("Flat", true);
	this.flatShading.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "flatShading", self.flatShading.getValue()));
			self.material.needsUpdate = true;
	});
	this.form.add(this.flatShading);
	this.form.nextRow();

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "color", new THREE.Color(self.color.getValueHex())));
			self.material.needsUpdate = true;
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new TextureBox(this.form.element);
	this.map.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	//Specular map
	this.form.addText("Specular map");
	this.form.nextRow();
	this.specularMap = new TextureBox(this.form.element);
	this.specularMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "specularMap", self.specularMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.specularMap);
	this.form.nextRow();

	//Alpha map
	this.form.addText("Alpha map");
	this.form.nextRow();
	this.alphaMap = new TextureBox(this.form.element);
	this.alphaMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "alphaMap", self.alphaMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.alphaMap);
	this.form.nextRow();

	//Emissive map
	this.form.addText("Emissive map");
	this.form.nextRow();
	this.emissiveMap = new TextureBox(this.form.element);
	this.emissiveMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "emissiveMap", self.emissiveMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissiveMap);
	this.form.nextRow();

	//Emissive color
	this.form.addText("Color");
	this.emissive = new ColorChooser(this.form.element);
	this.emissive.size.set(100, 18);
	this.emissive.setOnChange(function()
	{
		self.material.emissive.setHex(self.emissive.getValueHex());
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissive);
	this.form.nextRow();

	//Emissive intensity
	this.form.addText("Intensity");
	this.emissiveIntensity = new NumberBox(this.form.element);
	this.emissiveIntensity.size.set(60, 18);
	this.emissiveIntensity.setStep(0.1);
	this.emissiveIntensity.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "emissiveIntensity", self.emissiveIntensity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissiveIntensity);
	this.form.nextRow();

	//Environment map
	this.form.addText("Environment map");
	this.form.nextRow();
	this.envMap = new CubeTextureBox(this.form.element);
	this.envMap.size.set(100, 100);
	this.envMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "envMap", self.envMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.envMap);
	this.form.nextRow();

	//Combine environment map
	this.form.addText("Mode");
	this.combine = new DropdownList(this.form.element);
	this.combine.position.set(100, 85);
	this.combine.size.set(120, 18);
	this.combine.addValue("Multiply", THREE.MultiplyOperation);
	this.combine.addValue("Mix", THREE.MixOperation);
	this.combine.addValue("Add", THREE.AddOperation);
	this.combine.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "combine", self.combine.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.combine);
	this.form.nextRow();

	//Reflectivity
	this.form.addText("Reflectivity");
	this.reflectivity = new NumberBox(this.form.element);
	this.reflectivity.size.set(60, 18);
	this.reflectivity.setStep(0.05);
	this.reflectivity.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "reflectivity", self.reflectivity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();

	//Refraction
	this.form.addText("Refraction Ratio");
	this.refractionRatio = new NumberBox(this.form.element);
	this.refractionRatio.size.set(60, 18);
	this.refractionRatio.setStep(0.05);
	this.refractionRatio.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "refractionRatio", self.refractionRatio.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.refractionRatio);
}

MeshLambertMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshLambertMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.skinning.setValue(material.skinning);
	this.morphTargets.setValue(material.morphTargets);
	this.wireframe.setValue(material.wireframe);
	this.flatShading.setValue(material.flatShading);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.map.setValue(material.map);
	this.specularMap.setValue(material.specularMap);
	this.alphaMap.setValue(material.alphaMap);
	this.emissive.setValue(material.emissive.r, material.emissive.g, material.emissive.b);
	this.emissiveIntensity.setValue(material.emissiveIntensity);
	this.emissiveMap.setValue(material.emissiveMap);
	this.envMap.setValue(material.envMap);
	this.combine.setValue(material.combine);
	this.reflectivity.setValue(material.reflectivity || 0);
	this.refractionRatio.setValue(material.refractionRatio || 0);
};
