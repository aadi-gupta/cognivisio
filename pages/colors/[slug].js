import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { therapyColors } from "../../lib/therapyColors";
import { createAmbientAudio } from "../../lib/visual/createAmbientAudio";
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

export default function ColorPlayerPage() {
  const hideTimerRef = useRef(null);
  const audioRef = useRef(null);
  const wakeLockRef = useRef(null);
  const [showBack, setShowBack] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const router = useRouter();

  const color = useMemo(
    () => therapyColors.find((item) => item.slug === router.query.slug),
    [router.query.slug]
  );

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

  if (!color) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Little Bloom | ${color.title}`}</title>
        <meta
          name="description"
          content={`${color.title} full-screen color therapy player for Little Bloom.`}
        />
      </Head>

      <main
        className={styles.page}
        onPointerDown={revealControls}
        style={{ background: color.hex, backgroundImage: "none" }}
      >
        <Link
          href="/colors"
          className={`${styles.backHint} ${showBack ? styles.backVisible : ""}`}
          aria-label="Back to colors menu"
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
      </main>
    </>
  );
}
