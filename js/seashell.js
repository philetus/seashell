var user = false;

var camera, scene, renderer;
var effect;
var mobile = false;
var globe
var group

var ss 

var exportButton, floatingDiv;


init();
animate();

function exportToObj() {

    var exporter = new THREE.OBJExporter();
    var result = exporter.parse( scene );
    floatingDiv.style.display = 'block';
    floatingDiv.innerHTML = result.split( '\n' ).join ( '<br />' );

}

function init() {

    // setup
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0)
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.focalLength = camera.position.distanceTo(scene.position);
    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera);
    controls.autoRotate = false; //true;
    controls.enablePan = false;

    //coordinate sys
    // X axis is red. The Y axis is green. The Z axis is blue.
    object = new THREE.AxisHelper( 1 );             
    scene.add( object );
    
  
    
    ss = new Seashell();
    //spine of seashell 
    // var spiral = ss.spiral; 
    
    var material = new THREE.LineBasicMaterial({
        color: 0xeeeeee
    });

    var geometrySpiral = new THREE.Geometry();
  
    //cx

 


    var extrudeShapePoints = [], count = 10;
    for ( var i = 0; i < count; i ++ ) {
        var l = 0.3;
        var a = 2 * i / count * Math.PI;
        extrudeShapePoints.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );
    }

    var extrudeShape = new THREE.Shape( extrudeShapePoints );

     var extrudeMaterial = new THREE.MeshLambertMaterial( { color: 0xeeeeee, wireframe: false } );
    //cx


    for (var i = 0 ; i< ss.spiral.length; i++){
        geometrySpiral.vertices.push(ss.spiral[i]);  

       var oneEllipse = new THREE.Geometry(); 
       
       var c = 0x011000 + 0x0000e0* i ;


      
       for (var j = 0 ; j < ss._shell[i].length; j++){
           // oneEllipse= new THREE.Geometry(); 
           oneEllipse.vertices.push(ss._shell[i][j]);  

       }
       oneEllipse.vertices.push(ss._shell[i][0]);  //completes full loop
       //cx

       var extusionSpline =  new THREE.CatmullRomCurve3( oneEllipse.vertices );
       extusionSpline.closed = true;
        var extrudeSettings = {
        steps           : 10, //int. number of points used for subdividing segements of extrude spline
        bevelEnabled    : false,
        extrudePath     : extusionSpline
    };
    var extrudeGeometry = new THREE.ExtrudeGeometry( extrudeShape, extrudeSettings );

        var mesh = new THREE.Mesh( extrudeGeometry, extrudeMaterial );

        scene.add( mesh );

        ////render the ellipse in single lines
       // console.log(c)
       // scene.add( new THREE.Line(oneEllipse, 
       //                  new THREE.LineBasicMaterial({
       //                      color: c,
       //                      linewidth: 1
       //                  }))
       //  );
    }
    //render spiral spine
    // var spineLine = new THREE.Line( geometrySpiral, material );
    // scene.add( spineLine );



    // light

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, 1.5, 0.5);
    scene.add(light);

    // events

    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener('resize', onWindowResize, false);

    exportButton = document.getElementById( 'export' );
    exportButton.addEventListener( 'click', function() { exportToObj(); });

     floatingDiv = document.createElement( 'div' );
                floatingDiv.className = 'floating';
                document.body.appendChild( floatingDiv );

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    controls.update();

    // if (mobile) {
    //     camera.position.set(0, 0, 0)
    //     camera.translateZ(5);
    // }
    renderer.render(scene, camera);

}