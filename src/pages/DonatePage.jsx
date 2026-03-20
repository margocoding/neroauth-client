import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AnimatedArrow from "../components/ui/AnimatedArrow";
import { motion } from "framer-motion";

const russiaServices = [
  {
    id: "sber",
    link: "https://messenger.online.sberbank.ru/sl/BluYH8uEdFFvZFvWf",
    icon: "sberbank.svg",
    label: "СберБанк",
  },
  {
    id: "boosty",
    link: "https://boosty.to/neroteam/donate",
    icon: "boosty.svg",
    label: "Boosty",
  },
  {
    id: "patreon",
    link: "https://www.patreon.com/c/NeroTeam",
    icon: "patreon.svg",
    label: "Patreon",
  },
  {
    id: "vk-tanody",
    link: "https://vk.com/app6471849_-207410409",
    icon: "tanody.jpg",
    label: "Таноды (СБП)",
  },
  {
    id: "vk-donate-cake",
    link: "https://vk.com/app6887721_-207410409",
    icon: "donate-cake.jpg",
    label: "Keksik (СБП)",
  },
  {
    id: "crypto-bot",
    link: "https://t.me/send?start=IVTmDvcdzJFt",
    icon: "cryptobot.png",
    label: "Crypto Bot",
  },
];

const worldServices = [
  {
    id: "patreon",
    link: "https://www.patreon.com/c/NeroTeam",
    icon: "patreon.svg",
    label: "Patreon",
  },
  {
    id: "boosty",
    link: "https://boosty.to/neroteam/donate",
    icon: "boosty.svg",
    label: "Boosty",
  },
  {
    id: "crypto-bot",
    link: "https://t.me/send?start=IVTmDvcdzJFt",
    icon: "cryptobot.png",
    label: "Crypto Bot",
  },
];

const DonatePage = () => {
  const { t } = useTranslation();
  const [region, setRegion] = useState("russia");

  const services = region === "russia" ? russiaServices : worldServices;

  return (
    <div className="space-y-10 sm:space-y-12 py-12 sm:py-16 md:py-20">
      <header className="text-center w-full flex flex-col items-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 neon-text animate-fadeUpSoft drop-shadow-[0_0_25px_rgba(249,115,22,0.65)]">
          {t("donate.title")}
        </h1>
        <p className="text-base sm:text-lg max-w-3xl mx-auto mb-6 sm:mb-8 text-gray-200/90 leading-relaxed animate-fadeUpSoft">
          {t("donate.description")}
        </p>

        <div className="animate-fadeUpSoft flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <p className="text-2xl sm:text-3xl neon-text font-semibold tracking-wide">
            {t("donate.service_title")}
          </p>
          <div className="rotate-90 mb-1">
            <AnimatedArrow className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" condition={true} />
          </div>
        </div>

        {/* Region Switcher */}
        <div className="animate-fadeUpSoft delay-100">
          <div className="inline-flex items-center p-1 rounded-full glass border border-orange-500/40 neon-box backdrop-blur-xl shadow-[0_0_35px_rgba(249,115,22,0.45)] relative">
            
            {/* Russia Button */}
            <button
              type="button"
              onClick={() => setRegion("russia")}
              className={`relative px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors duration-200 z-10 ${
                region === "russia"
                  ? "text-black"
                  : "text-gray-200/80 hover:text-white hover:bg-orange-500/10"
              }`}
            >
              {region === "russia" && (
                <motion.div
                  layoutId="activeRegion"
                  className="absolute inset-0 bg-orange-500 rounded-full shadow-[0_0_18px_rgba(249,115,22,0.9)] -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {t("donate.regions.russia")}
            </button>

            {/* World Button */}
            <button
              type="button"
              onClick={() => setRegion("world")}
              className={`relative px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors duration-200 z-10 ${
                region === "world"
                  ? "text-black"
                  : "text-gray-200/80 hover:text-white hover:bg-orange-500/10"
              }`}
            >
              {region === "world" && (
                <motion.div
                  layoutId="activeRegion"
                  className="absolute inset-0 bg-orange-500 rounded-full shadow-[0_0_18px_rgba(249,115,22,0.9)] -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {t("donate.regions.world")}
            </button>
            
          </div>
          <p className="mt-3 text-xs sm:text-sm text-gray-300/80 max-w-md mx-auto">
            {region === "russia"
              ? t("donate.region_hint.russia")
              : t("donate.region_hint.world")}
          </p>
        </div>
      </header>

      {/* Donation Services Grid */}
      <main className="flex justify-center px-4">
        <div className="w-full max-w-4xl mx-auto flex justify-center">
          <div className="donate-grid flex flex-wrap justify-center sm:grid sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 rounded-3xl glass border border-orange-500/30 neon-box max-w-full bg-gradient-to-br from-orange-500/5 via-black/60 to-orange-600/10 shadow-[0_0_45px_rgba(249,115,22,0.35)]">
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group p-3 sm:p-4 rounded-2xl transition-all duration-200 hover:bg-orange-500/10 active:bg-orange-500/20 flex flex-col items-center justify-center text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-orange-500/40 blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-200" />
                  <img
                    className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-transform duration-200 group-hover:scale-110 group-active:scale-95 drop-shadow-[0_0_18px_rgba(0,0,0,0.6)] rounded-xl"
                    src={`/icons/donate/${service.icon}`}
                    alt={service.label || service.icon}
                  />
                </div>
                <span className="mt-2 text-[0.7rem] sm:text-xs md:text-sm text-gray-200/90 font-medium tracking-wide leading-snug line-clamp-2">
                  {service.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonatePage;