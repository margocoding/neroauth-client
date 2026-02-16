import { lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LanguageWrapper from "./components/shared/LanguageWrapper";
import MobileOptimizer from "./components/shared/MobileOptimizer";
import Button from "./components/ui/Button";
import { languages } from "./i18n/i18n";
import GameCross from "./components/ui/GameCross";

const MainPage = lazy(() => import("./pages/MainPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const PostsPage = lazy(() => import("./pages/PostsPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const DownloadPage = lazy(() => import("./pages/DownloadPage"));

const App = () => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchParams] = useSearchParams();

  const isGame = searchParams.get('isGame');

  const navigate = useNavigate();
  const location = useLocation();

  const normalizePath = (input) => {
    let p = input || "/";
    if (!p.startsWith("/")) p = "/" + p;
    while (
      p === "/en" ||
      p.startsWith("/en/") ||
      p === "/ru" ||
      p.startsWith("/ru/")
    ) {
      if (p === "/en" || p === "/ru") {
        p = "/";
        break;
      }
      p = p.startsWith("/en/") ? p.slice(3) : p.slice(3);
    }
    return p;
  };

  const getLocalizedPath = (path) => {
    const clean = normalizePath(path);
    return clean === "/" ? `/${urlLocale}` : `/${urlLocale}${clean}`;
  };
  const pathLocale = location.pathname.split("/")[1];
  const initialLocale = languages.includes(pathLocale)
    ? pathLocale
    : language || "en";
  const [urlLocale, setUrlLocale] = useState(initialLocale);

  const handleLocaleSwitch = (newLocale) => {
    if (newLocale === urlLocale) return;
    setUrlLocale(newLocale);
    changeLanguage(newLocale);

    const basePath = normalizePath(location.pathname);
    const target =
      basePath === "/" ? `/${newLocale}` : `/${newLocale}${basePath}`;
    navigate(target, { replace: true });
  };

  // useEffect(() => {
  //   const pathLocale = location.pathname.split("/")[1];
  //   if (languages.includes(pathLocale) && pathLocale !== language) {
  //     changeLanguage(pathLocale);
  //   }
  //   setUrlLocale(
  //     languages.includes(pathLocale) ? pathLocale : language || "en",
  //   );
  // }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate(`/${language}`);
    }
  }, [location.pathname, language, navigate]);

  return (
    <div className="App">
      <ToastContainer />
      <div className="min-h-screen flex flex-col">
        <MobileOptimizer />

        {!isGame &&
          <header className="site-header glass backdrop-blur-md py-3 px-4 md:px-6 neon-box">
            <div className="container mx-auto max-w-6xl flex items-center justify-between gap-4">
              <Link
                to={getLocalizedPath("/")}
                className="inline-flex items-center"
              >
                <img
                  src="/NeroTeam.svg"
                  alt="Nero Team"
                  width={140}
                  height={36}
                  className="neon-image"
                  priority
                />
              </Link>

              {/* Mobile Menu */}
              <div className="flex items-center gap-2 md:hidden">
                <span className="select-wrapper">
                  <select
                    aria-label={t("nav.language")}
                    className="select text-sm"
                    value={urlLocale}
                    onChange={(e) => handleLocaleSwitch(e.target.value)}
                  >
                    <option value="ru">RU</option>
                    <option value="en">EN</option>
                  </select>
                </span>

                <button
                  className="nav-toggle inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded btn-primary text-sm p-0"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Toggle menu"
                >
                  {menuOpen ? "✕" : "☰"}
                </button>
              </div>

              {/* Desktop Menu */}
              <nav className="hidden md:flex items-center gap-4 text-base">
                <Link
                  to={getLocalizedPath("/")}
                  className="link-underline hover-text-accent transition"
                >
                  {t("nav.home")}
                </Link>
                <Link
                  to={getLocalizedPath("/projects")}
                  className="link-underline hover-text-accent transition"
                >
                  {t("nav.projects")}
                </Link>
                <Link
                  to={getLocalizedPath("/help")}
                  className="link-underline hover-text-accent transition"
                >
                  {t("nav.help")}
                </Link>
                <Link
                  to={getLocalizedPath("/news")}
                  className="link-underline hover-text-accent transition"
                >
                  {t("nav.news")}
                </Link>
                <span className="select-wrapper">
                  <select
                    aria-label={t("nav.language")}
                    className="select"
                    value={urlLocale}
                    onChange={(e) => handleLocaleSwitch(e.target.value)}
                  >
                    <option value="ru">RU</option>
                    <option value="en">EN</option>
                  </select>
                </span>
                {localStorage.getItem("token") ? (
                  <Link to={getLocalizedPath("/profile")}>
                    <Button>{t("profile.title")}</Button>
                  </Link>
                ) : (
                  <Link to={getLocalizedPath("/auth")}>
                    <Button>{t("auth.authButton")}</Button>
                  </Link>
                )}
              </nav>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="md:hidden mt-3">
                <div className="container mx-auto max-w-6xl">
                  <nav className="flex flex-col gap-2 p-3 glass rounded-lg">
                    <Link
                      to={getLocalizedPath("/")}
                      className="btn-primary px-3 py-2 rounded-md text-sm w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("nav.home")}
                    </Link>
                    <Link
                      to={getLocalizedPath("/projects")}
                      className="btn-primary px-3 py-2 rounded-md text-sm w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("nav.projects")}
                    </Link>
                    <Link
                      to={getLocalizedPath("/help")}
                      className="btn-primary px-3 py-2 rounded-md text-sm w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("nav.help")}
                    </Link>
                    <Link
                      to={getLocalizedPath("/news")}
                      className="btn-primary px-3 py-2 rounded-md text-sm w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("nav.news")}
                    </Link>

                    {localStorage.getItem("token") ? (
                      <Link
                        to={getLocalizedPath("/profile")}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Button>{t("profile.title")}</Button>
                      </Link>
                    ) : (
                      <Link
                        to={getLocalizedPath("/auth")}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Button>{t("auth.authButton")}</Button>
                      </Link>
                    )}
                  </nav>
                </div>
              </div>
            )}
          </header>
        }

        {isGame && <GameCross />}

        <main className="grow container mx-auto max-w-6xl px-4 md:px-6 py-6 section">

          <Routes>
            <Route path="/:locale/*" element={<LanguageWrapper />}>
              <Route index element={<MainPage />} />

              <Route path="news" element={<PostsPage />} />
              <Route path="news/:id" element={<PostPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="download" element={<DownloadPage />} />
            </Route>
          </Routes>

        </main>

        {!isGame &&
          <footer className="site-footer glass backdrop-blur-md text-center py-4 mt-8 neon-box">
            <p className="text-sm">© 2026 Nero Team. {t("footer.rights")}</p>
          </footer>
        }
      </div>
    </div>
  );
};

export default App;
