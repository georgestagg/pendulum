var scene, camera, renderer,controls;
var geometry, material, particles;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var stats;
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;
var fps = 0;
var iters = 1000;
initSinglePendulum();
init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 20;
    textureLoader = new THREE.TextureLoader();

    //make particles for the masses
    geometry = new THREE.Geometry();
    var vertex = new THREE.Vector3();
    vertex.x = 0.0;
    vertex.y = 0.0;
    vertex.z = 0.0;
    geometry.vertices.push( vertex );

    color = [1,1,1];
    material = new THREE.PointsMaterial( { size: 1, map:textureLoader.load("particle.png"),blending: THREE.AdditiveBlending} );
    particles = new THREE.Points( geometry, material );
    scene.add( particles );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.minDistance = 0;
        controls.maxDistance = 100;



    window.addEventListener( 'resize', onWindowResize, false );
    setInterval(function(){
        fps = (1000/frameTime).toFixed(1);
        E1 = getSinglePendulumE();
        V1 = getSinglePendulumV();
        replaceHtml("info", 'FPS: '+ fps + '<br>Iterations/s: '+ iters + '<br>Energy: '+ Math.round(E1*100)/100 + '<br>M1 velocity: ' +  Math.round(V1*100)/100);
        
    },500);
}

function replaceHtml(el, html) {
    var oldEl = (typeof el === "string" ? document.getElementById(el) : el);
    var newEl = document.createElement(oldEl.nodeName);
    // Preserve the element's id and class (other properties are lost)
    newEl.id = oldEl.id;
    newEl.className = oldEl.className;
    // Replace the old with the new
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    /* Since we just removed the old element from the DOM, return a reference
    to the new element, which can be used to restore variable references. */
    return newEl;
};

function animate() {
    requestAnimationFrame( animate );
    for (var i = 0; i < iters; i++) {
        updateSinglePendulum();
    };
    P1 = getSinglePendulumP1();
    scene.children[0].position.x = P1[0];
    scene.children[0].position.y = P1[2];
    scene.children[0].position.z = -P1[1];
    
    var thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;


    
    //camera.position.x = 50*Math.sin(time*mouseX*0.005);
    //camera.position.z = 50*Math.cos(time*mouseY*0.005);

    //camera.lookAt( scene.position );
    controls.update();
    renderer.render( scene, camera );

}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}