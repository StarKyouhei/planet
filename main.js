jQuery(function($) {
	appBase();
		
	$(window).resize(function(){
		var three = mainThree();
		three.resize();
		//three.test();
	});
});

var controller = function(content,pass){
	var pass = pass || {};
	var that = {};
	var three = mainThree({id:'canvas-wrapper'});

	var index = function(){
		three.init();
		three.animate();
	};
	pass.index = index;
	
	var mesh2= function(){
		three.init();
		three.initCamera({
			pos:{x:-209.99999999999903,y:60.00000000000031,z:-100},
			rota:{x:-3.141592653589793,y:-0.6000000000000004,z:-2.841592653589826}
		});
		three.animate();
	};
	pass.mesh2 = mesh2;
	
	var test = function(){
		alert("test");
	};
	pass.test = test;
	
	return that;
};

var model = function(content,pass){
	var pass = pass || {};
	var that = {};
	
	var indexModel = function(){

	};
	pass.indexModel = indexModel;
	
	var planet1Model = function(){
		
	};
	pass.planet1Model = planet1Model;
	
	return that;
};


var appBase = function(content,pass){
	var pass = pass || {};
	var that = controller(content,pass);
	    that = model(content,pass);
	
	var url = function(){
		var after = $(location).attr('hash');
		if(after == ""){
			return "index";
		}else{
			var hash = after.replace("#","");
			return hash;
		}
	};
	
	var call = function(){
		//try{
			var model = url() + "Model";
			(pass[url()])();
			try{
				(pass[model])();
			}catch(e){}
		/*}catch(e){
			console.log(e);
			file:///Library/WebServer/Documents/test/jqueryload/index.html
		}*/
	};
	call();
	
	return that;
};

var baseThree = function(content,pass){
	var pass = pass || {};
	var that = {};
	pass.g = general();
	pass.planetGroup = new Array();
	pass.moving = false;
	pass.scene =  new THREE.Scene();
	pass.camera = new THREE.PerspectiveCamera(40, pass.g.winSize.x / pass.g.winSize.y, 1, 1000);
	pass.renderer = new THREE.WebGLRenderer({antialias: true});

	var initCamera = function(args){
		var cam = pass.camera;
		cam.position.z = -400;
		cam.lookAt({x:0,y:0,z:0});
		if(args){
			cam.position.x = args.pos.x;
			cam.position.y = args.pos.y;
			cam.position.z = args.pos.z;
			cam.rotation.x = args.rota.x;
			cam.rotation.y = args.rota.y;
			cam.rotation.z = args.rota.z;
		}
		pass.scene.add(cam);
		pass.renderer.setSize(pass.g.winSize.x,pass.g.winSize.y);
		pass.renderer.render(pass.scene, cam);
	};
	that.initCamera = initCamera;
	
	var cameraStatus = function(){
		switch(pass.camera.position.z){
			case -400:
				nowStatus = "initPos";
				return nowStatus;
			case -100:
				nowStatus = "closePlanet";
				return nowStatus;
			default:
				console.log("unset Status!!");
				return;
		}
	};
	pass.cameraStatus = cameraStatus;
	
	var setTargetPlanet = function(target){
		targetPlanet = target;
	};
	pass.setTargetPlanet = setTargetPlanet;
	
	var getTargetPlanet = function(){
		return targetPlanet;
	};
	pass.getTargetPlanet = getTargetPlanet;
	
	var setTargetDisplay = function(target){
		targetDisplay = target;
	};
	pass.setTargetDisplay = setTargetDisplay;
	
	var getTargetDisplay = function(){
		return targetDisplay;
	};
	pass.getTargetDisplay = getTargetDisplay;
	
	return that;
};

var moveThree = function(content,pass){
	var pass = pass || {};
	var that = baseThree(content,pass);
	var RotationY,RotationX,MoveX,MoveY;
	var animeHandle;
	var planetMove = function(){
		var display = displayBase();
		switch(pass.getTargetPlanet()){
		case pass.planetGroup[0]:
			MoveX = -0.3;
			MoveY = 0;
			RotationY = -0.002;
			RotationX = 0.0002;
			break;
		case pass.planetGroup[1]:
			MoveX = -0.7;
			MoveY = 0.2;
			RotationY = -0.002;
			RotationX = 0;
			break;
		case pass.planetGroup[2]:
			MoveX = 1.2;
			MoveY = 0.1;
			RotationY = 0.002;
			RotationX = 0;
			break;
		case pass.planetGroup[3]:
			MoveX = 0.25;
			MoveY = -0.3;
			RotationY = 0.002;
			RotationX = 0.001;
			break;
		default:
			console.log("unset move!!");
			break;
		}
		(pass.cameraStatus() === "initPos") ? planetClose() : planetInitPos();
		display.planetExampleHide({selector:"#"+pass.getTargetDisplay()});
		debugCameraPos(nowStatus,pass.camera);
	};
	pass.planetMove = planetMove;
	
	var planetClose = function(){
		var camera = pass.camera;
		if(camera.position.z == -100) return EventCallback(animeHandle);
		camera.position.z += 1;
		camera.position.x += MoveX;
		camera.position.y += MoveY;
		camera.rotation.y += RotationY;
		camera.rotation.x += RotationX;
		camera.rotation.z += 0.001;
		render(planetClose);
	};
	
	var planetInitPos = function(){
		var camera = pass.camera;
		var pos = -400 - camera.position.z;
		if(!pos) return EventCallback(animeHandle);
		camera.position.z -= 4;
		camera.position.y += -(MoveY *4);
		camera.position.x += -(MoveX * 4);
		camera.rotation.y += -(RotationY * 4);
		camera.rotation.x += -(RotationX * 4);
		camera.rotation.z -= 0.004;
		render(planetInitPos);
	};
	
	var render = function(args){
		var ren = pass.renderer,sce = pass.scene,cam = pass.camera;
		ren.render(sce,cam);
		animeHandle = requestAnimationFrame(args);
	};
	
	var EventCallback = function(args){
		pass.moving = false;
		console.log("finish Event:"+pass.cameraStatus());
		cancelAnimationFrame(animeHandle);
		if(args){var display = displayBase();display.loadEvent();}
	};
	
	return that;
};

