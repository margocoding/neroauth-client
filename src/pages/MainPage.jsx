import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const socials = [
  {
    id: 1,
    href: "https://t.me/neroteam_ru",
    icon: "telegram.svg",
    language: "RU",
  },
  {
    id: 2,
    href: "https://t.me/neroteam_en",
    icon: "telegram.svg",
    language: "EN",
  },
  {
    id: 3,
    href: "https://youtube.com/@nero_team_official",
    icon: "youtube.svg",
  },
  {
    id: 4,
    href: "https://vk.ru/neroteam_ru",
    icon: "vk.svg",
  },
  {
    id: 5,
    href: "https://www.patreon.com/c/NeroTeam",
    icon: "patreon.svg",
  },
  {
    id: 6,
    href: "https://boosty.to/neroteam",
    icon: "boosty.svg",
  },
];

const MainPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <>
      <header>
        <title>{t("page.home.title")}</title>
        <meta name="description" content={t("home.subtitle")} />
        <meta name="keywords" content={t("page.home.keywords")} />
      </header>
      <section className="text-center py-12 sm:py-16 md:py-20 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-400/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-300/6 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 neon-text animate-fadeUpSoft">
            {t("home.title")}
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 text-gray-200 leading-relaxed animate-fadeUpSoft">
            {t("home.subtitle")}
          </p>
          <div className="animate-fadeUpSoft">
            <Link
              to={`/${language}/projects`}
              className="btn-primary px-8 py-4 rounded-lg text-lg sm:text-xl font-bold transition-all duration-300 neon-box flex items-center justify-center group mx-auto"
            >
              <span className="text-center">{t("home.cta")}</span>
            </Link>
          </div>

          <div className="flex gap-3 w-full justify-center mt-10">
            {socials.map((social) => (
              <Link to={social.href} className="relative p-1">
                {social.language && (
                  <span className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-1.5 py-0.5 rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {social.language}
                  </span>
                )}
                <img
                  src={"/icons/social/" + social.icon}
                  className="h-16 w-16"
                  alt="social icon"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainPage;
