import { useEffect } from "react";
import { Fredoka } from "next/font/google";
import "../styles/globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "development" ||
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });

    if ("caches" in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      });
    }
  }, []);

  return (
    <div className={fredoka.variable}>
      <Component {...pageProps} />
    </div>
  );
}
