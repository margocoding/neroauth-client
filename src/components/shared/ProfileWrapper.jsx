import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../store/user";
import { useVerifyAuth } from "../../utils/hooks/verifyAuth";
import i18next from "i18next";

const ProfileWrapper = () => {
  const { user, setUser, isLoading, fetchUser } = useUser();
  const navigate = useNavigate();

  // Проверка авторизации (токен, валидность и т.д.)
  useVerifyAuth();

  // Редирект на страницу авторизации, если пользователь не загружен
  useEffect(() => {
    if (!isLoading && !user) {
      navigate(`/${i18next.language}/auth`, { replace: true });
    }
  }, [isLoading, user, navigate]);

  // Показываем ничего, пока идёт загрузка или пользователь не определён
  if (isLoading || !user) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-white">
      <Outlet context={{ user, setUser, fetchUser }} />
    </div>
  );
};

export default ProfileWrapper;