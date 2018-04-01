"use strict";

function AddObjectSideBar(element)
{
	var size = 40;
	
	//Add Text
	var add = new Text(element);
	add.setText("Add");
	add.size.set(40, 20);
	add.position.set(0, 210);
	add.updateInterface();

	//Add Models
	var addModel = new ButtonDrawer(element);
	addModel.setImage(Editor.filePath + "icons/models/models.png");
	addModel.size.set(size, size);
	addModel.position.set(0, 230);
	addModel.optionsSize.set(size, size);
	addModel.updateInterface();

	//Cube
	addModel.addOption(Editor.filePath + "icons/models/cube.png", function()
	{
		var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cube";
		Editor.addToScene(model);
	}, "Cube");

	//Cylinder
	addModel.addOption(Editor.filePath + "icons/models/cylinder.png", function()
	{
		var geometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cylinder";
		Editor.addToScene(model);
	}, "Cylinder");

	//Sphere
	addModel.addOption(Editor.filePath + "icons/models/sphere.png", function()
	{
		var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "sphere";
		Editor.addToScene(model);
	}, "Sphere");

	//Torus
	addModel.addOption(Editor.filePath + "icons/models/torus.png", function()
	{
		var geometry = new THREE.TorusBufferGeometry(1, 0.5, 16, 96);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "torus";
		Editor.addToScene(model);
	}, "Torus");

	//Cone
	addModel.addOption(Editor.filePath + "icons/models/cone.png", function()
	{
		var geometry = new THREE.ConeBufferGeometry(1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cone";
		Editor.addToScene(model);
	}, "Cone");

	//Text
	addModel.addOption(Editor.filePath + "icons/models/text.png", function()
	{
		var model = new Text3D("text", Editor.defaultMaterial, Editor.defaultFont);
		Editor.addToScene(model);
	}, "3D Text");

	//Tetrahedron
	addModel.addOption(Editor.filePath + "icons/models/pyramid.png", function()
	{
		var geometry = new THREE.TetrahedronGeometry(1, 0);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "tetrahedron";
		Editor.addToScene(model);
	}, "Tetrahedron");

	//Plane
	addModel.addOption(Editor.filePath + "icons/models/plane.png", function()
	{
		var geometry = new THREE.PlaneBufferGeometry(1, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "plane";
		Editor.addToScene(model);
	}, "Plane");

	//Circle
	addModel.addOption(Editor.filePath + "icons/models/circle.png", function()
	{
		var geometry = new THREE.CircleBufferGeometry(1, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "circle";
		Editor.addToScene(model);
	}, "Cicle");

	//Add lights
	var addLight = new ButtonDrawer(element);
	addLight.setImage(Editor.filePath + "icons/lights/point.png");
	addLight.size.set(size, size);
	addLight.position.set(0, 270);
	addLight.optionsSize.set(size, size);
	addLight.updateInterface();

	//Point Light
	addLight.addOption(Editor.filePath + "icons/lights/point.png", function()
	{
		Editor.addToScene(new PointLight(0x444444));
	}, "Point Light");

	//Ambient Light
	addLight.addOption(Editor.filePath + "icons/lights/ambient.png", function()
	{
		Editor.addToScene(new AmbientLight(0x444444));
	}, "Ambient Light");

	//Spot Light
	addLight.addOption(Editor.filePath + "icons/lights/spot.png", function()
	{
		Editor.addToScene(new SpotLight(0x444444));
	}, "Spot Light");

	//Directional Light
	addLight.addOption(Editor.filePath + "icons/lights/directional.png", function()
	{
		Editor.addToScene(new DirectionalLight(0x444444));
	}, "Directional Light");

	//Hemisphere Light
	addLight.addOption(Editor.filePath + "icons/lights/hemisphere.png", function()
	{
		Editor.addToScene(new HemisphereLight(0x444444));
	}, "Hemisphere Light");

	//RectArea Light
	addLight.addOption(Editor.filePath + "icons/lights/rectarea.png", function()
	{
		Editor.addToScene(new RectAreaLight(0x444444, 100, 1, 1));
	}, "RectArea Light");

	//Sky
	addLight.addOption(Editor.filePath + "icons/lights/sky.png", function()
	{
		Editor.addToScene(new Sky());
	}, "Sky");

	//Add camera
	var addCamera = new ButtonDrawer(element);
	addCamera.setImage(Editor.filePath + "icons/camera/camera.png");
	addCamera.optionsPerLine = 2;
	addCamera.size.set(size, size);
	addCamera.position.set(0, 310);
	addCamera.optionsSize.set(size, size);
	addCamera.updateInterface();

	//Perspective camera
	addCamera.addOption(Editor.filePath + "icons/camera/prespective.png", function()
	{
		Editor.addToScene(new PerspectiveCamera(60, 1));
	}, "Perspective Camera");

	//Orthographic camera
	addCamera.addOption(Editor.filePath + "icons/camera/orthographic.png", function()
	{
		Editor.addToScene(new OrthographicCamera(3, 2, OrthographicCamera.RESIZE_HORIZONTAL));
	}, "Orthographic Camera");

	//Add script
	var addScript = new ButtonDrawer(element);
	addScript.setImage(Editor.filePath + "icons/script/script.png");
	addScript.optionsPerLine = 1;
	addScript.size.set(size, size);
	addScript.position.set(0, 350);
	addScript.optionsSize.set(size, size);
	addScript.updateInterface();

	//Javascript script
	addScript.addOption(Editor.filePath + "icons/script/script.png", function()
	{
		Editor.addToScene(new Script());
	}, "JS Script");

	//Effects
	var addEffects = new ButtonDrawer(element);
	addEffects.setImage(Editor.filePath + "icons/misc/particles.png");
	addEffects.optionsPerLine = 3;
	addEffects.size.set(size, size);
	addEffects.position.set(0, 390);
	addEffects.optionsSize.set(size, size);
	addEffects.updateInterface();

	//Sprite
	addEffects.addOption(Editor.filePath + "icons/misc/sprite.png", function()
	{
		Editor.addToScene(new Sprite(Editor.defaultSpriteMaterial));
	}, "Sprite");

	//Particle emitter
	addEffects.addOption(Editor.filePath + "icons/misc/particles.png", function()
	{
		var particle = new ParticleEmitter()
		particle.texture = Editor.defaultTextureParticle;
		particle.reload();
		Editor.addToScene(particle);
	}, "Particle Emitter");

	//Container
	addEffects.addOption(Editor.filePath + "icons/misc/container.png", function()
	{
		Editor.addToScene(new Container());
	}, "Container");

	//Cube Camera
	addEffects.addOption(Editor.filePath + "icons/misc/probe.png", function()
	{
		Editor.addToScene(new CubeCamera());
	}, "Cube Camera")

	//Audio
	addEffects.addOption(Editor.filePath + "icons/misc/audio.png", function()
	{
		Editor.addToScene(new AudioEmitter(Editor.defaultAudio));
	}, "Audio");

	//Positional Audio
	addEffects.addOption(Editor.filePath + "icons/misc/audio_positional.png", function()
	{
		Editor.addToScene(new PositionalAudio(Editor.defaultAudio));
	}, "Positional Audio");

	//Lens flare
	addEffects.addOption(Editor.filePath + "icons/misc/flare.png", function()
	{
		var lensFlare = new LensFlare();

		lensFlare.addFlare(Editor.defaultTextureLensFlare[0], 700, 0.0);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 60, 0.6);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 70, 0.7);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 120, 0.9);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 70, 1.0);

		Editor.addToScene(lensFlare);
	}, "Lens flare");

	//Physics
	var addPhysics = new ButtonDrawer(element);
	addPhysics.setImage(Editor.filePath + "icons/misc/physics.png");
	addPhysics.optionsPerLine = 3;
	addPhysics.size.set(size, size);
	addPhysics.position.set(0, 430);
	addPhysics.optionsSize.set(size, size);
	addPhysics.updateInterface();

	//Physics box
	addPhysics.addOption(Editor.filePath + "icons/models/cube.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
		obj.name = "box";
		Editor.addToScene(obj);
	}, "Box");

	//Physics sphere
	addPhysics.addOption(Editor.filePath + "icons/models/sphere.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Sphere(1.0));
		obj.name = "sphere";
		Editor.addToScene(obj);
	}, "Sphere");

	//Physics Cylinder
	addPhysics.addOption(Editor.filePath + "icons/models/cylinder.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Cylinder(1.0, 1.0, 2.0, 8));
		obj.name = "cylinder";
		Editor.addToScene(obj);
	}, "Cylinder");

	//Physics Plane
	addPhysics.addOption(Editor.filePath + "icons/models/plane.png", function()
	{
		var obj = new PhysicsObject();
		obj.rotation.x = -Math.PI / 2;
		obj.body.addShape(new CANNON.Plane());
		obj.body.type = CANNON.Body.KINEMATIC;
		obj.name = "ground";
		Editor.addToScene(obj);
	}, "Ground");

	//Physics Particle
	addPhysics.addOption(Editor.filePath + "icons/models/point.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Particle());
		obj.name = "particle";
		Editor.addToScene(obj);
	}, "Particle");

	//Add device
	var addControls = new ButtonDrawer(element);
	addControls.setImage(Editor.filePath + "icons/misc/controller.png");
	addControls.optionsPerLine = 3;
	addControls.size.set(size, size);
	addControls.position.set(0, 470);
	addControls.optionsSize.set(size, size);
	addControls.updateInterface();

	//Orbit controls
	addControls.addOption(Editor.filePath + "icons/misc/orbit.png", function()
	{
		Editor.addToScene(new OrbitControls());
	}, "Orbit Controls");

	//FPS controls
	addControls.addOption(Editor.filePath + "icons/misc/crosshair.png", function()
	{
		Editor.addToScene(new FirstPersonControls());
	}, "First Person Controls");

	//Leap Hand
	addControls.addOption(Editor.filePath + "icons/hw/leap.png", function()
	{
		Editor.addToScene(new LeapMotion());
	}, "Leap Motion");

	//Kinect Skeleton
	addControls.addOption(Editor.filePath + "icons/hw/kinect.png", function()
	{
		Editor.addToScene(new KinectDevice());
	}, "Microsoft Kinect");
}
