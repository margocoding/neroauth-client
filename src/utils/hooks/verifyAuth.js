import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/user";
import i18next from "i18next";

export const useVerifyAuth = () => {
  const { isLoading, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Если загрузка завершена и пользователя нет — редирект на авторизацию
    if (!isLoading && !user) {
      navigate(`/${i18next.language}/auth`, { replace: true });
    }
  }, [isLoading, user, navigate]);

  return null;
};