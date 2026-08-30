import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { usePatternSpeed } from "../../lib/patternSpeed";
import { therapyAnimals } from "../../lib/therapyAnimals";
import { createAmbientAudio } from "../../lib/visual/createAmbientAudio";
import { ripple } from "../../lib/visual/motion";
import styles from "../../styles/VisualPlayer.module.css";

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

function SettingsIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="8" />
      <path d="M32 10v8M32 46v8M10 32h8M46 32h8M16.4 16.4l5.7 5.7M41.9 41.9l5.7 5.7M47.6 16.4l-5.7 5.7M22.1 41.9l-5.7 5.7" />
    </svg>
  );
}

export default function AnimalPlayerPage() {
  const hideTimerRef = useRef(null);
  const audioRef = useRef(null);
  const wakeLockRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [showBack, setShowBack] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [patternPhase, setPatternPhase] = useState(0);
  const { patternSpeed, setPatternSpeed } = usePatternSpeed();
  const router = useRouter();

  const animal = useMemo(
    () => therapyAnimals.find((item) => item.slug === router.query.slug),
    [router.query.slug]
  );

  useEffect(() => {
    audioRef.current = createAmbientAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

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
    let startTime = null;

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      setPatternPhase(((timestamp - startTime) / 1000) * patternSpeed);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [patternSpeed]);

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

  const revealControls = () => {
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

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      if (!showSettings) {
        setShowBack(false);
      }
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

  const toggleSettings = (event) => {
    event.stopPropagation();
    setShowBack(true);
    setShowSettings((current) => !current);
  };

  const updatePatternSpeed = (event) => {
    event.stopPropagation();
    setPatternSpeed(Number(event.target.value));
  };

  if (!animal) {
    return null;
  }

  const catPath =
    "M151.34904,307.20455 L264.34904,307.20455 C264.34904,291.14096 263.2021,287.95455 236.59904,287.95455 C240.84904,275.20455 258.12424,244.35808 267.72404,244.35808 C276.21707,244.35808 286.34904,244.82592 286.34904,264.20455 C286.34904,286.20455 323.37171,321.67547 332.34904,307.20455 C345.72769,285.63897 309.34904,292.21514 309.34904,240.20455 C309.34904,169.05135 350.87417,179.18071 350.87417,139.20455 C350.87417,119.20455 345.34904,116.50374 345.34904,102.20455 C345.34904,83.30695 361.99717,84.403577 358.75805,68.734879 C356.52061,57.911656 354.76962,49.23199 353.46516,36.143889 C352.53959,26.857305 352.24452,16.959398 342.59855,17.357382 C331.26505,17.824992 326.96549,37.77419 309.34904,39.204549 C291.76851,40.631991 276.77834,24.238028 269.97404,26.579549 C263.22709,28.901334 265.34904,47.204549 269.34904,60.204549 C275.63588,80.636771 289.34904,107.20455 264.34904,111.20455 C239.34904,115.20455 196.34904,119.20455 165.34904,160.20455 C134.34904,201.20455 135.49342,249.3212 123.34904,264.20455 C82.590696,314.15529 40.823919,293.64625 40.823919,335.20455 C40.823919,353.81019 72.349045,367.20455 77.349045,361.20455 C82.349045,355.20455 34.863764,337.32587 87.995492,316.20455 C133.38711,298.16014 137.43914,294.47663 151.34904,307.20455 z";
  const dogPath =
    "M440.651,132.739c-0.888-2.354-2.721-4.229-5.054-5.171L396.39,111.75c-2.435-12.666-12.056-22.81-24.436-26.008l-2.115-24.363c-0.309-3.565-2.701-6.608-6.093-7.751c-3.391-1.142-7.137-0.167-9.541,2.484l-10.062,11.099l-6.22-21.766c-1.072-3.752-4.44-6.386-8.341-6.521c-3.924-0.139-7.444,2.258-8.773,5.928L274.34,173.047c0,0-172.127,8.035-172.199,8.039c-35.296,2.121-68.735-16.765-85.167-48.119c-2.309-4.402-7.748-6.102-12.149-3.794c-4.403,2.308-6.101,7.747-3.794,12.149c14.69,28.03,40.708,47.75,70.541,54.93c-3.097,3.609-9.751,12.554-13.642,26.617c-4.231,15.291-5.756,39.667,9.801,70.619L42.499,327.76c-1.474,2.001-2.054,4.523-1.603,6.968l11.105,60.218c0.787,4.268,4.51,7.367,8.851,7.367h11.312c2.669,0,5.2-1.185,6.911-3.233c1.71-2.05,2.422-4.753,1.944-7.378l-7.032-38.627l74.401-55.853c0.131-0.099-0.126,0.107,0,0c7.114-5.975,12.278-12.556,15.972-19.322c38.777,6.808,91.844,16.02,125.857,21.498l14.986,95.314c0.689,4.377,4.46,7.602,8.891,7.602h9.308c4.971,0,9-4.029,9-9V296.56c8.449-5.77,11.469-15.42,13.472-24.871c0.063-0.297,20.022-92.416,20.022-92.416c3.762,0.627,7.561,0.956,11.388,0.956c26.356,0,50.492-15.431,62.987-40.271C441.401,137.712,441.539,135.094,440.651,132.739z";

  const silhouettes = {
    cat: {
      path: catPath,
      viewBox: "0 0 400 380",
      width: 400,
      height: 380,
    },
    dog: {
      path: dogPath,
      viewBox: "0 20 441.23 360",
      width: 441.23,
      height: 360,
    },
  };

  const silhouetteKey = animal.shape ?? animal.slug;
  const silhouette = silhouettes[silhouetteKey];
  const clipPathId = `animal-clip-${animal.slug}`;
  const patternCx = silhouette ? silhouette.width / 2 : 0;
  const patternCy = silhouette ? silhouette.height / 2 : 0;
  const isDogShape = silhouetteKey === "dog";
  const ringCount = isDogShape ? 7 : 6;
  const ringSpan = Math.min(silhouette?.width ?? 0, silhouette?.height ?? 0) * 0.78;
  const ringSpacing = ringCount > 0 ? ringSpan / (ringCount + 1) : 0;
  const patternScale = isDogShape ? 0.92 : 0.5;
  const maxRadius = ringSpacing * ringCount;
  const centerScale = patternScale;
  const ringSpeed = isDogShape ? 34 : 28;
  const ringStrokeWidth = isDogShape ? 18 : 14;
  const artworkSize = isDogShape ? "min(88vw, 84vh, 860px)" : "min(74vw, 72vh, 720px)";

  return (
    <>
      <Head>
        <title>{`Little Bloom | ${animal.title}`}</title>
        <meta
          name="description"
          content={`${animal.title} high-contrast therapy player for Little Bloom.`}
        />
      </Head>
      <main
        className={`${styles.page} ${styles.colorPlayerPage}`}
        onPointerDown={revealControls}
        style={{
          background: "#ffffff",
          backgroundImage: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link
          href="/animals"
          className={`${styles.backHint} ${showBack ? styles.backVisible : ""}`}
          aria-label="Back to animals menu"
        >
          <span className={styles.backArrowIcon}>
            <LeftIcon />
          </span>
        </Link>

        <button
          type="button"
          className={`${styles.soundHint} ${showBack ? styles.backVisible : ""}`}
          aria-label={soundOn ? "Mute soothing sound" : "Play soothing sound"}
          onClick={toggleSound}
        >
          <span className={styles.soundIcon}>
            {soundOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
          </span>
        </button>
        <button
          type="button"
          className={`${styles.settingsHint} ${showBack ? styles.backVisible : ""}`}
          aria-label={showSettings ? "Close pattern settings" : "Open pattern settings"}
          aria-expanded={showSettings}
          onClick={toggleSettings}
        >
          <span className={styles.soundIcon}>
            <SettingsIcon />
          </span>
        </button>
        {showSettings ? (
          <section
            className={styles.settingsPanel}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="Pattern settings"
          >
            <div className={styles.settingsHeader}>
              <h2 className={styles.settingsTitle}>Speed</h2>
              <span className={styles.settingsValue}>{patternSpeed.toFixed(1)}x</span>
            </div>
            <input
              className={styles.settingsSlider}
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={patternSpeed}
              onChange={updatePatternSpeed}
            />
          </section>
        ) : null}

        {silhouette ? (
          <svg
            viewBox={silhouette.viewBox}
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: artworkSize,
              height: artworkSize,
              display: "block",
              overflow: "visible",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <defs>
              <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
                <path d={silhouette.path} />
              </clipPath>
            </defs>

            <g clipPath={`url(#${clipPathId})`}>
              <g
                transform={`
                  translate(${patternCx} ${patternCy})
                  scale(${centerScale})
                  translate(${-patternCx} ${-patternCy})
                `}
              >
                {Array.from({ length: ringCount }, (_, index) => {
                  const radius = ripple(index * ringSpacing, ringSpeed, patternPhase, maxRadius);
                  const alpha = Math.max(1 - radius / maxRadius, 0.08);

                  return (
                  <circle
                    key={index}
                    cx={patternCx}
                    cy={patternCy}
                    r={radius}
                    fill="none"
                    stroke="#000"
                    strokeWidth={ringStrokeWidth}
                    opacity={alpha}
                  />
                  );
                })}
              </g>
            </g>

            <path
              d={silhouette.path}
              fill="none"
              stroke="#000"
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        ) : null}
      </main>
    </>
  );
}
