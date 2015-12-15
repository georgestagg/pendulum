var scene, camera, renderer,controls;
var geometry, geometryline,geometryline2, particles;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var stats;
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;
var fps = 0;
var trailj = params.MAX_LINE_POINTS, traili = 0;
var trailj2 = params.MAX_LINE_POINTS2, traili2 = 0;
var color1ctrl,color2ctrl,linematerial,linematerial2
initDoublePendulum();
init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 30;
    textureLoader = new THREE.TextureLoader();

    //make particles for the masses
    geometry = new THREE.Geometry();
    var vertex = new THREE.Vector3();
    vertex.x = 0.0;
    vertex.y = 0.0;
    vertex.z = 0.0;
    geometry.vertices.push( vertex );
    vertex = new THREE.Vector3();
    vertex.x = 1.0;
    vertex.y = 2.0;
    vertex.z = 3.0;
    geometry.vertices.push( vertex );

    //make vertices for the line
    var geometryline = new THREE.Geometry();
    P1 = getDoublePendulumP1();
    for (var i = 0; i <= params.MAX_LINE_POINTS; i++) {
        geometryline.vertices.push(new THREE.Vector3(P1[0], P1[2], -P1[1]));
    };
    var geometryline2 = new THREE.Geometry();
    for (var i = 0; i <= params.MAX_LINE_POINTS; i++) {
        geometryline2.vertices.push(new THREE.Vector3(P1[0], P1[2], -P1[1]));
    };
    //make vertices for the line
    var geometryline3 = new THREE.Geometry();
    P2 = getDoublePendulumP2();
    for (var i = 0; i <= params.MAX_LINE_POINTS; i++) {
        geometryline3.vertices.push(new THREE.Vector3(P2[0], P2[2], -P2[1]));
    };
    var geometryline4 = new THREE.Geometry();
    for (var i = 0; i <= params.MAX_LINE_POINTS; i++) {
        geometryline4.vertices.push(new THREE.Vector3(P2[0], P2[2], -P2[1]));
    };

    linematerial = new THREE.LineBasicMaterial({color: new THREE.Color(params.color1[0],params.color1[1],params.color1[2]),linewidth: 2});
    linematerial2 = new THREE.LineBasicMaterial({color:new THREE.Color(params.color2[0],params.color2[1],params.color2[2]),linewidth: 2});
    material = new THREE.PointsMaterial( { size: 0.8,transparent: true,map: textureLoader.load("particle.png"),blending: THREE.AdditiveBlending} );
    particles = new THREE.Points( geometry, material );
    line  = new THREE.Line(geometryline, linematerial);
    line2 = new THREE.Line(geometryline2, linematerial);
    line3 = new THREE.Line(geometryline3, linematerial2);
    line4 = new THREE.Line(geometryline4, linematerial2);
    scene.add(particles);
    scene.add(line);
    scene.add(line2);
    scene.add(line3);
    scene.add(line4);


    var stargeometry  = new THREE.SphereGeometry(90, 32, 32)
    var starmaterial  = new THREE.MeshBasicMaterial()
    starmaterial.map   = textureLoader.load("starfield.png")
    starmaterial.side  = THREE.BackSide
    var starmesh  = new THREE.Mesh(stargeometry, starmaterial)
    scene.add(starmesh)

    //GUI
    var gui = new dat.GUI();
    var f1 = gui.addFolder('Numerical Integration Settings');
    f1.add(params, 'iters',10, 5000).step(10);
    f1.add(params, 'dt',0.00001, 0.0005);

    gui.add(params, 'g',-10,20).step(0.5);
    gui.add(params, 'mass1',0.1,10).step(0.5);
    gui.add(params, 'mass2',0.1,10).step(0.5);
    gui.add(params, 'length1',0.5,20).step(0.5);
    gui.add(params, 'length2',0.5,20).step(0.5);

    color1ctrl = gui.addColor(params, 'color1');
    color2ctrl = gui.addColor(params, 'color2');

    color1ctrl.onChange(function(value) {
        if(params.color1[0] == '#'){
            linematerial.color.setHex(parseInt('0x'+params.color1.substr(1,6)));
        } else {
            linematerial.color.setRGB(params.color1[0]/255.0,params.color1[1]/255.0,params.color1[2]/255.0);
        }
    });

    color2ctrl.onChange(function(value) {
        if(params.color2[0] == '#'){
            linematerial2.color.setHex(parseInt('0x'+params.color2.substr(1,6)));
        } else {
            linematerial2.color.setRGB(params.color2[0]/255.0,params.color2[1]/255.0,params.color2[2]/255.0);
        }
    });

    var f2 = gui.addFolder('Edit Initial Condition');
    f2.add(params, 'inittheta1',0,180);
    f2.add(params, 'inittheta2',0,180);
    f2.add(params, 'initphi1',0,360);
    f2.add(params, 'initphi2',0,360);
    f2.add(params, 'initvtheta1',-5.0,5.0).step(0.1);
    f2.add(params, 'initvtheta2',-5.0,5.0).step(0.1);
    f2.add(params, 'initvphi1',-5.0,5.0).step(0.1);
    f2.add(params, 'initvphi2',-5.0,5.0).step(0.1);
    f2.add(params, 'Go');

    



    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    document.body.appendChild( renderer.domElement );


    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var renderModel = new THREE.RenderPass( scene, camera );
    var effectBloom = new THREE.BloomPass( 2.0 );
    var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
    var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );
    effectCopy.renderToScreen = true;

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( renderModel );
    composer.addPass( effectFXAA );
    composer.addPass( effectBloom );
    composer.addPass( effectCopy );

    window.addEventListener( 'resize', onWindowResize, false );
    /*setInterval(function(){
        fps = (1000/frameTime).toFixed(1);
        E1 = getDoublePendulumE();
        V1 = getDoublePendulumV1();
        V2 = getDoublePendulumV2();
        replaceHtml("info", 'FPS: '+ fps + '<br>Iterations/frame: '+ Math.round(params.iters) +'<br>Energy: ' +  Math.round(E1*100)/100 + '<br>M1 velocity: ' +  Math.round(V1*100)/100 + '<br>M2 velocity: ' +  Math.round(V2*100)/100);
        
    },500);*/
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
    for (var i = 0; i < params.iters; i++) {
        updateDoublePendulum();
    };
    P1 = getDoublePendulumP1();
    P2 = getDoublePendulumP2();
    scene.children[0].geometry.vertices[0].x =  P1[0];
    scene.children[0].geometry.vertices[0].y =  P1[2];
    scene.children[0].geometry.vertices[0].z = -P1[1];
    scene.children[0].geometry.vertices[1].x =  P2[0];
    scene.children[0].geometry.vertices[1].y =  P2[2];
    scene.children[0].geometry.vertices[1].z = -P2[1];

    //mass1 line
    for (var i = traili++; i <= params.MAX_LINE_POINTS; i++) {
        scene.children[1].geometry.vertices[i].x = P1[0];
        scene.children[1].geometry.vertices[i].y = P1[2];
        scene.children[1].geometry.vertices[i].z = -P1[1];
    };

    for (var i = 0; i < Math.max(0,traili-params.MAX_LINE_POINTS) ; i++) {
        scene.children[1].geometry.vertices[i].x = scene.children[1].geometry.vertices[traili-params.MAX_LINE_POINTS].x;
        scene.children[1].geometry.vertices[i].y = scene.children[1].geometry.vertices[traili-params.MAX_LINE_POINTS].y;
        scene.children[1].geometry.vertices[i].z = scene.children[1].geometry.vertices[traili-params.MAX_LINE_POINTS].z;
    };

    for (var i = trailj++; i <= params.MAX_LINE_POINTS; i++) {
        scene.children[2].geometry.vertices[i].x = P1[0];
        scene.children[2].geometry.vertices[i].y = P1[2];
        scene.children[2].geometry.vertices[i].z = -P1[1];
    };

    for (var i = 0; i < Math.max(0,trailj-params.MAX_LINE_POINTS) ; i++) {
        scene.children[2].geometry.vertices[i].x = scene.children[2].geometry.vertices[trailj-params.MAX_LINE_POINTS].x;
        scene.children[2].geometry.vertices[i].y = scene.children[2].geometry.vertices[trailj-params.MAX_LINE_POINTS].y;
        scene.children[2].geometry.vertices[i].z = scene.children[2].geometry.vertices[trailj-params.MAX_LINE_POINTS].z;
    };

    //mass2 line
    for (var i = traili2++; i <= params.MAX_LINE_POINTS; i++) {
        scene.children[3].geometry.vertices[i].x = P2[0];
        scene.children[3].geometry.vertices[i].y = P2[2];
        scene.children[3].geometry.vertices[i].z = -P2[1];
    };

    for (var i = 0; i < Math.max(0,traili2-params.MAX_LINE_POINTS) ; i++) {
        scene.children[3].geometry.vertices[i].x = scene.children[3].geometry.vertices[traili2-params.MAX_LINE_POINTS].x;
        scene.children[3].geometry.vertices[i].y = scene.children[3].geometry.vertices[traili2-params.MAX_LINE_POINTS].y;
        scene.children[3].geometry.vertices[i].z = scene.children[3].geometry.vertices[traili2-params.MAX_LINE_POINTS].z;
    };

    for (var i = trailj2++; i <= params.MAX_LINE_POINTS; i++) {
        scene.children[4].geometry.vertices[i].x = P2[0];
        scene.children[4].geometry.vertices[i].y = P2[2];
        scene.children[4].geometry.vertices[i].z = -P2[1];
    };

    for (var i = 0; i < Math.max(0,trailj2-params.MAX_LINE_POINTS) ; i++) {
        scene.children[4].geometry.vertices[i].x = scene.children[4].geometry.vertices[trailj2-params.MAX_LINE_POINTS].x;
        scene.children[4].geometry.vertices[i].y = scene.children[4].geometry.vertices[trailj2-params.MAX_LINE_POINTS].y;
        scene.children[4].geometry.vertices[i].z = scene.children[4].geometry.vertices[trailj2-params.MAX_LINE_POINTS].z;
    };


    scene.children[0].geometry.verticesNeedUpdate = true;
    scene.children[1].geometry.verticesNeedUpdate = true;
    scene.children[2].geometry.verticesNeedUpdate = true;
    scene.children[3].geometry.verticesNeedUpdate = true;
    scene.children[4].geometry.verticesNeedUpdate = true;

    if(traili == 2*params.MAX_LINE_POINTS){
        traili = 0;
    }
    if(trailj == 2*params.MAX_LINE_POINTS){
        trailj = 0;
    }
    if(traili2 == 2*params.MAX_LINE_POINTS2){
        traili2 = 0;
    }
    if(trailj2 == 2*params.MAX_LINE_POINTS2){
        trailj2 = 0;
    }
    var thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
    controls.update();
    renderer.clear();
    composer.render();
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}