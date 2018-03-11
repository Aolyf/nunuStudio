"use strict";

function PanelContainer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Object inspector", Editor.filePath + "icons/misc/magnifier.png");

	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.panel = null;
}

PanelContainer.prototype = Object.create(TabElement.prototype);

PanelContainer.prototype.isAttached = function(object)
{
	return false;
};

PanelContainer.prototype.updateSelection = function()
{	
	this.attach();
};

PanelContainer.prototype.updateView = function()
{	
	if(this.panel !== null)
	{
		this.panel.updatePanel();
	}
};

PanelContainer.prototype.attach = function(object)
{
	if(object === undefined)
	{
		if(Editor.hasObjectSelected())
		{
			object = Editor.selectedObjects[0];
		}
	}

	if(this.panel !== null)
	{
		this.panel.destroy();
		this.panel = null;
	}

	if(object instanceof THREE.Object3D)
	{
		if(object.locked)
		{
			this.panel = new LockedPanel(this.element, object);
		}
		else if(object instanceof SpineAnimation)
		{
			this.panel = new SpinePanel(this.element, object);
		}
		else if(object instanceof THREE.SkinnedMesh)
		{
			this.panel = new MeshPanel(this.element, object);
		}
		else if(object instanceof THREE.Mesh)
		{
			if(object instanceof Text3D)
			{
				this.panel = new Text3DPanel(this.element, object);
			}
			else
			{
				this.panel = new MeshPanel(this.element, object);
			}
		}
		else if(object instanceof THREE.Light)
		{
			if(object instanceof THREE.PointLight)
			{
				this.panel = new PointLightPanel(this.element, object);
			}
			else if(object instanceof THREE.RectAreaLight)
			{
				this.panel = new RectAreaLightPanel(this.element, object);
			}
			else if(object instanceof THREE.SpotLight)
			{
				this.panel = new SpotLightPanel(this.element, object);
			}
			else if(object instanceof THREE.DirectionalLight)
			{
				this.panel = new DirectionalLightPanel(this.element, object);
			}
			else if(object instanceof THREE.HemisphereLight)
			{
				this.panel = new HemisphereLightPanel(this.element, object);
			}
			else
			{
				this.panel = new AmbientLightPanel(this.element, object);
			}
		}
		else if(object instanceof Sky)
		{
			this.panel = new SkyPanel(this.element, object);
		}
		else if(object instanceof LeapMotion)
		{
			this.panel = new LeapPanel(this.element, object);
		}
		else if(object instanceof KinectDevice)
		{
			this.panel = new KinectPanel(this.element, object);
		}
		else if(object instanceof PerspectiveCamera)
		{
			this.panel = new PerspectiveCameraPanel(this.element, object);
		}
		else if(object instanceof OrthographicCamera)
		{
			this.panel = new OrthographicCameraPanel(this.element, object);
		}
		else if(object instanceof CubeCamera)
		{
			this.panel = new CubeCameraPanel(this.element, object);
		}
		else if(object instanceof THREE.Audio)
		{
			this.panel = new AudioPanel(this.element, object);
		}
		else if(object instanceof Scene)
		{
			this.panel = new ScenePanel(this.element, object);
		}
		else if(object instanceof Script)
		{
			this.panel = new ScriptPanel(this.element, object);
		}
		else if(object instanceof Program)
		{
			this.panel = new ProgramPanel(this.element, object);
		}
		else if(object instanceof PhysicsObject)
		{
			this.panel = new PhysicsPanel(this.element, object);
		}
		else if(object instanceof OrbitControls)
		{
			this.panel = new OrbitControlsPanel(this.element, object);
		}
		else if(object instanceof FirstPersonControls)
		{
			this.panel = new FirstPersonControlsPanel(this.element, object);
		}
		else
		{
			this.panel = new ObjectPanel(this.element, object);
		}

		this.panel.form.updateInterface();
		this.panel.updatePanel();
		this.panel.updateInterface();
	}
};
