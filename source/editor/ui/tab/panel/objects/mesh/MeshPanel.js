"use strict";

function MeshPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	this.geometry = GeometryForm.create(this.form, this.obj);
}

//Super prototypes
MeshPanel.prototype = Object.create(ObjectPanel.prototype);

//Update panel content from attached object
MeshPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	if(this.geometry !== null)
	{
		this.geometry.updateValues();
	}
};
