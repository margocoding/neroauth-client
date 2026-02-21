import { useTranslation } from "react-i18next";
import { languages } from "../../i18n/i18n";
import { Outlet, Navigate, useParams, useLocation, useSearchParams } from "react-router-dom";

const LanguageWrapper = () => {
  const { locale } = useParams();
  const location = useLocation();
  const { i18n: {language, changeLanguage} } = useTranslation();
  const [searchParams] = useSearchParams();

  if (!locale || !languages.includes(locale)) {
    const detected = language?.split('-')[0] || "ru";

    console.log(detected);


    const restPath = location.pathname.split("/").slice(1).join("/");

    return (
      <Navigate
        to={`/${detected}/${restPath}?${searchParams.toString()}`}
        replace
      />
    );
  }

  if (language !== locale) {
    changeLanguage(locale);
  }

  return <Outlet />;
};

export default LanguageWrapper;
