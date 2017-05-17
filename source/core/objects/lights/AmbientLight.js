"use strict";

/**
 * Ambient lights are used to create base ilumanition for the scene.
 *
 * They are not influenced by position, scale or rotation.
 * 
 * Based on THREE.AmbientLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/AmbientLight
 * 
 * @param {Number} hex Light color in hex RGB
 * @class AmbientLight
 * @extends {AmbientLight}
 * @module Lights
 * @constructor
 */
function AmbientLight(hex)
{
	THREE.AmbientLight.call(this, hex);
	
	this.name = "ambient";

	this.matrixAutoUpdate = false;
}

AmbientLight.prototype = Object.create(THREE.AmbientLight.prototype);