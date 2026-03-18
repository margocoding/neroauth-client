import { Outlet, useNavigate } from "react-router-dom";
import { useVerifyAuth } from "../../utils/hooks/verifyAuth";
import { useUser } from "../../store/user";

const ProfileWrapper = () => {
  const { isLoading, user } = useUser();

  const navigate = useNavigate();

  useVerifyAuth();

  if (!isLoading && !user) return navigate("/auth");

  return (
    <div className="max-w-[500px] mx-auto">
      <Outlet />
    </div>
  );
};

export default ProfileWrapper;
