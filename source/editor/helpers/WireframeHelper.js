"use strict";

function WireframeHelper(object, hex) 
{
	THREE.Mesh.call(this, object.geometry, new THREE.MeshBasicMaterial(
	{
		color: (hex !== undefined) ? hex : 0xFFFFFF,
		wireframe: true
	}));

	this.object = object;

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

	this.update();
}

WireframeHelper.prototype = Object.create(THREE.Mesh.prototype);

WireframeHelper.prototype.update = function()
{
	this.matrix = this.object.matrixWorld;
	this.geometry = this.object.geometry;
};