import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

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
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={styles.animalIconOutline}
      >
        <path d="M11 38c3-5 7-8 12-9l6-12c1-2 3-2 5-1l6 5h8c5 0 8 4 8 8 0 3-1 5-4 7l-5 3-2 9c-.2 1.5-1.2 2.5-2.7 2.5h-1.6c-1.5 0-2.5-1-2.7-2.5l-1.1-6.8-11.8-2-8.2 7.8c-.8.8-1.7 1.2-2.8 1.2h-2.2c-1.7 0-2.5-1.5-1.7-3l4.4-7.8-3.3-2.7c-1.8-1.5-2.1-4.1-.9-6.5Z" />
        <circle cx="44.5" cy="28.5" r="1.9" fill="currentColor" stroke="none" />
        <path d="M52 25l4-2-1 4" />
      </svg>
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
    description: "Simple animal shapes for quiet visual focus.",
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
