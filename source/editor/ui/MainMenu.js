"use strict";

function MainMenu(parent)
{
	Element.call(this, parent);

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.barColor;
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "25px";

	this.size.set(0, 25);

	this.preventDragEvents();

	//Editor Logo
	var logo = document.createElement("img");
	logo.style.display = "block";
	logo.style.position = "absolute";
	logo.style.pointerEvents = "none";
	logo.style.width = "108px";
	logo.style.height = "18px";
	logo.style.top = "3px";
	logo.style.right = "3px";
	logo.src = Editor.filePath + "logo.png";
	this.element.appendChild(logo);

	//File
	var fileMenu = new DropdownMenu(this.element);
	fileMenu.setText("File");
	fileMenu.size.set(120, this.size.y);
	fileMenu.position.set(0,0);

	//New project
	fileMenu.addOption("New", function()
	{
		Interface.newProgram();
	}, Editor.filePath + "icons/misc/new.png");

	//Save project
	fileMenu.addOption("Save", function()
	{
		if(Editor.openFile !== null)
		{
			Editor.saveProgram(undefined, true);
		}
		else
		{
			Interface.saveProgram();
		}
	}, Editor.filePath + "icons/misc/save.png");

	//Save project
	fileMenu.addOption("Save As", function()
	{
		Interface.saveProgram();
	}, Editor.filePath + "icons/misc/save.png");

	//Load Project
	fileMenu.addOption("Load", function()
	{
		Interface.loadProgram();
	}, Editor.filePath + "icons/misc/load.png");

	//Settings
	fileMenu.addOption("Settings", function()
	{
		var tab = Interface.tab.getTab(SettingsTab);
		if(tab === null)
		{
			tab = Interface.tab.addTab(SettingsTab, true);
		}
		tab.select();
	}, Editor.filePath + "icons/misc/settings.png");

	//Publish
	var publish = fileMenu.addMenu("Publish", Editor.filePath + "icons/misc/publish.png");

	if(Nunu.runningOnDesktop())
	{
		//Publish web
		publish.addOption("Web", function()
		{
			FileSystem.chooseFile(function(files)
			{
				try
				{
					Editor.exportWebProject(files[0].path);
					Editor.alert("Project exported");
				}
				catch(e)
				{
					Editor.alert("Error exporting project (" + e + ")");
				}
			}, "", Editor.program.name);
		}, Editor.filePath + "icons/platform/web.png");

		//Publish windows
		if(FileSystem.fileExists(Editor.NWJSPath + "win"))
		{
			publish.addOption("Windows", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportWindowsProject(files[0].path);
						Editor.alert("Project exported");
					}
					catch(e)
					{
						Editor.alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Editor.filePath + "icons/platform/windows.png");
		}

		//Publish linux
		if(FileSystem.fileExists(Editor.NWJSPath + "linux"))
		{
			publish.addOption("Linux", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportLinuxProject(files[0].path);
						Editor.alert("Project exported");
					}
					catch(e)
					{
						Editor.alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Editor.filePath + "icons/platform/linux.png");
		}

		//Publish macos
		if(FileSystem.fileExists(Editor.NWJSPath + "mac"))
		{
			publish.addOption("macOS", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportMacOSProject(files[0].path);
						Editor.alert("Project exported");
					}
					catch(e)
					{
						Editor.alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Editor.filePath + "icons/platform/osx.png");
		}
	}
	//Running on web browser
	else
	{
		publish.addOption("Web", function()
		{
			FileSystem.chooseFileName(function(fname)
			{
				Editor.exportWebProjectZip(fname);
				Editor.alert("Project exported");
			}, ".zip");
		}, Editor.filePath + "icons/platform/web.png");
	}

	//Import
	fileMenu.addOption("Import", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0];
				var binary = file.name.endsWith(".nsp");

				var loader = new ObjectLoader();
				var reader = new FileReader();
				reader.onload = function()
				{
					if(binary)
					{
						var pson = new dcodeIO.PSON.StaticPair();
						var data = pson.decode(reader.result);
						var program = loader.parse(data);
					}
					else
					{
						var program = loader.parse(JSON.parse(reader.result));
					}

					for(var i = 0; i < program.children.length; i++)
					{
						Editor.program.add(program.children[i]);
					}

					Editor.updateViewsGUI();
				};

				if(binary)
				{
					reader.readAsArrayBuffer(file);
				}
				else
				{
					reader.readAsText(file);
				}
			}
		}, ".isp, .nsp");

	}, Editor.filePath + "icons/misc/import.png");

	//Export menu
	var exportMenu = fileMenu.addMenu("Export", Editor.filePath + "icons/misc/export.png");

	//Export OBJ
	exportMenu.addOption("Wavefront OBJ", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.OBJExporter();
					var data = exporter.parse(Editor.program);
					FileSystem.writeFile(files[0].path, data);
				}
			}, ".obj", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.OBJExporter();
				var data = exporter.parse(Editor.program);
				FileSystem.writeFile(fname, data);
			}, ".obj");
		}
	}, Editor.filePath + "icons/misc/scene.png");

	//Export GLTF
	exportMenu.addOption("GLTF", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.GLTFExporter();
					exporter.parse(Editor.program.scene, function(result)
					{
						var data = JSON.stringify(result, null, 2);
						FileSystem.writeFile(files[0].path, data);
					});
				}
			}, ".gltf", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.GLTFExporter();
				exporter.parse(Editor.program.scene, function(result)
				{
					var data = JSON.stringify(result, null, 2);
					FileSystem.writeFile(fname, data);
				})
			}, ".gltf");
		}
	}, Editor.filePath + "icons/gltf.png");

	//Export GLB
	exportMenu.addOption("GLB", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.GLTFExporter();
					exporter.parse(Editor.program.scene, function(result)
					{
						FileSystem.writeFileArrayBuffer(files[0].path, result);
					}, {binary: true, forceIndices: true, forcePowerOfTwoTextures: true});
				}
			}, ".glb", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.GLTFExporter();
				exporter.parse(Editor.program.scene, function(result)
				{
					FileSystem.writeFileArrayBuffer(fname, result);
				}, {binary: true, forceIndices: true, forcePowerOfTwoTextures: true});
			}, ".glb");
		}
	}, Editor.filePath + "icons/gltf.png");

	//Export STL
	exportMenu.addOption("STL", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.STLExporter();
					var data = exporter.parse(Editor.program);
					FileSystem.writeFile(files[0].path, data);
				}
			}, ".stl", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.STLExporter();
				var data = exporter.parse(Editor.program);
				FileSystem.writeFile(fname, data);
			}, ".stl");
		}
	}, Editor.filePath + "icons/misc/scene.png");

	//Export Binary STL
	exportMenu.addOption("Binary STL", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.STLBinaryExporter();
					var data = exporter.parse(Editor.program);
					FileSystem.writeFileArrayBuffer(files[0].path, data.buffer);
				}
			}, ".stl", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.STLBinaryExporter();
				var data = exporter.parse(Editor.program);
				FileSystem.writeFileArrayBuffer(fname, data.buffer);
			}, ".stl");
		}
	}, Editor.filePath + "icons/misc/scene.png");

	//Exit
	if(Nunu.runningOnDesktop())
	{
		fileMenu.addOption("Exit", function()
		{
			if(Editor.confirm("All unsaved changes to the project will be lost! Do you really wanna exit?"))
			{
				Editor.exit();
			}
		}, Editor.filePath + "icons/misc/exit.png");
	}

	fileMenu.updateInterface();

	//Editor
	var editMenu = new DropdownMenu(this.element); editMenu.setText("Edit");
	editMenu.size.set(100, this.size.y);
	editMenu.position.set(120,0);

	editMenu.addOption("Undo", function()
	{
		Editor.undo();
	}, Editor.filePath + "icons/misc/undo.png");

	editMenu.addOption("Redo", function()
	{
		Editor.redo();
	}, Editor.filePath + "icons/misc/redo.png");

	editMenu.addOption("Copy", function()
	{
		Editor.copyObject();
	}, Editor.filePath + "icons/misc/copy.png");
	
	editMenu.addOption("Cut", function()
	{
		Editor.cutObject();
	}, Editor.filePath + "icons/misc/cut.png");

	editMenu.addOption("Paste", function()
	{
		Editor.pasteObject();
	}, Editor.filePath + "icons/misc/paste.png");

	editMenu.addOption("Delete", function()
	{
		Editor.deleteObject();
	}, Editor.filePath + "icons/misc/delete.png");

	var csg = editMenu.addMenu("CSG", Editor.filePath + "icons/models/figures.png");

	var createBSP = function(object)
	{
		var geometry = object.geometry;

		if(geometry instanceof THREE.BufferGeometry)
		{
			geometry = new THREE.Geometry().fromBufferGeometry(geometry);
		}
		else
		{
			geometry = geometry.clone();
		}
		
		geometry.applyMatrix(object.matrixWorld);

		return new ThreeBSP(geometry);
	};

	csg.addOption("Intersect", function()
	{
		if(Editor.selectedObjects.length < 2)
		{
			Editor.alert("Operation needs two objects");
			return;
		}

		for(var i = 0; i < 2; i++)
		{
			if(Editor.selectedObjects[i].geometry === undefined)
			{
				Editor.alert("Operation needs two objects with geometries");
				return;
			}
		}

		var a = createBSP(Editor.selectedObjects[0]);
		var b = createBSP(Editor.selectedObjects[1]);
		
		var mesh = a.intersect(b).toMesh();
		mesh.material = Editor.defaultMaterial;

		Editor.addToScene(mesh);
	}, Editor.filePath + "icons/misc/intersect.png");

	csg.addOption("Subtract", function()
	{
		if(Editor.selectedObjects.length < 2)
		{
			Editor.alert("Operation needs two objects");
			return;
		}

		for(var i = 0; i < 2; i++)
		{
			if(Editor.selectedObjects[i].geometry === undefined)
			{
				Editor.alert("Operation needs two objects with geometries");
				return;
			}
		}
		
		var a = createBSP(Editor.selectedObjects[0]);
		var b = createBSP(Editor.selectedObjects[1]);

		var mesh = a.subtract(b).toMesh();
		mesh.material = Editor.defaultMaterial;

		Editor.addToScene(mesh);
	}, Editor.filePath + "icons/misc/subtract.png");

	csg.addOption("Union", function()
	{
		if(Editor.selectedObjects.length < 2)
		{
			Editor.alert("Operation needs two objects");
			return;
		}

		for(var i = 0; i < 2; i++)
		{
			if(Editor.selectedObjects[i].geometry === undefined)
			{
				Editor.alert("Operation needs two objects with geometries.");
				return;
			}
		}
		
		var a = createBSP(Editor.selectedObjects[0]);
		var b = createBSP(Editor.selectedObjects[1]);

		var mesh = a.union(b).toMesh();
		mesh.material = Editor.defaultMaterial;

		Editor.addToScene(mesh);
	}, Editor.filePath + "icons/misc/union.png");

	var modifiers = editMenu.addMenu("Modifiers", Editor.filePath + "icons/models/figures.png");

	modifiers.addOption("Simplify", function()
	{
		if(Editor.selectedObjects.length < 1 || Editor.selectedObjects[0].geometry === undefined)
		{
			Editor.alert("Operation needs a object with geometry");
			return;
		}

		var simplifier = new THREE.SimplifyModifier();

		var level = parseFloat(prompt("Simplification level in %")) / 100;

		if(isNaN(level) || level > 100 || level < 0)
		{
			Editor.alert("Level has to be a numeric value");
			return;
		}

		var original = Editor.selectedObjects[0].geometry;

		if(original instanceof THREE.BufferGeometry)
		{
			var vertices = original.getAttribute("position").array.length / 3;
		}
		else
		{
			var vertices = original.vertices.length;
		}


		var geometry = simplifier.modify(original, Math.ceil(vertices * level));
		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		Editor.addToScene(mesh);

		Editor.alert("Reduced from " + vertices + " to " + Math.ceil(vertices * level) + " vertex.");

	}, Editor.filePath + "icons/models/figures.png");

	modifiers.addOption("Subdivide", function()
	{
		if(Editor.selectedObjects.length < 1 || Editor.selectedObjects[0].geometry === undefined)
		{
			Editor.alert("Operation needs a object with geometry");
			return;
		}

		var modifier = new THREE.BufferSubdivisionModifier();
		var geometry = modifier.modify(Editor.selectedObjects[0].geometry);
		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		Editor.addToScene(mesh);
	}, Editor.filePath + "icons/models/figures.png");

	//Compute mesh normals
	editMenu.addOption("Compute normals", function()
	{
		if(Editor.selectedObjects.length < 1)
		{
			Editor.alert("Operation needs a mesh object.");
			return;
		}

		Editor.selectedObjects[0].geometry.computeVertexNormals();

	}, Editor.filePath + "icons/misc/probe.png");

	//Apply tranformation
	editMenu.addOption("Apply transformation", function()
	{
		if(Editor.selectedObjects.length < 1)
		{
			Editor.alert("Operation needs a mesh object.");
			return;
		}

		var obj = Editor.selectedObjects[0];
		obj.geometry.applyMatrix(obj.matrixWorld);
		obj.position.set(0, 0, 0);
		obj.scale.set(1, 1, 1);
		obj.rotation.set(0, 0, 0);

	}, Editor.filePath + "icons/tools/move.png");

	//Merge geometries
	editMenu.addOption("Merge geometries", function()
	{
		if(Editor.selectedObjects.length < 2)
		{
			Editor.alert("Operation needs 2 mesh object.");
			return;
		}

		var geometry = new THREE.Geometry();

		for(var i = 0; i < Editor.selectedObjects.length; i++)
		{	
			var obj = Editor.selectedObjects[i];
			if(obj.geometry !== undefined)
			{
				//Convert to geometry and merge
				if(obj.geometry instanceof THREE.BufferGeometry)
				{
					var converted = new THREE.Geometry();
					converted.fromBufferGeometry(obj.geometry);
					geometry.merge(converted, obj.matrixWorld)
				}
				//Merge geometry
				else
				{
					geometry.merge(obj.geometry, obj.matrixWorld)
				}
			}
		}

		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		mesh.name = "merged";
		Editor.addToScene(mesh);

	}, Editor.filePath + "icons/misc/union.png");

	editMenu.updateInterface();

	//Project
	var projectMenu = new DropdownMenu(this.element);
	projectMenu.setText("Project");
	projectMenu.size.set(100, this.size.y);
	projectMenu.position.set(220,0);

	projectMenu.addOption("Create Scene", function()
	{
		Editor.program.addDefaultScene();
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/add.png");

	projectMenu.addOption("Execute script", function()
	{
		FileSystem.chooseFile(function(files)
		{
			try
			{
				if(files.length > 0)
				{
					var code = FileSystem.readFile(files[0].path);
					var func = Function(code);
					func();
				}
			}
			catch(error)
			{
				Editor.alert("Error: " + error);
			}
		}, ".js");
	}, Editor.filePath + "icons/script/script.png");

	projectMenu.updateInterface();

	//About
	var about = new ButtonMenu(this.element);
	about.setText("About");
	about.size.set(100, this.size.y);
	about.position.set(320, 0);
	about.updateInterface();
	about.setCallback(function()
	{
		var tab = Interface.tab.getTab(AboutTab);
		if(tab === null)
		{
			tab = Interface.tab.addTab(AboutTab, true);
		}

		tab.select();
	});

	//Run
	Interface.run = new ButtonMenu(this.element);
	Interface.run.setText("Run");
	Interface.run.size.set(100, this.size.y);
	Interface.run.position.set(420, 0);
	Interface.run.updateInterface();
	Interface.run.setCallback(function()
	{
		var tab = Interface.tab.getActual();
		if(tab instanceof SceneEditor)
		{
			if(tab.state === SceneEditor.EDITING)
			{
				tab.setState(SceneEditor.TESTING);
			}
			else if(tab.state === SceneEditor.TESTING)
			{
				tab.setState(SceneEditor.EDITING);
			}
		}
	});
}

MainMenu.prototype = Object.create(Element.prototype);

MainMenu.prototype.updateInterface = function()
{
	this.element.style.display = this.visible ? "block" : "none";
};