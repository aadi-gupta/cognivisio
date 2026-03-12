import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "../styles/Visual.module.css";
import { visualExercises } from "../lib/visualExercises";

function PatternIcon({ type }) {
  if (type === "spiral") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M59 20c12 4 21 15 21 28 0 17-13 30-30 30-13 0-24-11-24-24 0-10 8-18 18-18 8 0 14 6 14 14 0 6-5 11-11 11-5 0-9-4-9-9" />
      </svg>
    );
  }

  if (type === "checker") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <rect x="18" y="18" width="28" height="28" fill="currentColor" stroke="none" />
        <rect x="46" y="46" width="28" height="28" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "circle") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="22" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "triangle") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 22 76 72H24Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "rings") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="28" />
        <circle cx="50" cy="50" r="18" />
        <circle cx="50" cy="50" r="8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "star") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="m50 18 9 21 23 2-17 15 5 23-20-12-20 12 5-23-17-15 23-2Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "sunburst") {
    const rays = Array.from({ length: 24 }, (_, index) => index);
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {rays.map((ray) => (
          <line
            key={ray}
            x1="50"
            y1="50"
            x2="50"
            y2="14"
            transform={`rotate(${ray * 15} 50 50)`}
          />
        ))}
      </svg>
    );
  }

  if (type === "diamond") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 20 78 50 50 80 22 50Z" />
      </svg>
    );
  }

  if (type === "dots") {
    const points = [
      [28, 28], [50, 28], [72, 28],
      [28, 50], [50, 50], [72, 50],
      [28, 72], [50, 72], [72, 72],
    ];
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {points.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="currentColor" stroke="none" />
        ))}
      </svg>
    );
  }

  if (type === "triangles") {
    const triangles = [
      "M18 28 30 10 42 28Z",
      "M44 28 56 10 68 28Z",
      "M70 28 82 10 94 28Z",
      "M18 58 30 40 42 58Z",
      "M44 58 56 40 68 58Z",
      "M70 58 82 40 94 58Z",
      "M18 88 30 70 42 88Z",
      "M44 88 56 70 68 88Z",
      "M70 88 82 70 94 88Z",
    ];
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {triangles.map((path) => (
          <path key={path} d={path} fill="currentColor" stroke="none" />
        ))}
      </svg>
    );
  }

  if (type === "diamondGrid") {
    const diamonds = [
      [24, 22], [50, 22], [76, 22],
      [24, 50], [50, 50], [76, 50],
      [24, 78], [50, 78], [76, 78],
    ];
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {diamonds.map(([cx, cy]) => (
          <path
            key={`${cx}-${cy}`}
            d={`M${cx} ${cy - 10} ${cx + 10} ${cy} ${cx} ${cy + 10} ${cx - 10} ${cy}Z`}
          />
        ))}
      </svg>
    );
  }

  if (type === "stripes") {
    const lines = Array.from({ length: 6 }, (_, i) => i);
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {lines.map((i) => (
          <line key={i} x1={10 + i * 16} y1="8" x2={-18 + i * 16} y2="92" />
        ))}
      </svg>
    );
  }

  if (type === "snowflake") {
    const items = [
      [24, 24], [50, 24], [76, 24],
      [24, 50], [50, 50], [76, 50],
      [24, 76], [50, 76], [76, 76],
    ];
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {items.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
            <line x1="-8" y1="0" x2="8" y2="0" />
            <line x1="0" y1="-8" x2="0" y2="8" />
            <line x1="-6" y1="-6" x2="6" y2="6" />
            <line x1="-6" y1="6" x2="6" y2="-6" />
          </g>
        ))}
      </svg>
    );
  }

  if (type === "paw") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <ellipse cx="30" cy="30" rx="8" ry="11" fill="#e53b17" stroke="none" />
        <ellipse cx="49" cy="24" rx="8" ry="11" fill="#e53b17" stroke="none" />
        <ellipse cx="67" cy="31" rx="8" ry="11" fill="#e53b17" stroke="none" />
        <ellipse cx="77" cy="49" rx="8" ry="11" fill="#e53b17" stroke="none" />
        <path d="M52 42c14 0 23 10 23 21 0 8-7 12-15 12H39c-8 0-15-4-15-12 0-11 14-21 28-21Z" fill="#e53b17" stroke="none" />
      </svg>
    );
  }

  if (type === "cross") {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M40 16h20v24h24v20H60v24H40V60H16V40h24Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 16v18m0 32v18M16 50h18m32 0h18M50 28l14 14-14 14-14-14Z" fill="#7dd31d" stroke="#7dd31d" />
    </svg>
  );
}

export default function VisualPage() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = isPortrait ? 12 : 18;
  const totalPages = Math.ceil(visualExercises.length / pageSize);

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

  const visibleExercises = useMemo(() => {
    const start = page * pageSize;
    const items = visualExercises.slice(start, start + pageSize);

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
        <title>Little Bloom | Visual</title>
        <meta
          name="description"
          content="Visual stimulation exercise menu for Little Bloom."
        />
      </Head>

      <main className={styles.page}>
        <div className={styles.skyDecor} aria-hidden="true">
          <span className={`${styles.floatItem} ${styles.starOne}`}>★</span>
          <span className={`${styles.floatItem} ${styles.starTwo}`}>✦</span>
          <span className={`${styles.floatItem} ${styles.cloud}`}>☁</span>
          <span className={`${styles.floatItem} ${styles.spark}`}>✧</span>
        </div>

        <Link href="/" className={styles.backButton} aria-label="Back to home">
          <CaretLeft weight="bold" className={styles.backArrowIcon} aria-hidden="true" />
        </Link>

        <section className={styles.boardWrap}>
          <div className={styles.board}>
            <div className={styles.boardHeader}>
              <button
                type="button"
                className={styles.pagerButton}
                onClick={() => setPage((value) => Math.max(0, value - 1))}
                disabled={page === 0}
                aria-label="Previous visual patterns"
              >
                <CaretLeft weight="bold" className={styles.pagerIcon} aria-hidden="true" />
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
                aria-label="Next visual patterns"
              >
                <CaretRight weight="bold" className={styles.pagerIcon} aria-hidden="true" />
              </button>
            </div>
            <div className={styles.grid}>
              {visibleExercises.map((exercise, index) => {
                if (exercise.placeholder) {
                  return <span key={exercise.slug} className={styles.tilePlaceholder} aria-hidden="true" />;
                }

                return (
                  <Link
                    key={exercise.slug}
                    href={`/visual/${exercise.slug}`}
                    className={`${styles.tile} ${exercise.variant === "color" ? styles[`tileColor${(page * pageSize + index) % 6}`] : styles.tileMono}`}
                    aria-label={exercise.title}
                    title={exercise.title}
                  >
                    <span className={styles.tileIcon}>
                      <PatternIcon type={exercise.phases[0].type} />
                    </span>
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
