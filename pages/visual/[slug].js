import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { visualExercises } from "../../lib/visualExercises";
import { createAmbientAudio } from "../../lib/visual/createAmbientAudio";
import styles from "../../styles/VisualPlayer.module.css";

const patternMetadata = {
  spiral: { importer: () => import("../../lib/visual/patterns/SpiralPattern"), exportName: "SpiralPattern" },
  checker: { importer: () => import("../../lib/visual/patterns/CheckerPattern"), exportName: "CheckerPattern" },
  circle: { importer: () => import("../../lib/visual/patterns/CirclePattern"), exportName: "CirclePattern" },
  triangle: { importer: () => import("../../lib/visual/patterns/TrianglesPattern"), exportName: "TrianglesPattern" },
  rings: { importer: () => import("../../lib/visual/patterns/RingsPattern"), exportName: "RingsPattern" },
  star: { importer: () => import("../../lib/visual/patterns/StarPattern"), exportName: "StarPattern" },
  sunburst: { importer: () => import("../../lib/visual/patterns/SunburstPattern"), exportName: "SunburstPattern" },
  diamond: { importer: () => import("../../lib/visual/patterns/DiamondPattern"), exportName: "DiamondPattern" },
  dots: { importer: () => import("../../lib/visual/patterns/DotsPattern"), exportName: "DotsPattern" },
  triangles: { importer: () => import("../../lib/visual/patterns/TrianglesPattern"), exportName: "TrianglesPattern" },
  diamondGrid: { importer: () => import("../../lib/visual/patterns/DiamondGridPattern"), exportName: "DiamondGridPattern" },
  stripes: { importer: () => import("../../lib/visual/patterns/StripesPattern"), exportName: "StripesPattern" },
  snowflake: { importer: () => import("../../lib/visual/patterns/SnowflakePattern"), exportName: "SnowflakePattern" },
  paw: { importer: () => import("../../lib/visual/patterns/PawPattern"), exportName: "PawPattern" },
  cross: { importer: () => import("../../lib/visual/patterns/CrossPattern"), exportName: "CrossPattern" },
};

function LeftIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M39 14 21 32l18 18" />
    </svg>
  );
}

function SpeakerOnIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M10 24h12l14-12v40L22 40H10Z" fill="currentColor" stroke="none" />
      <path d="M44 24c4 4 4 12 0 16M50 18c8 8 8 20 0 28" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M10 24h12l14-12v40L22 40H10Z" fill="currentColor" stroke="none" />
      <path d="M44 22 56 42M56 22 44 42" />
    </svg>
  );
}

export default function VisualPlayerPage() {
  const canvasRef = useRef(null);
  const hideTimerRef = useRef(null);
  const audioRef = useRef(null);
  const wakeLockRef = useRef(null);
  const [showBack, setShowBack] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const router = useRouter();

  const exercise = useMemo(
    () => visualExercises.find((item) => item.slug === router.query.slug),
    [router.query.slug]
  );

  useEffect(() => {
    if (!exercise || !canvasRef.current) {
      return undefined;
    }

    let cancelled = false;
    let engine = null;

    const initEngine = async () => {
      const uniqueTypes = Array.from(new Set(exercise.phases.map((phase) => phase.type)));
      const filteredTypes = uniqueTypes.filter((type) => patternMetadata[type]);
      const importPromises = filteredTypes.map((type) => patternMetadata[type].importer());

      const [
        { CanvasEngine },
        ...patternModules
      ] = await Promise.all([import("../../lib/visual/CanvasEngine"), ...importPromises]);

      if (cancelled) {
        return;
      }

      const loadedPatterns = {};
      filteredTypes.forEach((type, index) => {
        const metadata = patternMetadata[type];
        const module = patternModules[index];
        if (metadata && module) {
          loadedPatterns[type] = module[metadata.exportName];
        }
      });

      const phaseFactories = exercise.phases.map((phase) => {
        const PatternClass = loadedPatterns[phase.type];
        if (!PatternClass) {
          throw new Error(`Missing pattern class for ${phase.type}`);
        }
        return () => new PatternClass(phase);
      });

      engine = new CanvasEngine(canvasRef.current, phaseFactories, {
        phaseDuration: 12,
        phaseTransitionDuration: 3,
        invertDuration: 10,
        paletteMode: exercise.paletteMode,
      });
      engine.start();
    };

    initEngine();

    return () => {
      cancelled = true;
      if (engine) {
        engine.stop();
      }
    };
  }, [exercise]);

  useEffect(() => {
    audioRef.current = createAmbientAudio();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }

      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!sessionStarted) {
      return undefined;
    }

    const handleVisibility = async () => {
      if (
        document.visibilityState === "visible" &&
        "wakeLock" in navigator &&
        navigator.wakeLock?.request
      ) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch {
          wakeLockRef.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [sessionStarted]);

  const revealBackButton = () => {
    setShowBack(true);

    if (!sessionStarted) {
      setSessionStarted(true);

      if ("wakeLock" in navigator && navigator.wakeLock?.request) {
        navigator.wakeLock
          .request("screen")
          .then((lock) => {
            wakeLockRef.current = lock;
          })
          .catch(() => {
            wakeLockRef.current = null;
          });
      }
    }

    if (audioRef.current && soundOn) {
      void audioRef.current.resume();
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setShowBack(false);
    }, 1800);
  };

  const toggleSound = async (event) => {
    event.stopPropagation();

    if (!audioRef.current) {
      return;
    }

    await audioRef.current.resume();
    const enabled = audioRef.current.toggle();
    setSoundOn(enabled);
  };

  if (!exercise) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Little Bloom | ${exercise.title}`}</title>
        <meta
          name="description"
          content={`${exercise.title} visual stimulation player for Little Bloom.`}
        />
      </Head>

      <main className={styles.page} onPointerDown={revealBackButton}>
        <Link
          href="/visual"
          className={`${styles.backHint} ${showBack ? styles.backVisible : ""}`}
          aria-label="Back to visual menu"
        >
          <span className={styles.backArrowIcon}><LeftIcon /></span>
        </Link>
        <button
          type="button"
          className={`${styles.soundHint} ${showBack ? styles.backVisible : ""}`}
          aria-label={soundOn ? "Mute soothing sound" : "Play soothing sound"}
          onClick={toggleSound}
        >
          <span className={styles.soundIcon}>
            {soundOn ? (
              <SpeakerOnIcon />
            ) : (
              <SpeakerOffIcon />
            )}
          </span>
        </button>
        <canvas ref={canvasRef} className={styles.canvas} />
      </main>
    </>
  );
}
