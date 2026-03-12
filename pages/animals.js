import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Visual.module.css";
import { therapyAnimals } from "../lib/therapyAnimals";
import {
  Bird,
  Cat,
  Dog,
  Fish,
  PawPrint,
  Rabbit,
  Snail,
  Turtle,
} from "lucide-react";

const lucideAnimalIcons = {
  Cat,
  Dog,
  Rabbit,
  Bird,
  Fish,
  Turtle,
  PawPrint,
  Snail,
};

export default function AnimalsPage() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = isPortrait ? 12 : 18;
  const totalPages = Math.ceil(therapyAnimals.length / pageSize);

  useEffect(() => {
    const syncOrientation = () => setIsPortrait(window.innerHeight >= window.innerWidth);
    syncOrientation();
    window.addEventListener("resize", syncOrientation);
    return () => window.removeEventListener("resize", syncOrientation);
  }, []);

  useEffect(() => {
    setPage((value) => Math.min(value, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const visibleAnimals = useMemo(() => {
    const start = page * pageSize;
    const items = therapyAnimals.slice(start, start + pageSize);
    return [
      ...items,
      ...Array.from({ length: Math.max(0, pageSize - items.length) }, (_, index) => ({
        slug: `placeholder-${page}-${index}`,
        placeholder: true,
      })),
    ];
  }, [page, pageSize]);

  return (
    <>
      <Head>
        <title>Little Bloom | Animals</title>
        <meta
          name="description"
          content="Animal shape therapy menu for Little Bloom."
        />
      </Head>

      <main className={`${styles.page} ${styles.colorsPage}`}>
        <div className={styles.skyDecor} aria-hidden="true">
          <span className={`${styles.floatItem} ${styles.starOne}`}>★</span>
          <span className={`${styles.floatItem} ${styles.starTwo}`}>✦</span>
          <span className={`${styles.floatItem} ${styles.cloud}`}>☁</span>
          <span className={`${styles.floatItem} ${styles.spark}`}>✧</span>
        </div>

        <Link href="/" className={styles.backButton} aria-label="Back to home">
          <span className={styles.backArrowIcon}><svg viewBox="0 0 64 64"><path d="M39 14 21 32l18 18" /></svg></span>
        </Link>

        <section className={`${styles.boardWrap} ${styles.colorsBoardWrap}`}>
          <div className={`${styles.board} ${styles.colorsBoard}`}>
            <div className={styles.boardHeader}>
              <button
                type="button"
                className={styles.pagerButton}
                onClick={() => setPage((value) => Math.max(0, value - 1))}
                disabled={page === 0}
                aria-label="Previous animal page"
              >
                <span className={styles.pagerIcon}><svg viewBox="0 0 24 24"><path d="M15 5 7 12l8 7"/></svg></span>
              </button>
              <div className={styles.pageDots} aria-hidden="true">
                {Array.from({ length: totalPages }, (_, index) => (
                  <span
                    key={index}
                    className={`${styles.pageDot} ${index === page ? styles.pageDotActive : ""}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className={styles.pagerButton}
                onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
                disabled={page === totalPages - 1}
                aria-label="Next animal page"
              >
                <span className={styles.pagerIcon}><svg viewBox="0 0 24 24"><path d="m9 5 8 7-8 7"/></svg></span>
              </button>
            </div>

            <div className={`${styles.grid} ${styles.colorsGrid}`}>
              {visibleAnimals.map((animal) => {
                if (animal.placeholder) {
                  return <span key={animal.slug} className={`${styles.tilePlaceholder} ${styles.colorsTilePlaceholder}`} aria-hidden="true" />;
                }

                const Icon = lucideAnimalIcons[animal.icon] || PawPrint;

                return (
                  <Link
                    key={animal.slug}
                    href={`/animals/${animal.slug}`}
                    className={`${styles.tile} ${styles.colorCard}`}
                    aria-label={animal.title}
                    style={{ backgroundColor: animal.color, color: "#fff" }}
                  >
                    <div className={styles.animalTile}>
                      <Icon size={40} strokeWidth={2.6} className={styles.lucideAnimalIcon} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
