export const INITIAL_POSITION_ABSOLUTE = {
  x: () => Math.random() + 7,
  y: () => Math.random() - 5,
  z: () => Math.random(),
};

export const VELOCITY_ABSOLUTE = {
  x: () => Math.random() * 0.1 + 0.07,
  y: () => Math.random() * 0.1 + 0.04,
  z: () => (Math.random() - 0.5) * 0.1,
};
