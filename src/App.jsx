import React, { useCallback, useEffect, useState } from "react";
import { GAME_TITLE } from "./config.js";
import { GameProvider, useGame } from "./state/GameContext.jsx";
import { cancel, playClips, unlockAudio as unlockClips } from "./audio/audioService.ts";
import { WELCOME_KEY, LETS_PLAY_KEY } from "./audio/clips.js";
import { unlockAudio, sfxTap } from "./services/sfx.js";
import { Welcome, MapScreen, StageScreen, Tutorial, Celebration, Rest, StickersScreen } from "./screens/MainScreens.jsx";
import LevelScreen from "./screens/LevelScreen.jsx";
import ParentScreen from "./screens/ParentScreen.jsx";

function Router() {
  const game = useGame();
  const [screen, setScreen] = useState({ name: "welcome" });

  const go = useCallback((name, params = {}) => {
    cancel(); // يبطّل صوت الشاشة القديمة عند الانتقال
    setScreen({ name, ...params });
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = GAME_TITLE;
  }, []);

  // لو الصفحة اتخبّت: نوقف الكلام
  useEffect(() => {
    const onHide = () => document.hidden && cancel();
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const backToMap = () => go("map");

  switch (screen.name) {
    case "welcome":
      return (
        <Welcome
          onStart={() => {
            // لمسة فتح الصوت: بتشغّل مقطع فعلي في نفس معالج الضغطة
            unlockAudio();
            unlockClips();
            sfxTap();
            go("map");
            const first = !game.progress.welcomed;
            playClips(first ? [WELCOME_KEY, LETS_PLAY_KEY] : [LETS_PLAY_KEY]);
            if (first) game.patchProgress({ welcomed: true });
          }}
          onParent={() => go("parent", { from: "welcome" })}
        />
      );
    case "map":
      return (
        <MapScreen
          onStage={(id) => go("stage", { stageId: id })}
          onStickers={() => go("stickers")}
          onParent={() => go("parent", { from: "map" })}
          onTutorial={() => go("tutorial")}
        />
      );
    case "stage":
      return <StageScreen stageId={screen.stageId} onBack={backToMap} onLevel={(id) => go("level", { levelId: id, stageId: screen.stageId })} />;
    case "tutorial":
      return <Tutorial onDone={() => go("stage", { stageId: "letters" })} onExit={backToMap} />;
    case "level":
      return (
        <LevelScreen
          key={screen.levelId}
          levelId={screen.levelId}
          onExit={() => go("stage", { stageId: screen.stageId })}
          onDone={(levelId, result) => go("celebrate", { levelId, result, stageId: screen.stageId })}
        />
      );
    case "celebrate":
      return <Celebration levelId={screen.levelId} result={screen.result} onMap={backToMap} onRest={() => go("rest")} />;
    case "rest":
      return <Rest onWake={backToMap} />;
    case "stickers":
      return <StickersScreen onBack={backToMap} />;
    case "parent":
      return (
        <ParentScreen
          startTab={screen.tab || "progress"}
          onExit={() => go(screen.from === "welcome" ? "welcome" : "map")}
          onPlayLevel={(levelId) => {
            // شاشة الأهل بتسمح بفتح أي مرحلة حتى لو مقفولة
            const lv = levelId;
            go("level", { levelId: lv, stageId: lv.split("-")[0] });
          }}
        />
      );
    default:
      return null;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="app">
        <Router />
      </div>
    </GameProvider>
  );
}
