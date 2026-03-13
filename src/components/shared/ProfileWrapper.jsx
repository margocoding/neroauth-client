import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";

const ProfileWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await userApi.fetchProfile();

      setUser(data);

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (!loading && !user) return navigate("/auth");

  return (
    <div className="max-w-[500px] mx-auto">
      <Outlet />
    </div>
  );
};

export default ProfileWrapper;
