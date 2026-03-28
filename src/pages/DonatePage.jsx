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
    id: "vk-donate-cake",
    link: "https://vk.com/app6887721_-207410409",
    icon: "donate-cake.webp",
    labelKey: "donate.services_labels.keksik",
  },
  {
    id: "vk-tanody",
    link: "https://vk.com/app6471849_-207410409",
    icon: "tanody.webp",
    labelKey: "donate.services_labels.tanody",
  },
  {
    id: "crypto-bot",
    link: "https://t.me/send?start=IVTmDvcdzJFt",
    icon: "cryptobot.webp",
    label: "Crypto Bot",
  },
];

const worldServices = [
  {
    id: "kofi",
    link: "https://t.me/send?start=IVTmDvcdzJFt",
    icon: "KoFi.svg",
    label: "Ko-fi",
  },
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
    icon: "cryptobot.webp",
    label: "Crypto Bot",
  },
];

const DonatePage = () => {
  const { t } = useTranslation();
  const [region, setRegion] = useState("world");

  const services = region === "russia" ? russiaServices : worldServices;

  const serviceLabel = (service) =>
    service.labelKey ? t(service.labelKey) : service.label;

  return (
    <div className="space-y-5 sm:space-y-7 py-8 sm:py-12 md:py-16">
      <header className="text-center w-full px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold neon-text animate-fadeUpSoft drop-shadow-[0_0_25px_rgba(249,115,22,0.65)]">
          {t("donate.title")}
        </h1>
        <div className="divider mx-auto w-32 h-1 rounded-full mt-4" />
        <p className="text-gray-300 mt-3 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed animate-fadeUpSoft">
          {t("donate.description")}
        </p>

        <div className="animate-fadeUpSoft flex flex-col items-center gap-2 sm:gap-3 mt-4 sm:mt-5">
          <p className="text-xl sm:text-2xl md:text-3xl neon-text font-semibold tracking-wide">
            {t("donate.service_title")}
          </p>
          <div className="rotate-90">
            <AnimatedArrow className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20" condition={true} />
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center px-4">
        <div className="animate-fadeUpSoft delay-100 flex flex-col items-center w-full max-w-lg mx-auto text-center">
          <div className="inline-flex items-center p-1 rounded-full glass border border-orange-500/40 neon-box backdrop-blur-xl shadow-[0_0_35px_rgba(249,115,22,0.45)] relative">
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
          </div>
          <p className="my-5 sm:my-6 text-xs sm:text-sm text-gray-300/80 max-w-sm mx-auto leading-relaxed px-2 sm:px-3">
            {region === "russia"
              ? t("donate.region_hint.russia")
              : t("donate.region_hint.world")}
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto flex justify-center">
          <div
            className="donate-services-grid p-3 sm:p-4 md:p-5 rounded-3xl glass border border-orange-500/30 neon-box bg-gradient-to-br from-orange-500/5 via-black/60 to-orange-600/10 shadow-[0_0_45px_rgba(249,115,22,0.35)]"
            style={{ gridTemplateColumns: `repeat(${services.length > 4 ? 3 : 2}, auto)` }}
          >
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group p-3 sm:p-4 rounded-2xl transition-all duration-200 hover:bg-orange-500/10 active:bg-orange-500/20 flex flex-col items-center justify-start text-center w-20 sm:w-24"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-orange-500/40 blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-200" />
                  <img
                    className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-transform duration-200 group-hover:scale-110 group-active:scale-95 drop-shadow-[0_0_18px_rgba(0,0,0,0.6)] rounded-xl"
                    src={`/icons/donate/${service.icon}`}
                    alt={serviceLabel(service)}
                  />
                </div>
                <span className="mt-2 text-[0.7rem] sm:text-xs md:text-sm text-gray-200/90 font-medium tracking-wide leading-snug text-center">
                  {serviceLabel(service)}
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