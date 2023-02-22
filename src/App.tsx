import React, { useEffect, useMemo, useRef, useState } from 'react';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import './App.css'

function convertRange( value: number, r1: [number, number], r2: [number, number] ) { 
  return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

function App() {
  const canvasRef = useRef<HTMLDivElement>(null)

  let peeler: THREE.Object3D<THREE.Event>;

  const { camera, mesh, scene, renderer } = useMemo(() => {
    const manager = new THREE.LoadingManager();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    const loader = new OBJLoader();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio( window.devicePixelRatio );
	  renderer.setSize( window.innerWidth, window.innerHeight );
	  renderer.shadowMap.enabled = true;
	  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	  renderer.outputEncoding = THREE.sRGBEncoding;
    const scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0x444444 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 ).normalize();
    scene.add( directionalLight );
    
    loader.load('./models/Peeler.obj', (obj) => {
      peeler = obj
      scene.add(obj)
    })    
    
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    
    return {camera, scene, mesh, renderer}
  }, [])
    
  const mouseMoving = (event: MouseEvent) => {
    if (canvasRef.current) {
      if ( peeler instanceof THREE.Object3D ) {        
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        const yRotation = convertRange(event.clientX, [0, width], [-0.4, 0.4]);
        const xRotation = convertRange(event.clientY, [0, height], [-0.2, 0.4]);
        
        peeler.rotation.y = yRotation;
        peeler.rotation.x = xRotation;
        
        // console.log("x", xRotation, "y", yRotation * -1);
        
        // peeler.rotation.y = event.clientX / 100;
        // peeler.rotation.x = event.clientY / 100;
        
        // console.log(( (event.clientY - canvasRef.current.getBoundingClientRect().top) / canvasRef.current.clientHeight ) * 1 + 1)
        
        // peeler.rotation.y = ( (event.clientX - canvasRef.current.getBoundingClientRect().left) /canvasRef.current.clientWidth) * 1 - 1;
        // peeler.rotation.x = - ( (event.clientY - canvasRef.current.getBoundingClientRect().top) / canvasRef.current.clientHeight ) * 1 + 1;
        renderer.render(scene, camera)
      }
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      camera.position.y = 2;
      camera.position.z = 5;
      // scene.add(mesh);
      renderer.setSize( window.innerWidth, window.innerHeight);
      // renderer.setAnimationLoop( animation )
      canvasRef.current.appendChild(renderer.domElement)
      canvasRef.current.addEventListener('mousemove', mouseMoving);
    }

    

    return () => {
      canvasRef.current?.removeEventListener(
        'mousemove',
        mouseMoving,
      );
    }
  }, []);

  return (
    <div>
      <div id="container" ref={canvasRef} style={{position: "relative"}}>
        <h1 style={{
          width: "100%",
          textAlign: "center",
          position: 'absolute',
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: -1,
          fontSize: "5rem",
          color: "#C39D68"
        }}>WORLDS BEST POTATO PEELER</h1>
      </div>
      <div id="purchase-container">
        <div className="page product-container">
          <div>
          <p>Wolrds Best Potato Peeler</p>
          <div className='purchase-form'>
          <p>£12.99</p>
          <select>
            {[...Array(10)].map((e, i) => <option key={i} value={i + 1}>{i + 1}</option> )}
          </select>
          </div>

          </div>
          
          <button>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default App;
