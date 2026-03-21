import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import i18next from "i18next";

const ProfileWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    if (!localStorage.getItem('refreshToken')) {
      navigate(`/${i18next.language}/auth`, { replace: true });
      return;
    }

    setLoading(true);
    try {
      const data = await userApi.fetchProfile();
      setUser(data);
    } catch (error) {
      console.error("ProfileWrapper: Failed to fetch user", error);
      navigate(`/${i18next.language}/auth`, { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-white">
      <Outlet context={{ user, setUser, fetchUser }} />
    </div>
  );
};

export default ProfileWrapper;
