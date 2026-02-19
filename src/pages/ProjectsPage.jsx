import { useTranslation } from "react-i18next";
import ProjectCard from "../components/shared/ProjectCard";

export const projects = [
  {
    id: "nero_raiders",
    title: "nr.title",
    description: "nr.desc",
    details: "nr.details",
    labelImage: "/nr/splash.png",
    image: "/nr/icon.png",
    type: "download",
    logo: "/nr/logo.png",
    file: "NeroRaiders130.apk",
  },
  {
    id: "magnate",
    title: "magnate.title",
    description: "magnate.desc",
    details: "magnate.details",
    labelImage: "/magnate/icon.png",
    downloadLink: "https://t.me/game_magnate_bot",
    type: "play",
  },
  {
    id: "nero_troops",
    title: "nero_troops.title",
    description: "nero_troops.desc",
    details: "nero_troops.details",
    labelImage: "/nero_troops/splash.png",
    file: ' ',
    type: 'download',
    comingSoon: true,
  },
];

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <header>
        <title>{t("page.projects.title")}</title>
        <meta name="description" content={t("projects.subtitle")} />
        <meta name="keywords" content={t("page.projects.keywords")} />
      </header>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 neon-text">
          {t("projects.title")}
        </h1>
        <div className="divider mx-auto w-32 h-1 rounded-full mt-4"></div>
        <p className="text-gray-300 mt-3 max-w-2xl mx-auto text-lg leading-relaxed">
          {t("projects.subtitle") ||
            "Discover our latest projects and innovations"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="transform transition-all duration-500 ease-out h-full"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ProjectsPage;
