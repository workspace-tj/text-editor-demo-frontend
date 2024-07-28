import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { AnaglyphEffect } from "three/addons/effects/AnaglyphEffect.js";

export function Tape(): React.ReactElement {
  const tapeCanvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer());
  useEffect(() => {
    if (!tapeCanvasRef.current) return;
    let container,
      camera: THREE.PerspectiveCamera,
      scene: THREE.Scene,
      effect: AnaglyphEffect;

    const spheres: THREE.Mesh[] = [];

    let mouseX = 0;
    let mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener("mousemove", onDocumentMouseMove);

    init();

    function init() {
      container = document.createElement("div");

      tapeCanvasRef.current!.appendChild(container);

      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.01,
        100,
      );
      camera.position.z = 3;

      const path = "textures/cube/pisa/";
      const format = ".png";
      const urls = [
        path + "px" + format,
        path + "nx" + format,
        path + "py" + format,
        path + "ny" + format,
        path + "pz" + format,
        path + "nz" + format,
      ];

      const textureCube = new THREE.CubeTextureLoader().load(urls);

      scene = new THREE.Scene();
      scene.background = textureCube;

      const pointCount = 7;
      const points = new Array(pointCount).fill(0).map((_, index) => {
        return new THREE.Vector3().setFromSphericalCoords(
          5,
          Math.random() * Math.PI * (2 / 3) + Math.PI / 6,
          (index / pointCount) * Math.PI * 2,
        );
      });

      const catmullRomCurve = new THREE.CatmullRomCurve3(points, true);

      const segmentCount = 500;
      const linePoints = catmullRomCurve.getSpacedPoints(segmentCount);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      const frenetFrames = catmullRomCurve.computeFrenetFrames(
        segmentCount,
        true,
      );

      function buildRibbon(ribbonPoints: { x: number; y: number }[]) {
        const ribbonGeometry = new THREE.PlaneGeometry(1, 1, segmentCount, 1);
        const ribbonVertices: THREE.Vector3[] = [];
        let point = new THREE.Vector3();
        const normal = new THREE.Vector3();
        const binormal = new THREE.Vector3();
        ribbonPoints.forEach((ribbonPoint) => {
          for (let i = 0; i <= segmentCount; i++) {
            point = linePoints[i];
            normal.copy(frenetFrames.normals[i]).multiplyScalar(ribbonPoint.x);
            binormal
              .copy(frenetFrames.binormals[i])
              .multiplyScalar(ribbonPoint.y);
            ribbonVertices.push(
              new THREE.Vector3().copy(point).add(normal).add(binormal),
            );
          }
        });
        ribbonGeometry.setFromPoints(ribbonVertices);
        return ribbonGeometry;
      }
      const ribbonGeometry = buildRibbon([
        { x: 0, y: 0.5 },
        { x: 0, y: -0.5 },
      ]);
      const ribbonMaterial = new THREE.MeshBasicMaterial({
        color: 0xf0f000,
        envMap: textureCube,
      });
      ribbonMaterial.userData.uniforms = { time: { value: 0 } };
      ribbonMaterial.defines = { USE_UV: "" };

      const mesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
      scene.add(mesh);
      spheres.push(mesh);
      const clock = new THREE.Clock();

      rendererRef.current.setAnimationLoop(() => {
        ribbonMaterial.userData.uniforms.time.value =
          clock.getElapsedTime() * 0.125;
        rendererRef.current.render(scene, camera);
      });

      const geometry = new THREE.PlaneGeometry(0.1, 0.4);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        envMap: textureCube,
      });

      for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material);

        // mesh.position.x = Math.random() * 10 - 5;
        // mesh.position.y = Math.random() * 10 - 5;
        // mesh.position.z = Math.random() * 10 - 5;

        // mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        scene.add(mesh);

        spheres.push(mesh);
      }

      //

      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      rendererRef.current.setAnimationLoop(animate);
      container.appendChild(rendererRef.current.domElement);

      const width = window.innerWidth || 2;
      const height = window.innerHeight || 2;

      effect = new AnaglyphEffect(rendererRef.current);
      effect.setSize(width, height);

      //

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      effect.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event: MouseEvent) {
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY) / 100;
    }

    //

    function animate() {
      render();
    }

    function render() {
      const timer = 0.0001 * Date.now();

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;

      camera.lookAt(scene.position);

      for (let i = 0, il = spheres.length; i < il; i++) {
        const sphere = spheres[i];

        sphere.position.x = 5 * Math.cos(timer + i);
        sphere.position.y = 5 * Math.sin(timer + i * 1.1);
      }

      effect.render(scene, camera);
    }
  }, []);
  return (
    <>
      <div ref={tapeCanvasRef}></div>
    </>
  );
}

