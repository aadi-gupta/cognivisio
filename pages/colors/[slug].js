import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { CaretLeft, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { therapyColors } from "../../lib/therapyColors";
import { createAmbientAudio } from "../../lib/visual/createAmbientAudio";
import styles from "../../styles/VisualPlayer.module.css";

export default function ColorPlayerPage() {
  const hideTimerRef = useRef(null);
  const audioRef = useRef(null);
  const [showBack, setShowBack] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const router = useRouter();

  const color = useMemo(
    () => therapyColors.find((item) => item.slug === router.query.slug),
    [router.query.slug]
  );

  useEffect(() => {
    audioRef.current = createAmbientAudio();

    return () => {
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

  const revealControls = () => {
    setShowBack(true);

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
        style={{ background: color.hex }}
      >
        <Link
          href="/colors"
          className={`${styles.backHint} ${showBack ? styles.backVisible : ""}`}
          aria-label="Back to colors menu"
        >
          <CaretLeft size={50} weight="bold" className={styles.backArrowIcon} aria-hidden="true" />
        </Link>
        <button
          type="button"
          className={`${styles.soundHint} ${showBack ? styles.backVisible : ""}`}
          aria-label={soundOn ? "Mute soothing sound" : "Play soothing sound"}
          onClick={toggleSound}
        >
          <span className={styles.soundIcon}>
            {soundOn ? (
              <SpeakerHigh size={40} weight="fill" className={styles.soundIconSvg} aria-hidden="true" />
            ) : (
              <SpeakerSlash size={40} weight="fill" className={styles.soundIconSvg} aria-hidden="true" />
            )}
          </span>
        </button>
      </main>
    </>
  );
}
