import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/user";

export const useVerifyAuth = () => {
  const { isLoading, user } = useUser();

  const navigate = useNavigate();

  if (!user && !isLoading) navigate("/auth");

  return null;
};