// let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 100);
// camera.position.set(5, 8, 13);
// let renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(innerWidth, innerHeight);
// renderer.setClearColor(0x404040);
// document.body.appendChild(renderer.domElement);

// window.addEventListener( 'resize', onWindowResize );

// let controls = new OrbitControls(camera, renderer.domElement);

// let grid = new THREE.GridHelper(10, 50);
// scene.add(grid);

// const pCount = 7;
// let pts = new Array(pCount).fill(0).map((p, idx) => {
//   return new THREE.Vector3().setFromSphericalCoords(
//     5,
//     Math.random() * Math.PI * (2 / 3) + Math.PI / 6,
//     (idx / pCount) * Math.PI * 2
//   );
// });

// let curve = new THREE.CatmullRomCurve3(pts, true);

// const segments = 500;

// let lpts = curve.getSpacedPoints(segments);
// let lg = new THREE.BufferGeometry().setFromPoints(lpts);
// let lm = new THREE.LineBasicMaterial({ color: "yellow" });
// let l = new THREE.Line(lg, lm);
// scene.add(l);

// const frames = curve.computeFrenetFrames(segments, true);

// let g = buildRibbon([
//   { x: 0, y: 0.5 },
//   { x: 0, y: -0.5 }
// ]);
// let m = new THREE.MeshBasicMaterial({
//   map: new THREE.TextureLoader().load(
//     "https://threejs.org/examples/textures/uv_grid_opengl.jpg"
//   ),
//   side: THREE.DoubleSide,
//   onBeforeCompile: (shader) => {
//     shader.uniforms.time = m.userData.uniforms.time;
//     shader.fragmentShader = `
//       uniform float time;
//       ${shader.fragmentShader}
//     `.replace(
//       `#include <clipping_planes_fragment>`,
//       `
//         if ( fract(time - vUv.x) < (2. / 3.)) discard;

//       #include <clipping_planes_fragment>`
//     );
//     console.log(shader.fragmentShader);
//   }
// });
// m.userData.uniforms = { time: { value: 0 } };
// m.defines = { USE_UV: "" };
// let r = new THREE.Mesh(g, m);
// scene.add(r);

// let clock = new THREE.Clock();

// renderer.setAnimationLoop((_) => {
//   m.userData.uniforms.time.value = clock.getElapsedTime() * 0.125;
//   renderer.render(scene, camera);
// });

// function buildRibbon(points) {
//   let g = new THREE.PlaneGeometry(1, 1, segments, 1);

//   let ps = [];
//   let P = new THREE.Vector3(),
//     N = new THREE.Vector3(),
//     B = new THREE.Vector3();

//   points.forEach((p) => {
//     for (let i = 0; i <= segments; i++) {
//       P = lpts[i];
//       N.copy(frames.normals[i]).multiplyScalar(p.x);
//       B.copy(frames.binormals[i]).multiplyScalar(p.y);
//       ps.push(new THREE.Vector3().copy(P).add(N).add(B));
//     }
//   });

//   g.setFromPoints(ps);
//   return g;
// }
