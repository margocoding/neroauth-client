import { useTranslation } from "react-i18next";
import TelegramPosts from "../components/shared/TelegramPosts";

const PostsPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <>
      <header>
        <title>{t("page.news.title")}</title>
        <meta name="description" content={t("news.subtitle")} />
        <meta name="keywords" content={t("page.news.keywords")} />
      </header>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold neon-text">{t("news.title")}</h1>
        <div className="divider mx-auto w-32 h-1 rounded-full mt-4"></div>
        <p className="text-gray-300 mt-3 max-w-2xl mx-auto text-lg leading-relaxed">
          {t("news.subtitle") || "Discover our latest news and innovations"}
        </p>
      </div>
      <div className="news-page-container w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <TelegramPosts locale={language} />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .news-page-container {
            padding: 0 0.5rem;
            overflow-x: visible;
          }

          .news-title {
            font-size: 1.75rem;
            line-height: 2rem;
          }

          .news-subtitle {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .news-page-container {
            padding: 0 1rem;
          }

          .news-title {
            font-size: 2rem;
            line-height: 2.25rem;
          }

          .news-subtitle {
            font-size: 1rem;
            line-height: 1.5rem;
          }
        }

        @media (min-width: 769px) {
          .news-page-container {
            padding: 0 2rem;
          }

          .news-title {
            font-size: 2.5rem;
            line-height: 3rem;
          }

          .news-subtitle {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default PostsPage;
