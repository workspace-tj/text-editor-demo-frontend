import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import ParticleSketch from "./components/atoms/ParticleSketch";
import { CelebrationDialog } from "./components/molcules/CelebrationDialog";
import { useCelebration } from "./hooks/useCelebration";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [visitedDate, setVisitedDate] = useLocalStorage<string | null>({
    storageKey: "visitedDate",
    initialValue: null,
  });
  const [isVisitedToday, setIsVisitedToday] = useState<boolean>(false);
  const [openCelebrationDialog, setOpenCelebrationDialog] = useState(false);

  const { handleCelebrate, particles, explosionTrigger, handleResetExplosion } =
    useCelebration();

  const handleOpenCelebrationDialog = () => {
    setOpenCelebrationDialog(true);
  };

  const handleCloseCelebrationDialog = () => {
    setOpenCelebrationDialog(false);
    handleCelebrate();
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
