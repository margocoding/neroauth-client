import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AnimatedArrow from "../components/ui/AnimatedArrow";


const DonatePage = () => {
    const { t } = useTranslation();


    const services = t('donate.services', {returnObjects: true})

    return <div className="space-y-10">
        <header className="text-center w-full gap-3 flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 neon-text animate-fadeUpSoft">
                {t("donate.title")}
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 text-gray-200 leading-relaxed animate-fadeUpSoft">
                {t("donate.description")}
            </p>

            <p className="text-2xl neon-text font-medium">{t('donate.service_title')}</p>
            <p className="rotate-90">
                
            <AnimatedArrow className={'h-16 w-16'} condition={true}/>
            </p>
        </header>

        <main className="flex gap-3 justify-center w-full">
            {services.map(service => <Link key={service.id} to={service.link}>
                <img className="rounded-xl bg-white p-1 h-20 w-20" src={`/icons/${service.icon}`} alt={service.icon} />
            </Link>
            )}
        </main>
    </div>;
}

export default DonatePage;