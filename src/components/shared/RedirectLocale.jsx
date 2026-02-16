import { Navigate, useLocation } from "react-router-dom";
import i18next from "../../i18n/i18n";

const languages = ["ru", "en"];

const RedirectToLocale = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const firstSegment = pathname.split("/")[1];

  if (languages.includes(firstSegment)) {
    return null;
  }

  const detected = i18next.language || "ru";

  return (
    <Navigate
      to={`/${detected}${pathname}`}
      replace
    />
  );
};

export default RedirectToLocale;
