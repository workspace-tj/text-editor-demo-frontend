/* eslint-disable react/no-unknown-property */
import { useFrame } from "@react-three/fiber";
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";

interface ParticleSystemProps {
  duration: number;
  onCompleted: () => void;
}

const generateParticles = () => {
  const particles = new Array(350).fill(null).map(() => ({
    position: new THREE.Vector3(
      Math.random() + 7, // 右に配置
      Math.random() - 5, // 下に配置
      Math.random(),
    ),
    velocity: new THREE.Vector3(
      -(Math.random() * 0.1 + 0.07), // 左方向の速度を調整
      Math.random() * 0.1 + 0.04, // 上方向の速度を調整
      (Math.random() - 0.5) * 0.1,
    ),
    color: new THREE.Color(Math.random(), Math.random(), Math.random()), // ランダムな色を設定
  }));
  return particles;
};

// const generateTapes = () => {
//   const tapes = new Array(200).fill(null).map(() => ({
//     position: new THREE.Vector3(
//       (Math.random() - 0.5) * 2 + 5, // 右下の位置に調整
//       (Math.random() - 0.5) * 2 - 5,
//       (Math.random() - 0.5) * 2,
//     ),
//     velocity: new THREE.Vector3(
//       -(Math.random() * 0.1 + 0.02), // 左上方向の速度に調整
//       Math.random() * 0.1 + 0.02,
//       (Math.random() - 0.5) * 0.1,
//     ),
//     rotation: new THREE.Euler(
//       Math.random() * 2 * Math.PI,
//       Math.random() * 2 * Math.PI,
//       Math.random() * 2 * Math.PI,
//     ),
//     angularVelocity: new THREE.Vector3(
//       Math.random() * 0.02,
//       Math.random() * 0.02,
//       Math.random() * 0.02,
//     ),
//     color: new THREE.Color(Math.random(), Math.random(), Math.random()), // ランダムな色を設定
//   }));
//   return tapes;
// };

// interface Tape {
//   position: THREE.Vector3;
//   velocity: THREE.Vector3;
//   rotation: THREE.Euler;
//   angularVelocity: THREE.Vector3;
//   color: THREE.Color;
//   radius: number;
//   tubeRadius: number;
// }

// テープ（ドーナツ）を生成する関数
// const generateTapes = (): Tape[] => {
//   return new Array(200).fill(null).map(() => ({
//     position: new THREE.Vector3(
//       (Math.random() - 0.5) * 2 + 5,
//       (Math.random() - 0.5) * 2 - 5,
//       (Math.random() - 0.5) * 2,
//     ),
//     velocity: new THREE.Vector3(
//       -(Math.random() * 0.1 + 0.02),
//       Math.random() * 0.1 + 0.02,
//       (Math.random() - 0.5) * 0.1,
//     ),
//     rotation: new THREE.Euler(),
//     angularVelocity: new THREE.Vector3(
//       Math.random() * 0.02,
//       Math.random() * 0.02,
//       Math.random() * 0.02,
//     ),
//     color: new THREE.Color(Math.random(), Math.random(), Math.random()),
//     radius: Math.random() * 0.5 + 0.2,
//     tubeRadius: Math.random() * 0.05 + 0.02,
//   }));
// };

