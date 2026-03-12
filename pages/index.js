import Head from "next/head";
import styles from "../styles/Home.module.css";

const focusAreas = [
  "Neuro-visual exercises for tracking, focus, and coordination",
  "Structured therapy plans for attention, processing, and balance",
  "Mobile-first sessions designed for home practice and follow-up",
];

const outcomes = [
  "Assessment overview",
  "Therapy tracks",
  "Caregiver guidance",
  "Progress snapshots",
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Congnivisio | Brain and Vision Therapy</title>
        <meta
          name="description"
          content="Congnivisio is a progressive web app for brain and vision therapy programs."
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
        <section className={styles.hero}>
          <p className={styles.kicker}>Brain and Vision Therapy</p>
          <h1>Outline a calmer path for visual focus, cognition, and recovery.</h1>
          <p className={styles.intro}>
            Congnivisio is a mobile-ready therapy experience for clinics, parents,
            and patients who need structured support across visual and cognitive
            rehabilitation.
          </p>

          <div className={styles.actions}>
            <a href="#therapy-outline" className={styles.primary}>
              View Therapy Outline
            </a>
            <a href="#programs" className={styles.secondary}>
              Explore Programs
            </a>
          </div>
        </section>

        <section id="therapy-outline" className={styles.panel}>
          <div>
            <p className={styles.sectionLabel}>Main Page Outline</p>
            <h2>Designed for everyday therapy sessions on iPhone, Android, and desktop.</h2>
          </div>
          <div className={styles.grid}>
            {focusAreas.map((item) => (
              <article key={item} className={styles.card}>
                <h3>{item}</h3>
                <p>
                  Clear routines, visual guidance, and therapist-backed steps that
                  can scale from clinic visits to home practice.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="programs" className={styles.split}>
          <article className={styles.feature}>
            <p className={styles.sectionLabel}>Program Flow</p>
            <h2>Assess. Train. Measure. Repeat.</h2>
            <p>
              Start with a baseline session, move into guided drills, and review
              progress with simple outcome checkpoints for each therapy block.
            </p>
          </article>

          <aside className={styles.outcomeBox}>
            <p className={styles.sectionLabel}>Core Modules</p>
            <ul>
              {outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
    </>
  );
}
