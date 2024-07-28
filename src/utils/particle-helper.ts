import * as THREE from "three";
import { INITIAL_POSITION_ABSOLUTE, VELOCITY_ABSOLUTE } from "../constants";

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
}

export interface Position3D {
  x: () => number;
  y: () => number;
  z: () => number;
}

export interface RGB {
  r: () => number;
  g: () => number;
  b: () => number;
}

export const generateParticles = (
  position: Position3D,
  velocity: Position3D,
  color: RGB,
): Particle[] => {
  const particles = new Array(350).fill(null).map(() => {
    return {
      position: new THREE.Vector3(position.x(), position.y(), position.z()),
      velocity: new THREE.Vector3(velocity.x(), velocity.y(), velocity.z()),
      color: new THREE.Color(color.r(), color.g(), color.b()),
    };
  });
  return particles;
};

const {
  x: positionXAbs,
  y: positionYAbs,
  z: positionZAbs,
} = INITIAL_POSITION_ABSOLUTE;
const { x: velocityXAbs, y: velocityYAbs, z: velocityZAbs } = VELOCITY_ABSOLUTE;
const randomRGB = { r: Math.random, g: Math.random, b: Math.random };

export const handleGenerateCelebrationParticles = () => {
  const RtLParticles = generateParticles(
    { x: positionXAbs, y: positionYAbs, z: positionZAbs },
    { x: () => -velocityXAbs(), y: velocityYAbs, z: velocityZAbs },
    randomRGB,
  );
  const LtRParticles = generateParticles(
    { x: () => -10, y: positionYAbs, z: positionZAbs },
    { x: velocityXAbs, y: velocityYAbs, z: velocityZAbs },
    randomRGB,
  );
  return [...RtLParticles, ...LtRParticles];
};
