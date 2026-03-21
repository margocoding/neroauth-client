import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { FaUser, FaShieldAlt, FaUsers, FaSignOutAlt } from "react-icons/fa";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const ref = useRef(null);

  // Отслеживание размера экрана
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Логаут
  const handleLogout = useCallback(async () => {
    await authApi.logout();
    setOpened(false);
    setUser(null);
    navigate("/");
  }, [navigate, setUser]);

  const handleClose = useCallback(() => setOpened(false), []);

  // Закрытие по клику вне меню (только десктоп)
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClose();
      }
    }

    if (opened && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [opened, isMobile, handleClose]);

  // Блокировка скролла при открытом мобильном меню
  useEffect(() => {
    if (opened && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [opened, isMobile]);

  // Рендер заглушек
  if (isLoading) return <Spinner />;

  if (!user) {
    if (isMobile) return null;
    return (
      <Link to="/auth" className="max-md:hidden">
        <Button>{t("auth.authButton")}</Button>
      </Link>
    );
  }

  // Элементы меню
  const menuItems = [
    {
      to: "/profile",
      icon: <FaUser className="text-lg" />,
      label: t("profile.buttons.open"),
    },
    {
      to: "/profile/security",
      icon: <FaShieldAlt className="text-lg" />,
      label: t("security.title"),
    },
    {
      to: "/profile/friends",
      icon: <FaUsers className="text-lg" />,
      label: t("profile.friend.title"),
    },
  ];

  // Контент меню (вынесен для чистоты)
  const MenuContent = () => (
    <AnimatePresence>
      {opened && (
        <>
          {/* Бэкдроп для мобильных */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]"
            />
          )}

          {/* Контейнер меню */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 10 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag={isMobile ? "y" : false}
            dragConstraints={isMobile ? { top: 0 } : {}}
            dragElastic={isMobile ? { top: 0, bottom: 0.5 } : 0}
            onDragEnd={(_, info) => {
              if (isMobile && info.offset.y > 100) {
                handleClose();
              }
            }}
            className={`
              ${
                isMobile
                  ? "fixed bottom-0 left-0 right-0 rounded-t-3xl z-[1001] pb-10 cursor-grab active:cursor-grabbing"
                  : "absolute right-0 top-14 w-72 rounded-2xl z-50"
              }
              bg-[#0d0d0d] border border-white/10 shadow-xl overflow-hidden
            `}
          >
            {/* Индикатор для драга на мобильных */}
            {isMobile && (
              <div className="w-full flex justify-center py-4 border-b border-white/5">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>
            )}

            {/* Шапка профиля */}
            <div className="p-5 flex flex-col items-center border-b border-white/5">
              <Avatar className="h-20 w-20" path={user.avatar} />
              <h3 className="mt-3 text-xl font-bold text-white">{user.login}</h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                {user.email || "Nero Team User"}
              </p>
            </div>

            {/* Навигация */}
            <div className="p-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleClose}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-orange-500 group-hover:bg-zinc-800 transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-base font-medium text-gray-200 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Кнопка выхода */}
            <div className="p-2 border-t border-white/5 mt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-red-500/5 transition-colors group text-red-500"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                  <FaSignOutAlt className="text-lg" />
                </span>
                <span className="text-base font-medium group-hover:text-red-400 transition-colors">
                  {t("profile.logout")}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpened((prev) => !prev)}
        className="flex items-center justify-center p-0 rounded-full hover:opacity-80 transition-opacity focus:outline-none"
        aria-label={t("profile.menu")}
      >
        <Avatar className="h-10 w-10 md:h-11 md:w-11" path={user.avatar} />
      </button>

      {isMobile ? createPortal(<MenuContent />, document.body) : <MenuContent />}
    </div>
  );
};

export default ProfileNavigationMenu;