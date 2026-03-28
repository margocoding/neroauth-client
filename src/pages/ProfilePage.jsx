import { useTranslation } from "react-i18next";
import { useUser } from "../store/user";
import MainInformation from "../components/shared/profile-sections/main-information/MainInformation";
import LoadingPage from "./LoadingPage";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, isLoading } = useUser();

  if (isLoading || !user) return <LoadingPage />;

  return (
    <div className="flex flex-col justify-center gap-5 max-w-[500px] mx-auto">
      <div className="text-center mb-0">
        <h2 className="font-semibold text-3xl">
          {t("profile.title")}
        </h2>
        <div className="divider mx-auto w-32 h-1 rounded-full mt-4"></div>
      </div>
      <MainInformation 
        avatar={user.avatar} 
        login={user.login} 
        inviteCode={user.inviteCode} 
      />
    </div>
  );
}