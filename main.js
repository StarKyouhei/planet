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
	var init = function(){
		g.setTargetSize(content.id);
		group = new THREE.Object3D();
		mesh  = pass.makePlanet({size:40});
		testMesh = pass.testPlanet();
		testMesh.position.x  += 100;
		group.add( mesh );
		group.add( testMesh );
		
		
		light = new THREE.DirectionalLight(0xffffcc, 1.4);
		light.position = {x: 0.2, y: 0.2, z: -0.2};

		scene = new THREE.Scene();
		//scene.add(mesh);
		scene.add(light);
		scene.add(group);
		
		
		starInit();
		
		renderer = new THREE.WebGLRenderer({antialias: true});
		initCamera();
		document.getElementById(content.id).appendChild(renderer.domElement);
		//console.log("init");
	};
	that.init = init;
	
	var starInit = function(){
		var material = new THREE.MeshLambertMaterial({color: 0xFFFFCC});
		var wide = 0;
		for ( var i = 0; i < 400; i ++ ) {
			wide = Math.random() * 3;
			var geometry = new THREE.SphereGeometry(wide, 10, 10);
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = 400 - Math.random() * 800;
			mesh.position.y = 400 - Math.random() * 800;
			mesh.position.z = 150 + Math.random() * 1000;
			group.add( mesh );
		}
	};
	var initCamera = function(){
		g = general();
		camera = new THREE.PerspectiveCamera(40, g.winSize.x / g.winSize.y, 1, 1000);
		camera.position.z = -400;
		camera.lookAt(mesh.position);
		scene.add(camera);
		renderer.setSize(g.winSize.x,g.winSize.y);
		renderer.render(scene, camera);
	};
	
	var animate = function(){
		animeRotate();
	};
	that.animate = animate;
	
	var animeRotate = function(){
		group.rotation.z += 0.00005;
		renderer.render(scene, camera);
		animeHandle = requestAnimationFrame(animeRotate);
		//console.log("animate");
	};
	
	var resize = function(){
		initCamera();
		//cancelAnimationFrame(animeHandle);
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
		var geometry = new THREE.SphereGeometry(args.size, 12, 12);
		var smooth = THREE.GeometryUtils.clone( geometry );
			smooth.mergeVertices();
		var modifier = new THREE.SubdivisionModifier(divisions);
			modifier.modify( smooth );
		var material = new THREE.MeshLambertMaterial({color: 0xF4A460});
		mesh = new THREE.Mesh(smooth, material);
		return mesh;
	};
	pass.makePlanet = makePlanet;
	
	var testPlanet = function(){
		var geometry = new THREE.CubeGeometry(50, 50, 50); // 立方体作成
		var material = new THREE.MeshLambertMaterial({color: 0x0000aa}); // 材質作成
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