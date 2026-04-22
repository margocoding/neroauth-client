import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { projects } from "./ProjectsPage";

const platforms = {
  android_64: {
    platform: 'Android',
    desc: '64 bit'
  },
  android_32: {
    platform: 'Android',
    desc: '32 bit'
  },
  android: {
    platform: 'Android',
    desc: '.apk'
  },
  ios: {
    platform: 'iOS',
    desc: '.ipa'
  },
};

function AnimatedDots() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
}

const AndroidIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 7h12c0-2.21-1.2-4.15-2.97-5.19-.15-.09-.3-.17-.46-.25l-.04-.02v.02-.4zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
  </svg>
);

const AppleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const DownloadPage = () => {
  const {
    t,
    i18n: { language: currentLocale },
  } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const projectId = searchParams.get("project");
  const fileParam = searchParams.get("file");

  const project = projectId ? projects.find((p) => p.id === projectId) : null;
  const files = project?.files || [];

  const [selectedFile, setSelectedFile] = useState(fileParam || null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (files.length === 1 && !selectedFile) {
      setSelectedFile(files[0].name);
    }
  }, [files, selectedFile]);

  const startDownload = useCallback((fileName) => {
    try {
      const link = document.createElement("a");
      link.href = `${process.env.REACT_APP_API_URL}/help/download?fileName=${encodeURIComponent(fileName)}`;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStarted(true);
    } catch { }
  }, []);

  useEffect(() => {
    if (fileParam) {
      startDownload(fileParam);
    }
  }, [fileParam, startDownload]);

  const handleSelectPlatform = (file) => {
    setSelectedFile(file.name);
    setSearchParams({ project: projectId, file: file.name });
    startDownload(file.name);
  };

  const showPlatformSelection = projectId && files.length > 1 && !selectedFile;
  const showDownloading = selectedFile && (fileParam || started);

  return (
    <>
      <header>
        <title>{t("page.download.title")}</title>
        <meta name="description" content={t("download.started")} />
        <meta name="keywords" content={t("page.download.keywords")} />
      </header>
      <section className="relative py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-orange-400/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-orange-300/6 rounded-full blur-2xl animate-pulse" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="neon-box rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-8 md:p-5">

              {showPlatformSelection ? (
                <div className="text-center">
                  <p className="text-gray-300 text-base sm:text-lg mb-6">
                    {t("download.choosePlatform")}
                  </p>
                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    {files.map((file) => (
                      <button
                        key={file.platform}
                        type="button"
                        onClick={() => handleSelectPlatform(file)}
                        className="relative group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 bg-white/5 hover:bg-orange-500/10 transition-all duration-200 w-32 sm:w-36"
                      >
                        {file.unstable && (
                          <span className="absolute -top-2 -right-2 text-[0.6rem] font-bold tracking-wider uppercase bg-yellow-500 text-black px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                            unstable
                          </span>
                        )}
                        {platforms[file.platform].platform == "Android" ? (
                          <AndroidIcon className="w-12 h-12 sm:w-14 sm:h-14 text-[#3DDC84] group-hover:scale-110 transition-transform duration-200" />
                        ) : (
                          <AppleIcon className="w-12 h-12 sm:w-14 sm:h-14 text-white group-hover:scale-110 transition-transform duration-200" />
                        )}
                        <span className="text-sm sm:text-base font-semibold text-gray-200">
                          {platforms[file.platform].platform}
                        </span>
                        <span className="text-[0.65rem] sm:text-xs text-gray-500 uppercase tracking-wider">
                          {platforms[file.platform].desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : showDownloading ? (
                <div className="text-center">
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
                      {selectedFile || fileParam}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${started ? "bg-green-500" : "bg-orange-500"} animate-[progress_1.2s_ease_infinite]`}
                        style={{ width: started ? "100%" : "60%" }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <a
                      href={`${process.env.REACT_APP_API_URL}/help/download?fileName=${encodeURIComponent(selectedFile || fileParam)}`}
                      className="inline-flex items-center gap-2 text-sm sm:text-base px-4 py-2 rounded-lg border border-orange-500/40 text-orange-300 hover:text-white hover:bg-orange-500/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                      </svg>
                      {t("download.restart")}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-300 text-base sm:text-lg">
                    {t("download.chooseFile")}
                  </p>
                </div>
              )}

            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              to={`/${currentLocale || "ru"}/help`}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {t("download.help_short")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default DownloadPage;
