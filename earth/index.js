if (!Detector.webgl) Detector.addGetWebGLMessage();

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var container, stats;

    var camera, scene, renderer;

    var earthGeo, seaGeo, landGeo, glowGeo, cubeGeo;

    var seaUniforms, landUniforms;

    var clock = new THREE.Clock();

    var utils = new Utils();

    var mixers = [];
    var clock = new THREE.Clock();

    // var bg = new BackgroundView();

    init();

    animate();

    function init () {
        container = document.getElementById('container');
        document.body.appendChild(container);
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);

        camera.position.z = 300;
        camera.target = new THREE.Vector3( 0, 0, 0 );


        scene = new THREE.Scene();

        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        scene.add(light);
        scene.add(camera);
        scene.add(new THREE.HemisphereLight(0x443333, 0x222233));
        scene.add(new THREE.AmbientLight(0xffffff));

        // LOADER

        var loader = new THREE.ObjectLoader();
        earthGeo = loader.parse(earthModel);
        earthGeo.position.x = 0;
        earthGeo.position.z = 150;
        earthGeo.scale.set(0.12, 0.12, 0.12);
        earthGeo.rotation.y = utils.toRadians(238);



        seaUniforms = {
            light: {
                type: "v3",
                value: new THREE.Vector3(-5000,2000,-5000)
            },
            ambient1: {
                type: "c",
                value: new THREE.Color(10733036)
            },
            ambient2: {
                type: "c",
                value: new THREE.Color(8950227)
            },
            rimColor: {
                type: "c",
                value: new THREE.Color(4661124)
            },
            map: {
                type: "t",
                value: getTexture("earth/images/earth/shadows.jpg")
            },
            shadowMix: {
                type: "f",
                value: 0
            },
            fadeOut: {
                type: "f",
                value: 0
            },
            time: {
                type: "f",
                value: 0
            },
        };

        landUniforms = {
            light: {
                type: "v3",
                value: new THREE.Vector3(-5000,2000,-5000)
            },
            ambient1: {
                type: "c",
                value: new THREE.Color(11511550)
            },
            ambient2: {
                type: "c",
                value: new THREE.Color(11790847)
            },
            map: {
                type: "t",
                value: getTexture("earth/images/earth/shadows.jpg")
            },
            shadowMix: {
                type: "f",
                value: 0
            },
            fadeOut: {
                type: "f",
                value: 0
            },
            time: {
                type: "f",
                value: 0
            }
        };


        // addLand();
        scene.add(earthGeo);
        addSea();
        addGlow();
        addCubeCamera();

        // bg.initBackground();


        renderer = new THREE.WebGLRenderer({ antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        container.appendChild(renderer.domElement);
        stats = new Stats();
        container.appendChild(stats.dom);
    }

    function animate() {
        requestAnimationFrame( animate );
        render();
        stats.update();
    }

    var radius = 600;
    var theta = 0;
    
    function render () {
        var _time = clock.getElapsedTime();
        // console.log(_time);
        // landGeo.material.uniforms.time.value = _time;
        seaGeo.material.uniforms.time.value = _time;

        // bg.getMaterial().uniforms.time.value = _time;

        // earthGeo.rotation.x += 0.01;
        earthGeo.rotation.y += 0.01;
        // renderer.clear();
        // cubeGeo.updateCubeMap(renderer, scene);
        renderer.render(scene, camera);
    }

    //----------------
function setOceanAttributes(geom) {
    var position = geom.attributes.position;
    var angle = new Float32Array(position.count);
    var speed = new Float32Array(position.count);
    var radius = new Float32Array(position.count);
    var len = position.count;
    for (var i = 0; i < len; i++) {
        angle[i] = utils.toRadians(utils.doRandom(0, 360));
        speed[i] = utils.doRandom(50, 150) / 150;
        radius[i] = utils.doRandom(-10, 10) / 100
    }
    geom.addAttribute("angle", new THREE.BufferAttribute(angle,1));
    geom.addAttribute("speed", new THREE.BufferAttribute(speed,1));
    geom.addAttribute("radius", new THREE.BufferAttribute(radius,1))
}


/**
 *
 */
function addSea () {
    seaGeo = earthGeo.children[2].children[0];
    seaGeo.frustumCulled = false;
    seaGeo.geometry = new THREE.BufferGeometry().fromGeometry(seaGeo.geometry);
    setOceanAttributes(seaGeo.geometry);
    // insertSphere(earthGeo.children[1].children[0]);
    seaGeo.material.uniforms = seaUniforms;
    seaGeo.material.uniforms.map.value = getTexture("earth/images/earth/shadows.jpg");
    seaGeo.material.uniforms['shadowMix'].value = 1;
    scene.add(seaGeo);

}


/**
 *
 */
function addLand () {
    landGeo = earthGeo.children[0].children[0];
    landGeo.frustumCulled = false;
    landGeo.scale.set(0.175, 0.175, 0.175);
    landGeo.position.x = 0;
    landGeo.position.z = 150;
    landGeo.material.uniforms = landUniforms;
    scene.add(landGeo);
}


/**
 *
 */
function addGlow() {

    var img = new THREE.MeshBasicMaterial({
        map: getTexture("earth/images/earth/glow.png"),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    img.opacity = 0;
    var plane = new THREE.PlaneBufferGeometry(1800, 1800);
    glowGeo = new THREE.Mesh(plane, img);
    glowGeo.frustumCulled = false;
    glowGeo.position.y = Math.PI;
    glowGeo.position.z = 160;
    glowGeo.scale.set(0.5, 0.5, 0.5);
    scene.add(glowGeo);

}

function addCubeCamera () {
    cubeGeo = new THREE.CubeCamera(10, 10000, 1024);

    scene.add(cubeGeo);
}

function getTexture (path) {
    var img = new Image();
    img.crossOrigin = "";
    // absolute path
    img.src = path;
    var texture = new THREE.Texture(img);
    img.onload = function () {
        texture.needsUpdate = true;
        if (texture.onload) {
            texture.onload();
            texture.onload = null;
        }

    }
    return texture;
}

function insertSphere(mesh) {

    var shader = _this.initClass(Shader, "OceanReflection", "OceanReflection");
    shader.uniforms = {
        tCube: {
            type: "t",
            value: _cube.renderTarget
        }
    };
    shader.material.transparent = true;
    shader.material.depthWrite = false;
    shader.material.blending = THREE.AdditiveBlending;
    mesh.scale.set(0.975, 0.975, 0.975);
    mesh.material = shader.material
}