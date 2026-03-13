import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import MainInformation from "../components/shared/profile-sections/main-information/MainInformation";
import { useVerifyAuth } from "../utils/hooks/verifyAuth";

export default function ProfilePage() {
  useVerifyAuth();

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user?._id) navigate(`/${language}/auth`);
  }, [loading, user?._id, language, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await userApi.fetchProfile();

      setUser(data);

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (!user) return;

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
