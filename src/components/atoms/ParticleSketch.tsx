/* eslint-disable react/no-unknown-property */
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { Particle } from "../../utils/particle-helper";
import { ParticleSystem } from "./ParticleSystem";

interface ParticleSketchProps {
  particles: Particle[];
  explosionsTrigger: boolean;
  onCompleted: () => void;
  style?: React.CSSProperties;
}

export default function ParticleSketch({
  explosionsTrigger,
  onCompleted,
  style,
  particles,
}: ParticleSketchProps) {
  return (
    <Canvas style={style}>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 100]} />
      {explosionsTrigger && (
        <ParticleSystem
          particles={particles}
          duration={6}
          onCompleted={onCompleted}
        />
      )}
      <OrbitControls
        enableZoom={false}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
