import { useTranslation } from "react-i18next";

const badgeClass = {
  author:
    "border-orange-400/45 bg-orange-500/15 text-orange-100 shadow-[0_0_12px_rgba(249,115,22,0.12)]",
  reverse_engineering:
    "border-cyan-400/40 bg-cyan-500/10 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.1)]",
};

const ProjectBadges = ({ badges, className = "" }) => {
  const { t } = useTranslation();
  if (!badges?.length) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      role="list"
      aria-label={t("projects.badges_label")}
    >
      {badges.map((key) => (
        <span
          key={key}
          role="listitem"
          className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-semibold tracking-wide border backdrop-blur-sm ${badgeClass[key] ?? "border-zinc-500/40 bg-zinc-800/60 text-zinc-200"}`}
        >
          {t(`projects.badges.${key}`)}
        </span>
      ))}
    </div>
  );
};

export default ProjectBadges;
