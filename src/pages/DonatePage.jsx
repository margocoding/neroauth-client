import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AnimatedArrow from "../components/ui/AnimatedArrow";

const DonatePage = () => {
  const { t } = useTranslation();

  const services = t('donate.services', { returnObjects: true });

  return (
    <div className="space-y-8 sm:space-y-10 py-12 sm:py-16 md:py-20">
      <header className="text-center w-full flex flex-col items-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 neon-text animate-fadeUpSoft">
          {t("donate.title")}
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 text-gray-200 leading-relaxed animate-fadeUpSoft">
          {t("donate.description")}
        </p>

        
        <div className="animate-fadeUpSoft flex flex-col items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <p className="text-2xl sm:text-3xl neon-text font-bold">
            {t('donate.service_title')}
          </p>
          <div className="rotate-90">
            <AnimatedArrow className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" condition={true} />
          </div>
        </div>
      </header>

      {/* Donation Services Grid */}
      <main className="flex justify-center px-4 -mt-2 sm:-mt-4">
        <div className="donate-grid inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl glass border border-orange-500/20 neon-box max-w-full">
          {services.map((service) => (
            <Link
              key={service.id}
              to={service.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group p-2 sm:p-3 rounded-xl transition-all duration-200 hover:bg-orange-500/10 active:bg-orange-500/20 min-w-[3rem] min-h-[3rem] sm:min-w-[3.5rem] sm:min-h-[3.5rem] flex items-center justify-center"
            >
              <img
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-transform duration-200 hover:scale-105 active:scale-95 drop-shadow-lg rounded-lg"
                src={`/icons/${service.icon}`}
                alt={service.name || service.icon}
              />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DonatePage;