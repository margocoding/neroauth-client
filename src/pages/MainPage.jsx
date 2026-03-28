import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const socials = [
  {
    id: 1,
    href: "https://t.me/neroteam_links",
    icon: "telegram.svg",
  },
  {
    id: 2,
    href: "https://youtube.com/@nero_team_official",
    icon: "youtube.svg",
  },
  {
    id: 3,
    href: "https://vk.ru/neroteam_ru",
    icon: "vkontakte.svg",
  },
  {
    id: 4,
    href: "https://www.patreon.com/c/NeroTeam",
    icon: "patreon.svg",
  },
  {
    id: 5,
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
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-400/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-300/6 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 neon-text animate-fadeUpSoft">
            {t("home.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 text-gray-200 leading-relaxed animate-fadeUpSoft">
            {t("home.subtitle")}
          </p>

          {/* CTA Button */}
          <div className="animate-fadeUpSoft">
            <Link
              to={`/${language}/projects`}
              className="btn-primary px-8 py-4 rounded-lg text-lg sm:text-xl font-bold transition-all duration-300 neon-box flex items-center justify-center group mx-auto"
            >
              <span className="text-center">{t("home.cta")}</span>
            </Link>
          </div>

          {/* Socials Group — исправлены отступы на мобильных */}
          <div className="mt-10 flex justify-center">
            <div className="socials-grid inline-flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-2 sm:py-2.5 rounded-2xl glass border border-orange-500/20 neon-box">
              {socials.map((social) => (
                <Link
                  key={social.id}
                  to={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group p-1 sm:p-2 rounded-xl transition-all duration-200 hover:bg-orange-500/10 active:bg-orange-500/20 flex items-center justify-center"
                >
                  {social.language && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-[9px] sm:text-[10px] font-bold px-1 py-0.5 rounded-full border border-black/20 shadow-sm z-10 leading-tight">
                      {social.language}
                    </span>
                  )}
                  <img
                    src={"/icons/social/" + social.icon}
                    className="h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 object-contain transition-transform duration-200 hover:scale-105 active:scale-95"
                    alt={social.icon.replace(".svg", "")}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainPage;