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
      <div>
        <TelegramPosts locale={language} />
      </div>
    </>
  );
};

export default PostsPage;
