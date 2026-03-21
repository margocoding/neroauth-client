import { useTranslation } from "react-i18next";
import Sessions from "../components/shared/profile-sections/sessions/Sessions";

const SecurityPage = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-5 max-w-[500px] mx-auto">
      <h2 className="font-semibold text-3xl text-center">
        {t("security.title")}
      </h2>
      <Sessions />
    </div>
  );
};

export default SecurityPage;
