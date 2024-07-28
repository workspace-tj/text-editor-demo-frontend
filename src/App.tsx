import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import ParticleSketch from "./components/atoms/ParticleSketch";
import { Tape } from "./components/atoms/Tape";
import { CelebrationDialog } from "./components/molcules/CelebrationDialog";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [visitedDate, setVisitedDate] = useLocalStorage<string | null>({
    storageKey: "visitedDate",
    initialValue: null,
  });
  const [isVisitedToday, setIsVisitedToday] = useState<boolean>(false);
  const [openCelebrationDialog, setOpenCelebrationDialog] = useState(false);

  const handleOpenCelebrationDialog = () => {
    setOpenCelebrationDialog(true);
  };

  const handleCloseCelebrationDialog = () => {
    setOpenCelebrationDialog(false);
    handleCelebrate();
  };

  const handleCelebrate = () => {
    playCelebrationSound();
    setTimeout(() => playCelebrationSound(), 300);
    setTimeout(() => playCelebrationSound(), 600);
    setTimeout(() => playCelebrationSound(), 900);
    setTimeout(() => playCelebrationSound(), 1200);
  };

  const playCelebrationSound = () => {
    const audio = new Audio("/celebration_cracker.mp3");
    audio.play();
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
  const [explosions, setExplosions] = useState<Array<number>>([
    new Date().getTime(),
  ]);
  return (
    <div
      style={{ maxWidth: "100vw", maxHeight: "100vh", position: "relative" }}
    >
      <CelebrationDialog
        open={openCelebrationDialog}
        handleClose={handleCloseCelebrationDialog}
      />
      <ParticleSketch
        explosions={explosions}
        setExplosions={setExplosions}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          background: `${"lightgreen"}`,
        }}
      />
      <Tape />
    </div>
  );
}

export default App;
