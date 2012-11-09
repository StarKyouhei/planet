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
	var mesh;
	var init = function(){
		g.setTargetSize(content.id);
		mesh = pass.makePlanet({size:60});
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(40, g.winSize.x / g.winSize.y, 1, 1000);
		camera.position.z = -400;
		camera.lookAt(mesh.position);
		light    = new THREE.DirectionalLight(0xffffff, 1.5);
		light.position = {x: 0.2, y: 0.2, z: -0.2};
		
		scene.add(mesh);
		scene.add(light);
		scene.add(camera);
		
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(g.winSize.x,g.winSize.y);
		document.getElementById(content.id).appendChild(renderer.domElement);
		renderer.render(scene, camera);
		console.log("init");
	};
	that.init = init;
	
	var resize = function(){
		var g = general();
		camera = new THREE.PerspectiveCamera(40, g.winSize.x / g.winSize.y, 1, 1000);
		camera.position.z = -400;
		camera.lookAt(mesh.position);
		scene.add(camera);
		renderer.setSize(g.winSize.x,g.winSize.y);
		renderer.render(scene, camera);
		//cancelAnimationFrame(animeHandle);

		console.log("resize");
	};
	that.resize = resize;
	
	var animate = function(){
		animeRotate();
	};
	that.animate = animate;
	var animeRotate = function(){
		mesh.rotation.y += 0.01;
		renderer.render(scene, camera);
		animeHandle = requestAnimationFrame(animeRotate);
		//console.log("animate");
	};
	
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
		var geometry = new THREE.SphereGeometry(args.size, 20, 20);
		var material = new THREE.MeshLambertMaterial({color: 0xF4A460});
		mesh = new THREE.Mesh(geometry, material);
		return mesh;
	};
	pass.makePlanet = makePlanet;
	
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