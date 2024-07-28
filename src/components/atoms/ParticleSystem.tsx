/* eslint-disable react/no-unknown-property */
import { useFrame } from "@react-three/fiber";
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Particle } from "../../utils/particle-helper";
interface ParticleSystemProps {
  particles: Particle[];
  duration: number;
  onCompleted: () => void;
}

export function ParticleSystem({
  duration,
  onCompleted,
  particles: initParticles,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState(initParticles);
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
    </>
  );
}
