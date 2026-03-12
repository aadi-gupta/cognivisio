import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Visual.module.css";
import { therapyColors } from "../lib/therapyColors";

function LeftIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M39 14 21 32l18 18" />
    </svg>
  );
}

function RightIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="m25 14 18 18-18 18" />
    </svg>
  );
}

export default function ColorsPage() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = isPortrait ? 12 : 18;
  const totalPages = Math.ceil(therapyColors.length / pageSize);

  useEffect(() => {
    const syncOrientation = () => {
      setIsPortrait(window.innerHeight >= window.innerWidth);
    };

    syncOrientation();
    window.addEventListener("resize", syncOrientation);

    return () => {
      window.removeEventListener("resize", syncOrientation);
    };
  }, []);

  useEffect(() => {
    setPage((value) => Math.min(value, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const visibleColors = useMemo(() => {
    const start = page * pageSize;
    const items = therapyColors.slice(start, start + pageSize);

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
        <title>Little Bloom | Colors</title>
        <meta
          name="description"
          content="Color therapy menu for Little Bloom with calming full-screen color cards."
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
          <span className={styles.backArrowIcon}><LeftIcon /></span>
        </Link>

        <section className={`${styles.boardWrap} ${styles.colorsBoardWrap}`}>
          <div className={`${styles.board} ${styles.colorsBoard}`}>
            <div className={styles.boardHeader}>
              <button
                type="button"
                className={styles.pagerButton}
                onClick={() => setPage((value) => Math.max(0, value - 1))}
                disabled={page === 0}
                aria-label="Previous color page"
              >
                <span className={styles.pagerIcon}><LeftIcon /></span>
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
                aria-label="Next color page"
              >
                <span className={styles.pagerIcon}><RightIcon /></span>
              </button>
            </div>

            <div className={`${styles.grid} ${styles.colorsGrid}`}>
              {visibleColors.map((color) => {
                if (color.placeholder) {
                  return <span key={color.slug} className={`${styles.tilePlaceholder} ${styles.colorsTilePlaceholder}`} aria-hidden="true" />;
                }

                return (
                  <Link
                    key={color.slug}
                    href={`/colors/${color.slug}`}
                    className={`${styles.tile} ${styles.colorCard}`}
                    aria-label={color.title}
                    title={color.title}
                    style={{
                      backgroundColor: color.hex,
                      color: color.text,
                      boxShadow: `inset 0 0 0 1px ${color.text}22, 0 10px 18px rgba(0,0,0,0.16)`,
                    }}
                  >
                    <span className={styles.colorTileContent} aria-hidden="true" />
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
