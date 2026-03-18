import { useTranslation } from "react-i18next";
import MainInformation from "../components/shared/profile-sections/main-information/MainInformation";
import { useUser } from "../store/user";
import LoadingPage from "./LoadingPage";

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  const { t } = useTranslation();

  if (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col justify-center gap-5">
      <h2 className="text-3xl text-center font-semibold">
        {t("profile.title")}
      </h2>

      <MainInformation
        avatar={user.avatar}
        inviteCode={user.inviteCode}
        login={user.login}
      />
    </div>
  );
}
