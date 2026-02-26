import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

function AnimatedDots() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
}

const DownloadPage = () => {
  const {
    t,
    i18n: { language: currentLocale },
  } = useTranslation();
  const [searchParams] = useSearchParams();

  const fileName = useMemo(() => searchParams.get('file'), [searchParams.get('file')]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (fileName) {
      try {
        const link = document.createElement("a");
        link.href = `${process.env.REACT_APP_API_URL}/help/download?fileName=${encodeURIComponent(fileName)}`;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setStarted(true);
      } catch {}
    }
  }, [fileName]);

  return (
    <>
      <header>
        <title>{t("page.download.title")}</title>
        <meta name="description" content={t("download.started")} />
        <meta name="keywords" content={t("page.download.keywords")} />
      </header>
      <section className="relative py-12 sm:py-16 md:py-20">
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-orange-400/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-orange-300/6 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Заголовок вынесен за блок */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold neon-text">
              {t("download.title")}
            </h1>
          </div>

          <div className="neon-box rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-8 md:p-5">
              <div className="text-center">
                {fileName ? (
                  <>
                    <p className="text-gray-300 text-base sm:text-lg">
                      {started ? (
                        <>
                          {t("download.started")}
                          <AnimatedDots />
                        </>
                      ) : (
                        t("download.starting")
                      )}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      {t("download.autoHint")}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10">
                      <span className="text-gray-400 text-xs">
                        {t("download.file")}:
                      </span>
                      <span className="text-gray-100 text-sm font-medium">
                        {fileName}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-300 text-base sm:text-lg">
                    {t("download.chooseFile")}
                  </p>
                )}
              </div>

              {/* Progress bar - показываем только при загрузке конкретного файла */}
              {fileName && (
                <div className="mt-4">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        started ? "bg-green-500" : "bg-orange-500"
                      } animate-[progress_1.2s_ease_infinite]`}
                      style={{ width: started ? "100%" : "60%" }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Кнопка перезапуска загрузки - показываем только при загрузке конкретного файла */}
              {fileName && (
                <div className="mt-4 flex justify-center">
                  <a
                    href={`${process.env.REACT_APP_API_URL}/help/download?fileName=${encodeURIComponent(fileName)}`}
                    className="inline-flex items-center gap-2 text-sm sm:text-base px-4 py-2 rounded-lg border border-orange-500/40 text-orange-300 hover:text-white hover:bg-orange-500/20 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                      />
                    </svg>
                    {t("download.restart")}
                  </a>
                </div>
              )}

              <div className="mt-4 flex flex-col items-center gap-4">
                <Link
                  to={`/${currentLocale || "ru"}/help`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-extrabold text-white bg-linear-to-r from-orange-500/80 to-pink-500/80 hover:from-orange-500 hover:to-pink-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v4m0 4h.01"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                  {t("download.help_short")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DownloadPage;
