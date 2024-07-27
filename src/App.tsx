import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { CelebrationDialog } from "./components/molcules/CelebrationDialog";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [visitedDate, setVisitedDate] = useLocalStorage<string | null>({
    storageKey: "visitedDate",
    initialValue: null,
  });
  const [isVisitedToday, setIsVisitedToday] = useState<boolean>(false);
  const [openSelebrationDialog, setOpenSelebrationDialog] = useState(false);

  const handleOpenSelebrationDialog = () => {
    setOpenSelebrationDialog(true);
  };

  const handleCloseSelebrationDialog = () => {
    setOpenSelebrationDialog(false);
    handleSelebrate();
  };

  const handleSelebrate = () => {
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
      handleOpenSelebrationDialog();
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
    <>
      <CelebrationDialog
        open={openSelebrationDialog}
        handleClose={handleCloseSelebrationDialog}
      />
    </>
  );
}

export default App;
