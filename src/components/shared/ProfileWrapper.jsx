import { Outlet } from "react-router-dom";
import { useVerifyAuth } from "../../utils/hooks/verifyAuth";
import { useUser } from "../../store/user";
import LoadingPage from "../../pages/LoadingPage";

const ProfileWrapper = () => {
  const {isLoading} = useUser();
  useVerifyAuth();

  if(isLoading) return <LoadingPage/>

  return (
    <div className="max-w-[500px] mx-auto">
      <Outlet />
    </div>
  );
};

export default ProfileWrapper;
