jQuery(function($) {
	var myappBase = appBase();
		
	$(window).resize(function(){
		three.resize();
		//three.test();
	});
});


var controller = function(content,pass){
	var pass = pass || {};
	var that = {};
	var three = baseThree({id:'canvas-wrapper'});

	var index = function(){
		three.init();
		three.initCamera();
		three.animate();
	};
	pass.index = index;
	
	var mesh2= function(){
		three.init();
		three.initCamera({
			pos:{
				x:-209.99999999999903,
				y:60.00000000000031,
				z:-100
			},
			rota:{
				x:-3.141592653589793,
				y:-0.6000000000000004,
				z:-2.841592653589826
			}
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
	/*model分けるべきかも*/
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
	var that = Planet(content,pass);
	var g = general();
	var display = displayBase();
	var renderer,camera,scene,light,animeHandle;
	var mesh,group;
	var initPosZ  = -400;
	var nowStatus = "initPos";
	var moving = false;
	var targetPlanet,targetDisplay;
	var planetRotationY,planetRotationX,planetMoveX,planetMoveY;
	var init = function(){
		g.setTargetSize(content.id);
		group = new THREE.Object3D();
		mesh  = pass.makePlanet({size:40});//,property:{color: 0xF4A460}});
		mesh.rotation = {x: -0.9, y: 0, z: 0};
		targetPlanet = mesh;
		
		mesh2 = pass.makePlanet({size:10,property:{color: 0x6495ED}});
		mesh2.position.x = -100;
		mesh2.position.y = 50;
		mesh2.position.z = -10;
		
		mesh3 = pass.makePlanet({size:20,property:{color: 0x6666ccD}});
		mesh3.position.x = 150;
		mesh3.position.z = 50;
		
		mesh4 = pass.makePlanet({size:10,property:{color: 0x99ffff}});
		mesh4.position.x = 10;
		mesh4.position.z = -50;
		mesh4.position.y = -100;
		
		mesh5 = pass.makePlanet({size:10,property:{color: 0xcc6666}});
		mesh5.position.x = -20;
		mesh5.position.z = 50;
		mesh5.position.y = 100;
		
		light = new THREE.DirectionalLight(0xffffcc, 1.2);
		light.position = {x: 0.2, y: 0.0, z: -0.2};
		
		scene = new THREE.Scene();
		scene.add(mesh);
		scene.add(mesh2);
		scene.add(mesh3);
		scene.add(mesh4);
		scene.add(mesh5);
		scene.add(light);
		scene.add(group);

		starInit({m:400});
		
		renderer = new THREE.WebGLRenderer({antialias: true});
		initCamera();
		planetEvent();
		document.getElementById(content.id).appendChild(renderer.domElement);
	};
	that.init = init;

	var initCamera = function(args){
		var g = general();
		camera = new THREE.PerspectiveCamera(40, g.winSize.x / g.winSize.y, 1, 1000);
		camera.position.z = initPosZ;
		camera.lookAt(targetPlanet.position);
		if(args){
			camera.position.x = args.pos.x;
			camera.position.y = args.pos.y;
			camera.position.z = args.pos.z;
			camera.rotation.x = args.rota.x;
			camera.rotation.y = args.rota.y;
			camera.rotation.z = args.rota.z;
		}
		scene.add(camera);
		renderer.setSize(g.winSize.x,g.winSize.y);
		renderer.render(scene, camera);
	};
	that.initCamera = initCamera;
	
	var planetEvent = function(){
		var x,y;
		var vector,ray,intersects;
	    var projector = new THREE.Projector();
	    $(renderer.domElement).mousemove(function(e){
	    	if(!moving){
		        intersects = intersectsContainer(e);
		        if(intersects.length > 0){
		        	g.showPointer(renderer.domElement);
		        	if(nowStatus === "initPos"){
				        if(intersects[0].object.position.x === mesh.position.x){
				        	targetDisplay = "mesh";
				        }else if(intersects[0].object.position.x === mesh2.position.x){
			        		console.log("2");
						}else if(intersects[0].object.position.x === mesh3.position.x){
			        		console.log("3");
						}
				        display.planetExample({selector:"#"+targetDisplay,Event:e});
		        	}
		        }else{
		        	intersects = null;
		        	display.planetExampleHide({selector:"#"+targetDisplay});
		        	g.hidePointer(renderer.domElement);
				}
	    	}
	    });
		$(renderer.domElement).click(function(e){
			if(!moving){
				intersects = intersectsContainer(e);
		        if(intersects.length > 0){
		        	if(nowStatus === "initPos"){
				        if(intersects[0].object.position.x === mesh.position.x){
							targetPlanet = mesh;
						}else if(intersects[0].object.position.x === mesh2.position.x){
							targetPlanet = mesh2;
							location.hash = 'mesh2';
						}else if(intersects[0].object.position.x === mesh3.position.x){
							targetPlanet = mesh3;
						}else if(intersects[0].object.position.x === mesh4.position.x){
							targetPlanet = mesh4;
						}
		        	}
		            cameraStatus();
		            planetMove();
					moving = true;
			        renderer.render(scene,camera);
		        }
			}
		});
		var intersectsContainer = function(e){
			x =   (e.clientX / renderer.domElement.width) * 2 - 1;
			y = - (e.clientY / renderer.domElement.height) * 2 + 1;
	        vector = new THREE.Vector3(x, y, 1);
	        projector.unprojectVector(vector, camera);
	        ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
	        return ray.intersectObjects(scene.children);
		} ;
	};
	var cameraStatus = function(){
		switch(camera.position.z){
			case initPosZ:
				nowStatus = "initPos";
				break;
			case -100:
				nowStatus = "closePlanet";
				break;
			default:
				console.log("unset Status!!");
				break;
		}
		console.log(camera.position.z);
		console.log(camera.position.x );
		console.log(camera.position.y );
		console.log(camera.position.z );
		console.log(camera.rotation.x );
		console.log(camera.rotation.y );
		console.log(camera.rotation.z );
	};
	var planetMove = function(){
		switch(targetPlanet){
		case mesh:
			planetMoveX = -0.3;
			planetMoveY = 0;
			planetRotationY = -0.002;
			planetRotationX = 0.0002;
			break;
		case mesh2:
			planetMoveX = -0.7;
			planetMoveY = 0.2;
			planetRotationY = -0.002;
			planetRotationX = 0;
			break;
		case mesh3:
			planetMoveX = 1.2;
			planetMoveY = 0.1;
			planetRotationY = 0.002;
			planetRotationX = 0;
			break;
		case mesh4:
			planetMoveX = 0.25;
			planetMoveY = -0.3;
			planetRotationY = 0.002;
			planetRotationX = 0.001;
			break;
		default:
			console.log("unset move!!");
			break;
		}
		if(nowStatus === "initPos"){
            planetClose();
        }else{
        	planetInitPos();
        }
		display.planetExampleHide({selector:"#"+targetDisplay});
	};
	/*cameraEvent*/
	var planetClose = function(){
		if(camera.position.z == -100){
			cancelAnimationFrame(animeHandle);
			EventCallback(targetDisplay);
			return;
    	}
		camera.position.z += 1;
		camera.position.x += planetMoveX;
		camera.position.y += planetMoveY;
		camera.rotation.y += planetRotationY;
		camera.rotation.x += planetRotationX;
		camera.rotation.z += 0.001;

    	renderer.render(scene, camera);
    	animeHandle = requestAnimationFrame(planetClose);
	};
	var planetInitPos = function(){
		var pos = posDiff();
		if(pos === 0){
			cancelAnimationFrame(animeHandle);
			EventCallback();
			return;
		}
		camera.position.z -= 4;
		camera.position.y += -(planetMoveY *4);
		camera.position.x += -(planetMoveX * 4);
		camera.rotation.y += -(planetRotationY * 4);
		camera.rotation.x += -(planetRotationX * 4);
		camera.rotation.z -= 0.004;
		renderer.render(scene, camera);
		animeHandle = requestAnimationFrame(planetInitPos);
	};
	var EventCallback = function(args){
		moving = false;
		cameraStatus();
		console.log("finish Event:"+nowStatus);
		if(args){
			display.loadEvent();
		}
	};
	/*set Star*/
	var starInit = function(args){
		var material = new THREE.MeshLambertMaterial({color: 0xFFFFCC});
		var wide = 0;
		var m = args.m;
		var geometry,mesh;
		for ( var i = 0; i < m; i ++ ) {
			wide = Math.random() * 2;
			geometry = new THREE.SphereGeometry(wide, 10, 10);
			mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = 400 - Math.random() * 800;
			mesh.position.y = 400 - Math.random() * 800;
			mesh.position.z = 150 + Math.random() * 1000;
			group.add(mesh);
		}
	};
	/*animation*/
	var animate = function(){
		animeRotate();
	};
	that.animate = animate;
	
	var posDiff = function(){
		var now = initPosZ - camera.position.z;
		return now;
	};
	var animeRotate = function(){
		mesh.rotation.x += 0.00015;
		mesh.rotation.z += 0.00015;
		group.rotation.z += 0.00005;
		renderer.render(scene, camera);
		requestAnimationFrame(animeRotate);
	};
	var resize = function(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		console.log("resize");
	};
	that.resize = resize;
	
	var test = function(){
		width  = $("#canvas-wrapper").width();         
		height = $("#canvas-wrapper").height();
		console.log(width+" "+height);
	};
	that.test = test;
	
	return that;
};

var Planet = function(content,pass){
	var pass = pass || {};
	var canvasTexture = function(args){
		var canvas = document.createElement( 'canvas' );
		canvas.width = args.w;
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
		args.property = args.property || {map:canvasTexture({w:300,h:300})};
		var divisions = 3;
		var material = new THREE.MeshLambertMaterial(args.property);
		var geometry = new THREE.SphereGeometry(args.size, 12, 12);
		var smooth   = THREE.GeometryUtils.clone( geometry );
		smooth.mergeVertices();
		var modifier = new THREE.SubdivisionModifier(divisions);
		modifier.modify( smooth );
		mesh = new THREE.Mesh(smooth, material);
		return mesh;
	};
	pass.makePlanet = makePlanet;
	
	var testPlanet = function(){
		var geometry = new THREE.CubeGeometry(50, 50, 50);
		var material = new THREE.MeshLambertMaterial({color: 0x0000aa});
		var mesh     = new THREE.Mesh(geometry, material);
		return mesh;
	};
	pass.testPlanet = testPlanet;
	
	return pass;
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