export function ParticleSystem(props: ParticleSystemProps) {
  const { duration, onCompleted } = props;
  const pointsRef = useRef<THREE.Points>(null);
  // const tapesRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState(generateParticles);
  // const [tapes, setTapes] = useState<Tape[]>(generateTapes);
  const [elapsedTime, setElapsedTime] = useState(0);

  const animateParticles = () => {
    const dampingFactor = 0.99; // 減衰係数
    const gravity = new THREE.Vector3(0, -0.0005, 0); // 重力加速度

    setParticles((particles) =>
      particles.map((particle) => {
        particle.velocity.multiplyScalar(dampingFactor); // 速度を減衰
        particle.velocity.add(gravity); // 重力を追加
        particle.position.add(particle.velocity);
        return particle;
      }),
    );
  };

  // const animateTapes = () => {
  //   const dampingFactor = 0.99; // 減衰係数
  //   const gravity = new THREE.Vector3(0, -0.0005, 0); // 重力加速度

  //   setTapes((tapes) =>
  //     tapes.map((tape) => {
  //       tape.velocity.multiplyScalar(dampingFactor); // 速度を減衰
  //       tape.velocity.add(gravity); // 重力を追加
  //       tape.position.add(tape.velocity);
  //       tape.rotation.x += tape.angularVelocity.x;
  //       tape.rotation.y += tape.angularVelocity.y;
  //       tape.rotation.z += tape.angularVelocity.z;
  //       return tape;
  //     }),
  //   );
  // };

  // const animateTapes = (delta: number) => {
  //   const dampingFactor = 0.99;
  //   const gravity = new THREE.Vector3(0, -0.0005, 0);

  //   setTapes((prevTapes) =>
  //     prevTapes.map((tape) => {
  //       tape.velocity.multiplyScalar(dampingFactor);
  //       tape.velocity.add(gravity);
  //       tape.position.x += 100;
  //       tape.position.add(tape.velocity.clone().multiplyScalar(delta));
  //       tape.rotation.x += tape.angularVelocity.x * delta;
  //       tape.rotation.y += tape.angularVelocity.y * delta;
  //       tape.rotation.z += tape.angularVelocity.z * delta;
  //       return tape;
  //     }),
  //   );
  // };

  useFrame((_, delta) => {
    if (pointsRef.current) {
      animateParticles();
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      const colors = pointsRef.current.geometry.attributes.color
        .array as Float32Array;
      particles.forEach((particle, index) => {
        positions[index * 3] = particle.position.x;
        positions[index * 3 + 1] = particle.position.y;
        positions[index * 3 + 2] = particle.position.z;

        colors[index * 3] = particle.color.r;
        colors[index * 3 + 1] = particle.color.g;
        colors[index * 3 + 2] = particle.color.b;
      });
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
    // if (tapesRef.current) {
    // animateTapes(delta);
    //   const positions = tapesRef.current.geometry.attributes.position
    //     .array as Float32Array;
    //   const colors = tapesRef.current.geometry.attributes.color
    //     .array as Float32Array;
    //   tapes.forEach((particle, index) => {
    //     positions[index * 3] = particle.position.x;
    //     positions[index * 3 + 1] = particle.position.y;
    //     positions[index * 3 + 2] = particle.position.z;

    //     colors[index * 3] = particle.color.r;
    //     colors[index * 3 + 1] = particle.color.g;
    //     colors[index * 3 + 2] = particle.color.b;
    //   });
    //   tapesRef.current.geometry.attributes.position.needsUpdate = true;
    //   tapesRef.current.geometry.attributes.color.needsUpdate = true;
    // }
    setElapsedTime((prevTime) => prevTime + delta);
  });

  useEffect(() => {
    if (elapsedTime > duration) {
      onCompleted();
    }
  }, [elapsedTime, duration, onCompleted]);

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={
              new Float32Array(
                particles.flatMap((p) => [
                  p.position.x,
                  p.position.y,
                  p.position.z,
                ]),
              )
            }
            count={particles.length}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={
              new Float32Array(
                particles.flatMap((p) => [p.color.r, p.color.g, p.color.b]),
              )
            }
            count={particles.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial vertexColors size={0.07} />
      </points>
      {/* <points ref={tapesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={
              new Float32Array(
                tapes.flatMap((p) => [
                  p.position.x,
                  p.position.y,
                  p.position.z,
                ]),
              )
            }
            count={tapes.length}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={
              new Float32Array(
                tapes.flatMap((p) => [p.color.r, p.color.g, p.color.b]),
              )
            }
            count={tapes.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial vertexColors size={0.07} />
      </points> */}
      {/* {tapes.map((tape, index) => {
        index === 0 && console.log(tape.position);
        return (
          <mesh key={index} position={tape.position} rotation={tape.rotation}>
            <torusGeometry args={[tape.radius, tape.tubeRadius, 16, 100]} />
            <meshBasicMaterial color={tape.color} />
          </mesh>
        );
      })} */}
    </>
  );
}
