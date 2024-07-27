import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [visitedDate, setVisitedDate] = useLocalStorage<string | null>({
    storageKey: "visitedDate",
    initialValue: null,
  });
  const [isVisitedToday, setIsVisitedToday] = useState<boolean>(false);

  // TODO: お祝いクラッカーを鳴らす
  useEffect(() => {
    if (isVisitedToday) return;
    if (!visitedDate) {
      alert("Welcome to Vite + React!");
      setVisitedDate(dayjs().utc().toISOString());
      setIsVisitedToday(true);
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
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() =>
            setVisitedDate((prev) =>
              prev ? null : dayjs("2024/7/26 17:00").utc().toISOString(),
            )
          }
        >
          count is {visitedDate?.toString()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
