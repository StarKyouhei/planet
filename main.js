jQuery(function($) {
	var three = baseThree({id:'canvas-wrapper'});
		three.init();
		three.animate();
	$(window).resize(function(){
		three.resize();
		//three.test();
	});
});

var baseThree = function(content,pass){
	var pass = pass || {};
	var that = Planet(content,pass);
	var g = general();
	var renderer,camera,scene,light,animeHandle;
	var mesh,group;
	var initPosZ = -400;
	var nowStatus = "initPos";
	var moving = false;
	var targetPlanet;
	var planetRotationY = -0.002,planetMoveX,planetMoveY;
	var init = function(){
		g.setTargetSize(content.id);
		group = new THREE.Object3D();
		mesh  = pass.makePlanet({size:40,property:{color: 0xF4A460}});
		targetPlanet = mesh;
		
		mesh2 = pass.makePlanet({size:10,property:{color: 0x6495ED}});
		mesh2.position.x = -100;
		mesh2.position.y = 50;
		mesh2.position.z = -10;
		testMesh = pass.testPlanet();
		testMesh.position.x  += 100;
		group.add( testMesh );
		
		light = new THREE.DirectionalLight(0xffffcc, 1.4);
		light.position = {x: 0.2, y: 0.2, z: -0.2};
		
		scene = new THREE.Scene();
		scene.add(mesh);
		scene.add(mesh2);
		scene.add(light);
		scene.add(group);
		starInit({m:400});
		
		renderer = new THREE.WebGLRenderer({antialias: true});
		initCamera();
		planetEvent([mesh,mesh2]);
		document.getElementById(content.id).appendChild(renderer.domElement);
	};
	that.init = init;
	
	var initCamera = function(){
		var g = general();
		camera = new THREE.PerspectiveCamera(40, g.winSize.x / g.winSize.y, 1, 1000);
		camera.position.z = initPosZ;
		camera.lookAt(targetPlanet.position);
		scene.add(camera);
		renderer.setSize(g.winSize.x,g.winSize.y);
		renderer.render(scene, camera);
	};
	
	var planetEvent = function(args){
		var meshArray = args;
		var x,y;
		var vector,ray,intersects;
		var arrLenght = meshArray.lenght;
		for(var i = 0; i < arrLenght; i++){
			meshArray[i].position.x = 2 * i;
		    meshArray[i].position.z = -i;
		}
	    var projector = new THREE.Projector();
		$(renderer.domElement).click(function(e){
			if(!moving){
				x =   (e.clientX / renderer.domElement.width) * 2 - 1;
				y = - (e.clientY / renderer.domElement.height) * 2 + 1;
		        vector = new THREE.Vector3(x, y, 1);
		        projector.unprojectVector(vector, camera);
		        ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
		        intersects = ray.intersectObjects(meshArray);
		        console.log("interpos:"+intersects[ 0 ].object.position.x);
		        if(intersects[0].object.position.x === mesh.position.x){
					targetPlanet = mesh;
				}else if(intersects[0].object.position.x === mesh2.position.x){
					targetPlanet = mesh2;
				}
	            cameraStatus();
	            planetMove();
				moving = true;
	            if(nowStatus === "initPos"){
		            planetClose();
	            }else{
	            	planetInitPos();
	            }
		        renderer.render(scene,camera);
			}
		});
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
		console.log("cameraP.x:"+camera.position.x);
		console.log("cameraP.y:"+camera.position.y);
		console.log("cameraP.z:"+camera.position.z);
		console.log("cameraR.x:"+camera.rotation.x);
		console.log("cameraR.y:"+camera.rotation.y);
		console.log("cameraR.z:"+camera.rotation.z);
	};
	var planetMove = function(){
		switch(targetPlanet){
		case mesh:
			planetMoveX = 0;
			planetMoveY = 0;
			break;
		case mesh2:
			planetMoveX = -0.4;
			planetMoveY = 0.1;
			break;
		default:
			console.log("unset move!!");
			break;
		}
	};
	
	/*cameraEvent*/
	var planetClose = function(){
		if(camera.position.z == -100){
			cancelAnimationFrame(animeHandle);
			EventCallback();
			return;
    	}
		camera.position.z += 1;
		camera.position.x += planetMoveX;
		camera.position.y += planetMoveY;
		camera.rotation.y += planetRotationY;
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
		renderer.render(scene, camera);
		animeHandle = requestAnimationFrame(planetInitPos);
	};
	var EventCallback = function(){
		moving = false;
		cameraStatus();
		console.log("finish Event:"+nowStatus)
	};
	/*set Star*/
	var starInit = function(args){
		var material = new THREE.MeshLambertMaterial({color: 0xFFFFCC});
		var wide = 0;
		var m = args.m;
		var geometry,mesh;
		for ( var i = 0; i < m; i ++ ) {
			wide = Math.random() * 3;
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
		group.rotation.z += 0.00005;
		renderer.render(scene, camera);
		requestAnimationFrame(animeRotate);
	};
	var resize = function(){
		initCamera();
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
	var makePlanet = function(args){
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

var general = function(){
	var that ={};
	var winSize = {
		x:$(window).width(),
		y:$(window).height()
	};
	that.winSize = winSize;
	
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