var eventThree = function(content,pass){
	var pass = pass || {};
	var that = moveThree(content,pass);
	var planetEvent = function(){
		var display = displayBase();
		var intersects;
	    var projector = new THREE.Projector();
	    $(pass.renderer.domElement).mousemove(function(e){
	    	if(!pass.moving){
		        intersects = intersectsContainer(e);
		        if(intersects.length > 0){
		        	pass.g.showPointer(pass.renderer.domElement);
		        	if(nowStatus === "initPos"){
				        if(intersects[0].object.position.x === pass.planetGroup[0].position.x){
				        	pass.setTargetDisplay("mesh");
				        }else if(intersects[0].object.position.x === pass.planetGroup[1].position.x){
			        		console.log("2");
						}else if(intersects[0].object.position.x === pass.planetGroup[2].position.x){
			        		console.log("3");
						}
				        display.planetExample({selector:"#"+pass.getTargetDisplay(),Event:e});
		        	}
		        }else{
		        	intersects = null;
		        	display.planetExampleHide({selector:"#"+pass.getTargetDisplay()});
		        	pass.g.hidePointer(pass.renderer.domElement);
				}
	    	}
	    });
		$(pass.renderer.domElement).click(function(e){
			if(!pass.moving){
				intersects = intersectsContainer(e);
		        if(intersects.length > 0){
		        	if(nowStatus === "initPos"){
				        if(intersects[0].object.position.x ===  pass.planetGroup[0].position.x){
							pass.setTargetPlanet(pass.planetGroup[0]);
						}else if(intersects[0].object.position.x === pass.planetGroup[1].position.x){
							pass.setTargetPlanet(pass.planetGroup[1]);
							location.hash = 'mesh2';
						}else if(intersects[0].object.position.x === pass.planetGroup[2].position.x){
							pass.setTargetPlanet(pass.planetGroup[2]);
						}else if(intersects[0].object.position.x === pass.planetGroup[3].position.x){
							pass.setTargetPlanet(pass.planetGroup[3]);
						}
		        	}
		            pass.cameraStatus();
		            pass.planetMove();
					pass.moving = true;
			        pass.renderer.render(pass.scene,pass.camera);
		        }
			}
		});
		var intersectsContainer = function(e){
			var x =   (e.clientX / pass.renderer.domElement.width) * 2 - 1;
			var y = - (e.clientY / pass.renderer.domElement.height) * 2 + 1;
			var vector = new THREE.Vector3(x, y, 1);
	        projector.unprojectVector(vector, pass.camera);
	        var ray = new THREE.Ray(pass.camera.position, vector.subSelf(pass.camera.position).normalize());
	        return ray.intersectObjects(pass.planetGroup);
		};
	};
	pass.planetEvent = planetEvent;

	return that;
};

