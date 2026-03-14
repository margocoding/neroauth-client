import { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../ui/Avatar";
import { useTranslation } from "react-i18next";
import { userApi } from "../../api/userApi";
import AnimatedArrow from "../ui/AnimatedArrow";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { motion } from "framer-motion";

const ProfileNavigationMenu = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);

  const ref = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await userApi.fetchProfile();

      setUser(data);

      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    setOpened(false);
    setUser(null);
    navigate("/");
  }, [navigate]);

  const handleClose = useCallback(() => setOpened(false), []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user)
    return (
      <Link to={"/auth"}>
        <Button>{t("auth.authButton")}</Button>
      </Link>
    );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpened((prev) => !prev)}
        className="inline-flex items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer focus:outline-none"
        aria-label={t("profile.menu")}
      >
        <Avatar className="h-12 w-12" path={user.avatar} />
      </button>
      {opened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="neon-box min-w-[300px] top-18 z-40 left-1/2 -translate-x-1/2 p-3 space-y-3 bg-[#111] rounded-xl absolute "
        >
          <div className="flex flex-col gap-3 justify-center border-b border-gray-600 pb-3">
            <div className="w-full flex flex-col gap-3 items-center">
              <Avatar className={"h-20 w-20"} path={user.avatar} />
              <div className="text-xl font-semibold">{user.login}</div>
            </div>
            <div>
              <Link to="/profile" className="text-gray-500 flex">
                <Button onClick={handleClose} color="fade" className={"w-full"}>
                  {t("profile.buttons.open")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-b border-gray-600 pb-3">
            <Link to="/profile/security">
              <Button onClick={handleClose} className={"w-full"}>
                {t("security.title")}
              </Button>
            </Link>
            <Link to="/profile/friends">
              <Button onClick={handleClose} className={"w-full"}>
                {t("profile.friend.title")}
              </Button>
            </Link>
          </div>

          <Button className={"w-full"} color="danger" onClick={handleLogout}>
            {t("profile.logout")}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileNavigationMenu;
