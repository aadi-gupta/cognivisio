import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { PawPrint } from "lucide-react";

function EyeIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M6 32s9-14 26-14 26 14 26 14-9 14-26 14S6 32 6 32Z" />
      <circle cx="32" cy="32" r="8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 10c-12.2 0-22 8.6-22 19.2C10 40 18.7 48 29.6 48H34c2.7 0 4.8 2 4.8 4.4 0 1.2.6 1.6 1.6 1.6C50.5 54 58 46 58 35.6 58 21.4 46.2 10 32 10Z" />
      <circle cx="22" cy="24" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="32" cy="20" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="42" cy="24" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="34" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AnimalIcon() {
  return (
    <span className={styles.animalIconStack}>
      <span className={styles.animalIconFill} aria-hidden="true" />
      <PawPrint
        size={36}
        strokeWidth={2.7}
        className={styles.animalIconOutline}
      />
    </span>
  );
}

const featureCards = [
  {
    title: "Visual",
    description: "High-contrast patterns and calming motion for visual stimulation.",
    icon: "visual",
    href: "/visual",
  },
  {
    title: "Colors",
    description: "Bright, soothing full-screen colors for simple color therapy play.",
    icon: "colors",
    href: "/colors",
  },
  {
    title: "Animals",
    description: "High-contrast silhouettes that keep infants engaged with playful shapes.",
    icon: "animals",
    href: "/animals",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Little Bloom | Visual and Colors</title>
        <meta
          name="description"
          content="Little Bloom is a calm, mobile-first baby stimulation app for visual patterns and color-based play."
        />
        <meta name="theme-color" content="#0f766e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Congnivisio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      <main className={styles.page}>
        <div className={styles.skyDecor} aria-hidden="true">
          <span className={`${styles.floatItem} ${styles.starOne}`}>★</span>
          <span className={`${styles.floatItem} ${styles.starTwo}`}>✦</span>
          <span className={`${styles.floatItem} ${styles.moon}`}>☾</span>
          <span className={`${styles.floatItem} ${styles.cloud}`}>☁</span>
          <span className={`${styles.floatItem} ${styles.duck}`}>◡</span>
          <span className={`${styles.floatItem} ${styles.spark}`}>✧</span>
        </div>
        <section className={styles.home}>
          <div className={styles.heroBadge} aria-hidden="true">
            <div className={styles.heroGlow} />
            <div className={styles.moonBuddy}>
              <span className={styles.moonEarLeft} />
              <span className={styles.moonEarRight} />
              <span className={styles.moonFace}>
                <span className={styles.moonEyeLeft} />
                <span className={styles.moonEyeRight} />
                <span className={styles.moonSmile} />
                <span className={styles.moonBlushLeft} />
                <span className={styles.moonBlushRight} />
              </span>
              <span className={styles.moonStar}>★</span>
            </div>
          </div>
          <h1 className={styles.title}>Little Bloom</h1>
          <div className={styles.cardGrid}>
            {featureCards.map((card) => (
              <Link key={card.title} href={card.href} className={styles.actionCard}>
              <span
                className={`${styles.iconWrap} ${
                  card.icon === "animals" ? styles.iconWrapAnimal : ""
                }`}
              >
                {card.icon === "visual" && <EyeIcon />}
                {card.icon === "colors" && <PaletteIcon />}
                {card.icon === "animals" && <AnimalIcon />}
              </span>
                <strong className={styles.cardTitle}>{card.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
