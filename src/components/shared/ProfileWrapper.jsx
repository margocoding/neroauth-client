import { Outlet } from "react-router-dom";
import { useVerifyAuth } from "../../utils/hooks/verifyAuth";
import { useUser } from "../../store/user";
import LoadingPage from "../../pages/LoadingPage";

const ProfileWrapper = () => {
  const {isLoading} = useUser();
  useVerifyAuth();

  if(isLoading) return <LoadingPage/>

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-white">
      <Outlet context={{ user, setUser, fetchUser }} />
    </div>
  );
};

export default ProfileWrapper;