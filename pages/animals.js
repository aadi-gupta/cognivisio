import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Visual.module.css";
import { therapyAnimals } from "../lib/therapyAnimals";

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

function DogIcon() {
  return (
    <svg viewBox="0 70 441.23 260" aria-hidden="true">
      <path d="M440.651,132.739c-0.888-2.354-2.721-4.229-5.054-5.171L396.39,111.75c-2.435-12.666-12.056-22.81-24.436-26.008l-2.115-24.363c-0.309-3.565-2.701-6.608-6.093-7.751c-3.391-1.142-7.137-0.167-9.541,2.484l-10.062,11.099l-6.22-21.766c-1.072-3.752-4.44-6.386-8.341-6.521c-3.924-0.139-7.444,2.258-8.773,5.928L274.34,173.047c0,0-172.127,8.035-172.199,8.039c-35.296,2.121-68.735-16.765-85.167-48.119c-2.309-4.402-7.748-6.102-12.149-3.794c-4.403,2.308-6.101,7.747-3.794,12.149c14.69,28.03,40.708,47.75,70.541,54.93c-3.097,3.609-9.751,12.554-13.642,26.617c-4.231,15.291-5.756,39.667,9.801,70.619L42.499,327.76c-1.474,2.001-2.054,4.523-1.603,6.968l11.105,60.218c0.787,4.268,4.51,7.367,8.851,7.367h11.312c2.669,0,5.2-1.185,6.911-3.233c1.71-2.05,2.422-4.753,1.944-7.378l-7.032-38.627l74.401-55.853c0.131-0.099-0.126,0.107,0,0c7.114-5.975,12.278-12.556,15.972-19.322c38.777,6.808,91.844,16.02,125.857,21.498l14.986,95.314c0.689,4.377,4.46,7.602,8.891,7.602h9.308c4.971,0,9-4.029,9-9V296.56c8.449-5.77,11.469-15.42,13.472-24.871c0.063-0.297,20.022-92.416,20.022-92.416c3.762,0.627,7.561,0.956,11.388,0.956c26.356,0,50.492-15.431,62.987-40.271C441.401,137.712,441.539,135.094,440.651,132.739z" />
    </svg>
  );
}

function CatIcon() {
  return (
    <svg viewBox="0 0 400 380" aria-hidden="true">
      <path d="M151.34904,307.20455 L264.34904,307.20455 C264.34904,291.14096 263.2021,287.95455 236.59904,287.95455 C240.84904,275.20455 258.12424,244.35808 267.72404,244.35808 C276.21707,244.35808 286.34904,244.82592 286.34904,264.20455 C286.34904,286.20455 323.37171,321.67547 332.34904,307.20455 C345.72769,285.63897 309.34904,292.21514 309.34904,240.20455 C309.34904,169.05135 350.87417,179.18071 350.87417,139.20455 C350.87417,119.20455 345.34904,116.50374 345.34904,102.20455 C345.34904,83.30695 361.99717,84.403577 358.75805,68.734879 C356.52061,57.911656 354.76962,49.23199 353.46516,36.143889 C352.53959,26.857305 352.24452,16.959398 342.59855,17.357382 C331.26505,17.824992 326.96549,37.77419 309.34904,39.204549 C291.76851,40.631991 276.77834,24.238028 269.97404,26.579549 C263.22709,28.901334 265.34904,47.204549 269.34904,60.204549 C275.63588,80.636771 289.34904,107.20455 264.34904,111.20455 C239.34904,115.20455 196.34904,119.20455 165.34904,160.20455 C134.34904,201.20455 135.49342,249.3212 123.34904,264.20455 C82.590696,314.15529 40.823919,293.64625 40.823919,335.20455 C40.823919,353.81019 72.349045,367.20455 77.349045,361.20455 C82.349045,355.20455 34.863764,337.32587 87.995492,316.20455 C133.38711,298.16014 137.43914,294.47663 151.34904,307.20455 z" />
    </svg>
  );
}

export default function AnimalsPage() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = isPortrait ? 12 : 18;
  const totalPages = Math.max(1, Math.ceil(therapyAnimals.length / pageSize));

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
          <span className={styles.backArrowIcon}><LeftIcon /></span>
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
                aria-label="Next visual patterns"
              >
                <span className={styles.pagerIcon}><RightIcon /></span>
              </button>
            </div>
            <div className={styles.grid}>
              {visibleAnimals.map((animal) => {
                if (animal.placeholder) {
                  return <span key={animal.slug} className={styles.tilePlaceholder} aria-hidden="true" />;
                }

                if (!animal.available) {
                  return (
                    <span
                      key={animal.slug}
                      className={`${styles.tile} ${styles.tileSoon}`}
                      aria-label={`${animal.title} coming soon`}
                    >
                      <span className={styles.comingSoonText}>Coming soon</span>
                    </span>
                  );
                }

                return (
                  <Link
                    key={animal.slug}
                    href={`/animals/${animal.slug}`}
                    className={`${styles.tile} ${styles.tileMono}`}
                    aria-label={animal.title}
                    title={animal.title}
                  >
                    <span className={styles.tileIcon}>
                      {animal.shape === "cat" ? <CatIcon /> : <DogIcon />}
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
