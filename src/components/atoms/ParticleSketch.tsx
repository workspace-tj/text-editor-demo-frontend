/* eslint-disable react/no-unknown-property */
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { ParticleSystem } from "./ParticleSystem";

interface ParticleSketchProps {
  explosions: number[];
  setExplosions: React.Dispatch<React.SetStateAction<number[]>>;
  style?: React.CSSProperties;
}

export default function ParticleSketch(props: ParticleSketchProps) {
  const { explosions, setExplosions, style } = props;

  return (
    <Canvas style={style}>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 100]} />
      {explosions.map((id) => (
        <ParticleSystem
          key={id}
          duration={10}
          onCompleted={() => {
            setExplosions((prev) =>
              prev.filter((explosion) => explosion !== id),
            );
          }}
        />
      ))}
      <OrbitControls
        enableZoom={false}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