var mainThree = function(content,pass){
	var pass = pass || {};
	var that = eventThree(content,pass);
	var group = new THREE.Object3D();
	var init = function(){
		pass.g.setTargetSize(content.id);
		
		makePlanet({size:40,pos:{x:0,y:0,z:0},rote:{x: -0.9, y: 0, z: 0}});//,property:{color: 0xF4A460}});
		makePlanet({size:10,property:{color:0x6495ED},pos:{x:-100,y:50,z:-10}});
		makePlanet({size:20,property:{color:0x6666cc},pos:{x:150 ,y:0,z:50}});
		makePlanet({size:10,property:{color:0x99ffff},pos:{x:10  ,y:-100,z:-50}});
		pass.setTargetPlanet(pass.planetGroup[0]);
		pass.setTargetDisplay(null);
		var light = new THREE.DirectionalLight(0xffffcc, 1.2);
		light.position = {x: 0.2, y: 0.0, z: -0.2};
		
		pass.scene.add(light);

		starInit;
		pass.scene.add(group);

		that.initCamera();
		pass.planetEvent();
		pass.cameraStatus();
		document.getElementById(content.id).appendChild(pass.renderer.domElement);
	};
	that.init = init;
	
	var starInit = (function(){
		var material = new THREE.MeshLambertMaterial({color: 0xFFFFCC});
		var wide = 0;
		var geometry,mesh;
		for ( var i = 0; i < 400; i ++ ) {
			wide = Math.random() * 2;
			geometry = new THREE.SphereGeometry(wide, 10, 10);
			mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = 400 - Math.random() * 800;
			mesh.position.y = 400 - Math.random() * 800;
			mesh.position.z = 150 + Math.random() * 1000;
			group.add(mesh);
		}
	})();
	
	var animate = function(){
		animeRotate();
	};
	that.animate = animate;
	
	var animeRotate = function(){
		pass.planetGroup[0].rotation.x += 0.00015;
		pass.planetGroup[0].rotation.z += 0.00015;
		group.rotation.z += 0.00005;
		pass.renderer.render(pass.scene, pass.camera);
		requestAnimationFrame(animeRotate);
	};
	var resize = function(){
		var w = window;
		pass.camera.aspect = w.innerWidth / w.innerHeight;
		pass.camera.updateProjectionMatrix();
		pass.renderer.setSize( w.innerWidth, w.innerHeight );
		console.log("resize");
	};
	that.resize = resize;
	
	var canvasTexture = function(args){
		var d = document,tag="canvas";
		var canvas = d.createElement(tag);
		canvas.width  = args.w;
		canvas.height = args.h;
		var context = canvas.getContext( '2d' );
		var gradient = context.createLinearGradient(0,0,0,200);
		gradient.addColorStop( 0, 'rgba(204,153,102,1)' );
		gradient.addColorStop( 0.1, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.2, 'rgba(204,153,102,1)' );
		gradient.addColorStop( 0.4, 'rgba(204,153,102,1)' );
		gradient.addColorStop( 0.5, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.6, 'rgba(204,153,102,1)' );
		gradient.addColorStop( 0.7, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.8, 'rgba(204,153,102,1)' );
		gradient.addColorStop( 0.9, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 1, 'rgba(204,153,102,1)' );
		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );
		var shadowTexture = new THREE.Texture( canvas );
		shadowTexture.needsUpdate = true;
		return shadowTexture;
	};

	var makePlanet = function(args){
		args.property = args.property || {map:canvasTexture({w:280,h:280})};
		args.rote = args.rote || null;
		var divisions = 3;
		var material = new THREE.MeshLambertMaterial(args.property);
		var geometry = new THREE.SphereGeometry(args.size, 12, 12);
		var smooth   = THREE.GeometryUtils.clone(geometry);
		smooth.mergeVertices();
		var modifier = new THREE.SubdivisionModifier(divisions);
		modifier.modify(smooth);
		mesh = new THREE.Mesh(smooth, material);
		mesh.position.x = args.pos.x;
		mesh.position.y = args.pos.y;
		mesh.position.z = args.pos.z;
		if(args.rote){
			mesh.rotation.x = args.rote.x;
			mesh.rotation.y = args.rote.y;
			mesh.rotation.z = args.rote.z;
		}
		pass.planetGroup[pass.planetGroup.length] = mesh;
		pass.scene.add(mesh);
	};
	
	var test = function(){
		width  = $("#canvas-wrapper").width();         
		height = $("#canvas-wrapper").height();
		console.log(width+" "+height);
	};
	that.test = test;
	
	return that;
};

var debugCameraPos = function(now,args){
	now = now || null;
	console.log("finish status:"+now);
	console.log(args.position.z);
	console.log(args.position.z);
	console.log(args.position.x );
	console.log(args.position.y );
	console.log(args.position.z );
	console.log(args.rotation.x );
	console.log(args.rotation.y );
	console.log(args.rotation.z );
};
var displayBase = function(){
	that = {};
	var planetExample = function(args){
		if($(args.selector).css("display") == "none"){
    		$(args.selector).fadeIn("slow");
        	$(args.selector).css({top:args.Event.clientY - 100,left:args.Event.clientX-50});
    	}
	};
	that.planetExample = planetExample;
	
	var planetExampleHide = function(args){
    	if($(args.selector).css("display") != "none"){
    		$(args.selector).fadeOut(1000);
    	}
	};
	that.planetExampleHide = planetExampleHide;
	
	var loadEvent = function(){
		console.log("display loadEvent");
	};
	that.loadEvent = loadEvent;
	
	return that;
};
var general = function(){
	var that ={};
	var winSize = {
		x:$(window).width(),
		y:$(window).height()
	};
	that.winSize = winSize;
	
	var showPointer = function(args){
		$(args).css('cursor', 'pointer');
	};
	that.showPointer = showPointer;
	
	var hidePointer = function(args){
		$(args).css('cursor', 'default');
	}
	that.hidePointer = hidePointer;
	
	var setTargetSize = function(args){
		var targetId = "#"+args.id;
		args.x = args.x || this.winSize.x;
		args.y = args.y || this.winSize.y;
		$(targetId).attr({
			width:args.x,
			height:args.y
		});
	};
	that.setTargetSize = setTargetSize;
	
	return that;
};