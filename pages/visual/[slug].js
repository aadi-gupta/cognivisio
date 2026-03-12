import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { visualExercises } from "../../lib/visualExercises";
import { CanvasEngine } from "../../lib/visual/CanvasEngine";
import { SpiralPattern } from "../../lib/visual/patterns/SpiralPattern";
import { CirclePattern } from "../../lib/visual/patterns/CirclePattern";
import { TrianglePattern } from "../../lib/visual/patterns/TrianglePattern";
import { RingsPattern } from "../../lib/visual/patterns/RingsPattern";
import { SunburstPattern } from "../../lib/visual/patterns/SunburstPattern";
import { DiamondPattern } from "../../lib/visual/patterns/DiamondPattern";
import { StarPattern } from "../../lib/visual/patterns/StarPattern";
import { DiamondGridPattern } from "../../lib/visual/patterns/DiamondGridPattern";
import { PawPattern } from "../../lib/visual/patterns/PawPattern";
import { CrossPattern } from "../../lib/visual/patterns/CrossPattern";
import { CheckerPattern } from "../../lib/visual/patterns/CheckerPattern";
import { DotsPattern } from "../../lib/visual/patterns/DotsPattern";
import { StripesPattern } from "../../lib/visual/patterns/StripesPattern";
import { SnowflakePattern } from "../../lib/visual/patterns/SnowflakePattern";
import { TrianglesPattern } from "../../lib/visual/patterns/TrianglesPattern";
import styles from "../../styles/VisualPlayer.module.css";

const patternMap = {
  spiral: SpiralPattern,
  checker: CheckerPattern,
  circle: CirclePattern,
  triangle: TrianglePattern,
  rings: RingsPattern,
  star: StarPattern,
  sunburst: SunburstPattern,
  diamond: DiamondPattern,
  dots: DotsPattern,
  triangles: TrianglesPattern,
  diamondGrid: DiamondGridPattern,
  stripes: StripesPattern,
  snowflake: SnowflakePattern,
  paw: PawPattern,
  cross: CrossPattern,
};

export default function VisualPlayerPage() {
  const canvasRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [showBack, setShowBack] = useState(false);
  const router = useRouter();

  const exercise = useMemo(
    () => visualExercises.find((item) => item.slug === router.query.slug),
    [router.query.slug]
  );

  useEffect(() => {
    if (!exercise || !canvasRef.current) {
      return undefined;
    }

    const phaseFactories = exercise.phases.map((phase) => {
      const PatternClass = patternMap[phase.type];
      return () => new PatternClass(phase);
    });

    const engine = new CanvasEngine(canvasRef.current, phaseFactories, {
      phaseDuration: 12,
      phaseTransitionDuration: 3,
      invertDuration: 10,
    });
    engine.start();

    return () => {
      engine.stop();
    };
  }, [exercise]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const revealBackButton = () => {
    setShowBack(true);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setShowBack(false);
    }, 1800);
  };

  if (!exercise) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Little Bloom | ${exercise.title}`}</title>
        <meta
          name="description"
          content={`${exercise.title} visual stimulation player for Little Bloom.`}
        />
      </Head>

      <main className={styles.page} onPointerDown={revealBackButton}>
        <Link
          href="/visual"
          className={`${styles.backHint} ${showBack ? styles.backVisible : ""}`}
          aria-label="Back to visual menu"
        >
          <span className={styles.backArrow}>‹</span>
        </Link>
        <canvas ref={canvasRef} className={styles.canvas} />
      </main>
    </>
  );
}
