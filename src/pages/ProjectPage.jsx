import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { projects } from "./ProjectsPage";
import { useMemo } from "react";
import ScreenshotGallery from "../components/shared/ScreenshotGallery";

const ProjectPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const id = params.id;

  const project = useMemo(
    () => projects.find((project) => project.id === id),
    [id],
  );

  if (!id) return null;

  if (!project) {
    navigate("/404"); // navigate к 404
    return null;
  }

  const screenshots = t(`${id}.screenshots`, { returnObjects: true }) || [];

  return (
    <>
      <header>
        <title>{t("page.project.title", { name: t(project.title) })}</title>
        <meta name="description" content={t(project.description)} />
        <meta
          name="keywords"
          content={t("page.project.keywords", { name: t(project.title) })}
        />
      </header>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="mb-4 -mt-4 md:mt-0">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative">
            {/* Left: Icon */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden neon-box shrink-0 mx-auto md:mx-0">
              <img
                src={
                  project.image ||
                  (typeof project.labelImage === "string"
                    ? project.labelImage
                    : project.labelImage[language] || project.labelImage.default)
                }
                alt={project.title}
                width={160}
                height={160}
                className="object-cover w-full h-full"
                priority
              />
            </div>

            {/* Right: Project Info */}
            <div className="flex-1 max-md:items-center min-w-0 flex flex-col">
              {/* Title and Description */}
              <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 neon-text md:text-left -mt-2 md:mt-0">
                  {t(project.title)}
                </h1>

                {/* Description */}
                <div className="w-full flex md:justify-start">
                  <p
                    className="text-gray-300 mb-1 md:mb-2 leading-tight -mt-2 md:-mt-1 text-sm sm:text-base md:text-lg overflow-hidden whitespace-pre-wrap"
                  >
                    {t(project.description)}
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Action Button - download or play - positioned at bottom of icon */}
            <div className="flex justify-center md:justify-start md:absolute md:bottom-0 md:left-40 md:ml-6 -mt-4 md:mt-0">
              {project.type === "play" ? (
                <a
                  href={project.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-4 md:px-12 md:py-3 rounded-lg text-lg md:text-lg font-bold transition-all duration-300 neon-box flex items-center justify-center group"
                >
                  <span className="text-center">
                    {t(`project.${project.type}`)}
                  </span>
                </a>
              ) : project.file ? (
                <a
                  href={`/${language || "ru"
                    }/download?file=${encodeURIComponent(project.file)}`}
                  className="btn-primary px-8 py-4 md:px-12 md:py-3 rounded-lg text-lg md:text-lg font-bold transition-all duration-300 neon-box flex items-center justify-center group"
                >
                  <span className="text-center">
                    {t(`project.${project.type}`)}
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Screenshots Gallery */}
        {screenshots.length > 0 && (
          <section className="mb-0 -mt-2 md:mt-0">
            <ScreenshotGallery screenshots={screenshots} />
          </section>
        )}

        {project.logo && (
          <div className="mt-6 mb-2 md:mt-8 md:mb-3">
            {/* Разделитель */}
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>
            </div>

            {/* Логотип */}
            <div className="flex justify-center">
              <img
                src={project.logo}
                alt={project.title}
                className={`h-auto object-contain relative z-10 ${
                  project.id === "nero_troops" || project.id === "magnate_bot"
                    ? "w-72 sm:w-80 md:w-96 lg:w-[32rem]"
                    : "w-48 sm:w-56 md:w-64 lg:w-72"
                }`}
                width={250}
                height={100}
                priority="true"
              />
            </div>
          </div>
        )}

        {/* Project Details */}
        <section className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 p-1 neon-text">
              {t("project.details")}
            </h2>
          </div>

          <div className="relative rounded-xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto neon-box">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg overflow-hidden whitespace-pre-line">
                {t(project.details)}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-8">
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 max-w-3xl mx-auto text-center">
            <p className="text-red-500 font-bold text-sm sm:text-base leading-relaxed">
              {t("project.disclaimer")}
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectPage;
