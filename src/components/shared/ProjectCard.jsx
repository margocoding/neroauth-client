import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const isComingSoon =
    project?.comingSoon === true || project?.status === "coming_soon";

  const getLocalizedProjectPath = (projectId) => {
    const base = `/${language}/projects/${projectId}`;
    return base;
  };

  return (
    <div className="card neon-box group rounded-xl overflow-hidden project-card relative">
      <div className="relative w-full aspect-[1/1] overflow-hidden rounded-xl">
        {isComingSoon && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-orange-500/90 text-white shadow">
              {t("project.comingSoon")}
            </span>
          </div>
        )}
        <img
          src={
            project.id === "magnate_bot"
              ? `/magnate/${language || "ru"}/splash.png`
              : project.labelImage
          }
          alt={t(project.title)}
          width={1024}
          height={1024}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`project-image object-cover transition-transform duration-500 ease-out ${isComingSoon ? "grayscale brightness-90" : ""}`}
          priority
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4 sm:p-5 md:p-6 relative flex flex-col flex-1">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 neon-text text-center -mt-1 sm:-mt-4">
          {t(project.title)}
        </h2>
        {isComingSoon ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="btn-disabled px-4 py-3 rounded-md font-bold w-full mt-auto flex items-center justify-center transition-all duration-300"
            style={{
              width: "100%",
              minWidth: "100%",
              boxSizing: "border-box",
              lineHeight: "1",
              textAlign: "center",
              transformOrigin: "center",
              transform: "translateZ(0)",
              willChange: "transform",
              position: "relative",
              overflow: "hidden",
              fontSize: "0.95rem",
              letterSpacing: "0.025em",
              minHeight: "48px",
            }}
          >
            <span className="text-center">{t("project.comingSoonButton")}</span>
          </button>
        ) : (
          <Link
            to={getLocalizedProjectPath(project.id)}
            className="btn-primary px-4 py-3 rounded-md font-bold transition-all duration-300 neon-box flex items-center justify-center group/btn w-full text-base sm:text-lg mt-auto"
            style={{ width: "100%", minWidth: "100%", boxSizing: "border-box" }}
          >
            <span className="text-center">{t("card.more")}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
