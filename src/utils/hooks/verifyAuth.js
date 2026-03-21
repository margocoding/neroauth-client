import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/user";
import { exceptAxiosError } from "../exceptAxiosError";
import { authApi } from "../../api/authApi";
import i18next from "i18next";

export const useVerifyAuth = () => {
  const { isLoading, user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Если загрузка завершена и пользователя нет — редирект на авторизацию
    if (!isLoading && !user) {
      navigate(`/${i18next.language}/auth`, { replace: true });
      return;
    }

    // Если пользователь есть — пробуем обновить токен
    if (user) {
      const refreshToken = async () => {
        const { success } = await exceptAxiosError(() => authApi.refreshToken());
        if (!success) {
          // Токен недействителен — очищаем стейт и редиректим
          setUser(null);
          navigate(`/${i18next.language}/auth`, { replace: true });
        }
      };

      refreshToken();
    }
  }, [isLoading, user, navigate, setUser]);

  return null;
};