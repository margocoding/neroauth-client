import { useTranslation } from "react-i18next";
import { languages } from "../../i18n/i18n";
import { Outlet, Navigate, useParams, useLocation } from "react-router-dom";

const LanguageWrapper = () => {
  const { locale } = useParams();
  const location = useLocation();
  const { i18n } = useTranslation();

  // если язык невалидный — редиректим СРАЗУ
  if (!locale || !languages.includes(locale)) {
    const detected = i18n.language || "ru";

    // убираем первый сегмент
    const restPath = location.pathname.split("/").slice(1).join("/");

    return (
      <Navigate
        to={`/${detected}/${restPath}`}
        replace
      />
    );
  }

  // если валидный язык — меняем язык
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  return <Outlet />;
};

export default LanguageWrapper;
