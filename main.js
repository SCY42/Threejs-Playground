import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";


// 장면 초기화
const scene = new THREE.Scene();


// 렌더러 초기화
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// 카메라 초기화
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 0, 0 );


// 컨트롤 초기화
const controls = new PointerLockControls( camera, renderer.domElement );
document.addEventListener( "click", () => {
    controls.lock();
} );

// 움직임 오브젝트
const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
}

// 조작 키 다운 콜백
document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW': movement.forward  = true; break;
      case 'KeyS': movement.backward = true; break;
      case 'KeyA': movement.left     = true; break;
      case 'KeyD': movement.right    = true; break;
      case 'Space': movement.up = true; break;
      case 'ControlLeft': movement.down = true; break;
    }
});

// 조작 키 업 콜백
document.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyW': movement.forward  = false; break;
      case 'KeyS': movement.backward = false; break;
      case 'KeyA': movement.left     = false; break;
      case 'KeyD': movement.right    = false; break;
      case 'Space': movement.up = false; break;
      case 'ControlLeft': movement.down = false; break;
    }
});


// 창 크기 변경 콜백
const onWindowResize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}; window.addEventListener( "resize", onWindowResize, false );


// glft 로드
const loader = new GLTFLoader();
loader.load( "tinyroom.gltf", function ( gltf ) {
    const model = gltf.scene;

    // 모델 깊이 관련 문제 해결
    model.traverse( ( child ) => {
        if ( child.isMesh ) {
            child.material.depthWrite = true;
            child.geometry.computeVertexNormals();
        }
    });

    model.scale.set( 0.1, 0.1, 0.1 );
    model.position.set( 0, -0.5, 0 );
    scene.add( model );
}, undefined, function ( error ) {
    console.error( error );
} );


// 초기 렌더
renderer.render( scene, camera );


// 컨트롤러 관련 파라미터
const SPEED = 0.5;

// 매 프레임
function animate() {
    requestAnimationFrame(animate);

    if (movement.forward)  controls.moveForward(SPEED);
    if (movement.backward) controls.moveForward(-SPEED);
    if (movement.left)     controls.moveRight(-SPEED);
    if (movement.right)    controls.moveRight(SPEED);
    if (movement.up)       camera.position.add(new THREE.Vector3(0, SPEED, 0));
    if (movement.down)     camera.position.add(new THREE.Vector3(0, -SPEED, 0));

    // controls.update();
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}
animate();