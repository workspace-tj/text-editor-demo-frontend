import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import ParticleSketch from "./components/atoms/ParticleSketch";
import { CelebrationDialog } from "./components/molcules/CelebrationDialog";
import { INITIAL_POSITION_ABSOLUTE, VELOCITY_ABSOLUTE } from "./constants";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { generateParticles, Particle } from "./utils/particle-helper";

const {
  x: positionXAbs,
  y: positionYAbs,
  z: positionZAbs,
} = INITIAL_POSITION_ABSOLUTE;
const { x: velocityXAbs, y: velocityYAbs, z: velocityZAbs } = VELOCITY_ABSOLUTE;
const randomRGB = { r: Math.random, g: Math.random, b: Math.random };

const handleGenerateNewParticles = () => {
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

function App() {
  const [visitedDate, setVisitedDate] = useLocalStorage<string | null>({
    storageKey: "visitedDate",
    initialValue: null,
  });
  const [isVisitedToday, setIsVisitedToday] = useState<boolean>(false);
  const [openCelebrationDialog, setOpenCelebrationDialog] = useState(false);
  const [explosionTrigger, setExplosionTrigger] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>(
    handleGenerateNewParticles(),
  );
  const audio = new Audio("/celebration_cracker.mp3");

  const handleOpenCelebrationDialog = () => {
    setOpenCelebrationDialog(true);
  };

  const handleCloseCelebrationDialog = () => {
    setOpenCelebrationDialog(false);
    handleCelebrate();
  };

  const handleResetExplosion = () => {
    setExplosionTrigger(false);
    setParticles([]);
  };

  const handleCelebrate = async () => {
    playCelebrationSound().then(() => {
      setParticles(handleGenerateNewParticles());
      setExplosionTrigger(true);
    });
  };

  const playCelebrationSound = async () => {
    await audio.play();
  };

  useEffect(() => {
    if (isVisitedToday) return;
    if (!visitedDate) {
      setVisitedDate(dayjs().utc().toISOString());
      setIsVisitedToday(true);
      handleOpenCelebrationDialog();
    } else {
      setIsVisitedToday(true);
      const diffDate = dayjs().utc().diff(dayjs(visitedDate).utc(), "day");
      if (diffDate >= 1) {
        diffDate > 14 && alert("longtimenosee");
        setVisitedDate(dayjs().utc().toISOString());
      }
    }
  }, [visitedDate, setVisitedDate, isVisitedToday]);

  return (
    <div>
      <button onClick={handleCelebrate} disabled={explosionTrigger}>
        お祝いアクションの実行
      </button>
      <CelebrationDialog
        open={openCelebrationDialog}
        handleClose={handleCloseCelebrationDialog}
      />
      <ParticleSketch
        particles={particles}
        explosionsTrigger={explosionTrigger}
        onCompleted={handleResetExplosion}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />
    </div>
  );
}

export default App;
