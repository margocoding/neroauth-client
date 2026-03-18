import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useUser } from "../../store/user";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

const ProfileNavigationMenu = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { user, setUser, isLoading } = useUser();

  const [opened, setOpened] = useState(false);

  const ref = useRef();

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

  if (isLoading) return <Spinner />;

  if (!user)
    return (
      <Link to={"/auth"} className="max-md:hidden">
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
        <Avatar className="md:h-12 md:w-12 h-10 w-10" path={user.avatar} />
      </button>
      {opened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="neon-box min-w-[300px] top-18 z-40 md:left-1/2 md:-translate-x-1/2 max-md:right-0 p-3 space-y-3 bg-[#111] rounded-xl absolute "
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
