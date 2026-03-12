import Head from "next/head";
import { Eye, Palette } from "@phosphor-icons/react";
import styles from "../styles/Home.module.css";

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
              <a key={card.title} href={card.href} className={styles.actionCard}>
                <span className={styles.iconWrap}>
                  {card.icon === "visual" && <Eye weight="fill" aria-hidden="true" />}
                  {card.icon === "colors" && <Palette weight="fill" aria-hidden="true" />}
                </span>
                <strong className={styles.cardTitle}>{card.title}</strong>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
