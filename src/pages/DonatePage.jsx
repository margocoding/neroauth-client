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
    labelKey: "donate.services_labels.sberbank",
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
    wip: true,
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
  const phoneGridCols3 = services.length === 6;

  const serviceLabel = (service) =>
    service.labelKey ? t(service.labelKey) : service.label;

  return (
    <div className="space-y-5 sm:space-y-7 py-8 sm:py-12 md:py-16 overflow-x-hidden">
      <header className="text-center w-full max-w-full min-w-0 px-3 sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold neon-text max-w-full mx-auto leading-tight break-words">
          {t("donate.title")}
        </h1>
        <div className="divider mx-auto w-32 h-1 rounded-full mt-3 sm:mt-4 max-w-[min(100%,8rem)]" />
        <p className="text-gray-300 mt-3 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-0.5">
          {t("donate.description")}
        </p>

        <div className="flex flex-col items-center gap-2 sm:gap-3 mt-4 sm:mt-5 min-w-0 w-full">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold neon-text tracking-wide max-w-full px-1 break-words leading-snug">
            {t("donate.service_title")}
          </p>
          <div className="rotate-90">
            <AnimatedArrow
              className="h-11 w-11 sm:h-14 sm:w-14 md:h-16 md:w-16"
              condition={true}
            />
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center px-4">
        <div className="flex flex-col items-center w-full max-w-lg mx-auto text-center">
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

        <div className="w-full max-w-6xl mx-auto flex justify-center">
          <div
            className={`donate-services-grid w-fit max-w-full mx-auto py-2 px-2 sm:py-2.5 sm:px-3 md:py-3 md:px-3.5 rounded-2xl sm:rounded-3xl glass border border-orange-500/30 neon-box bg-gradient-to-br from-orange-500/5 via-black/60 to-orange-600/10 shadow-[0_0_40px_rgba(249,115,22,0.32)]${phoneGridCols3 ? " donate-services-grid--phone-cols-3" : ""}`}
          >
            {services.map((service) => {
              const Wrapper = service.wip ? "div" : Link;
              const wrapperProps = service.wip
                ? {}
                : { to: service.link, target: "_blank", rel: "noopener noreferrer" };

              return (
                <Wrapper
                  key={service.id}
                  {...wrapperProps}
                  className={`relative group py-1.5 px-1 sm:py-2 sm:px-1.5 rounded-xl transition-all duration-200 flex flex-col items-center justify-start text-center w-[4.5rem] sm:w-[4.75rem] md:w-20 ${
                    service.wip
                      ? "cursor-not-allowed"
                      : "hover:bg-orange-500/10 active:bg-orange-500/20"
                  }`}
                >
                  {service.wip && (
                    <div className="absolute inset-0 rounded-2xl pointer-events-none z-10 overflow-hidden">
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[160%] rotate-[-40deg] border-y border-orange-300/40 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-[0.4rem] sm:text-[0.45rem] font-bold text-black text-center py-[2.5px] tracking-[0.15em] uppercase shadow-[0_2px_8px_rgba(249,115,22,0.5)]">
                        W.I.P.
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[160%] rotate-[40deg] border-y border-orange-300/40 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-[0.4rem] sm:text-[0.45rem] font-bold text-black text-center py-[2.5px] tracking-[0.15em] uppercase shadow-[0_2px_8px_rgba(249,115,22,0.5)]">
                        W.I.P.
                      </div>
                    </div>
                  )}
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-xl bg-orange-500/40 blur-lg transition-opacity duration-200 ${service.wip ? "opacity-0" : "opacity-0 group-hover:opacity-70"}`} />
                    <img
                      className={`relative h-10 w-10 sm:h-11 sm:w-11 md:h-[3.25rem] md:w-[3.25rem] object-contain drop-shadow-[0_0_16px_rgba(0,0,0,0.58)] rounded-xl ${
                        service.wip
                          ? ""
                          : "transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
                      }`}
                      src={`/icons/donate/${service.icon}`}
                      alt={serviceLabel(service)}
                    />
                  </div>
                  <span className="mt-1 text-[0.7rem] sm:text-xs md:text-sm text-gray-200/90 font-medium tracking-wide leading-snug text-center">
                    {serviceLabel(service)}
                  </span>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonatePage;