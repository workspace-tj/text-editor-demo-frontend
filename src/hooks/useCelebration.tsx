import React, { createContext, useContext, useState } from "react";
import {
  handleGenerateCelebrationParticles,
  Particle,
} from "../utils/particle-helper";

interface UseCelebration {
  explosionTrigger: boolean;
  setExplosionTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  particles: Particle[];
  setParticles: React.Dispatch<React.SetStateAction<Particle[]>>;
  playCelebrationSound: () => Promise<void>;
  handleResetExplosion: () => void;
  handleCelebrate: () => Promise<void>;
}

const CelebrationProviderContext = createContext({} as UseCelebration);

export const useCelebration = () => {
  return useContext(CelebrationProviderContext);
};

interface CelebrationProviderProps {
  children: React.ReactNode;
}

export function CelebrationProvider({
  children,
}: CelebrationProviderProps): React.ReactElement {
  const celebrationProviderValue = useCelebrationProvider();
  return (
    <CelebrationProviderContext.Provider value={celebrationProviderValue}>
      {children}
    </CelebrationProviderContext.Provider>
  );
}

export const useCelebrationProvider = () => {
  const [explosionTrigger, setExplosionTrigger] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>(
    handleGenerateCelebrationParticles(),
  );

  const audio = new Audio("/celebration_cracker.mp3");

  const playCelebrationSound = async () => {
    await audio.play();
  };

  const handleResetExplosion = () => {
    setExplosionTrigger(false);
    setParticles([]);
  };

  const handleCelebrate = async () => {
    playCelebrationSound().then(() => {
      setParticles(handleGenerateCelebrationParticles());
      setExplosionTrigger(true);
    });
  };
  return {
    explosionTrigger,
    setExplosionTrigger,
    particles,
    setParticles,
    handleCelebrate,
    handleResetExplosion,
    playCelebrationSound,
  };
};
