import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ScreenshotGallery from "../components/shared/ScreenshotGallery";
import { FiArrowLeft, FiClock } from "react-icons/fi";

export default function PostPage() {
  const navigate = useNavigate();
  const params = useParams();
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const id = params.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/posts/${language}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => setPost(data))
      .catch(() => navigate("/404"))
      .finally(() => setLoading(false));
  }, [id, language, navigate]);

  const formattedDate = useMemo(() => {
    if (!post?.date) return null;
    const raw = post.date;
    let timestamp;
    if (typeof raw === "number") {
      timestamp = raw > 1e12 ? raw : raw * 1000;
    } else {
      const parsed = Date.parse(raw);
      timestamp = Number.isNaN(parsed) ? Date.now() : parsed;
    }
    return new Date(timestamp).toLocaleDateString(
      language === "ru" ? "ru-RU" : "en-US",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );
  }, [post?.date, language]);

  const paragraphs = useMemo(() => {
    if (!post?.message) return [];
    return post.message
      .split(/\n/)
      .map((chunk) => chunk.trim())
      .filter(Boolean);
  }, [post?.message]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 text-sm uppercase">
            {language === "ru" ? "ЗАГРУЗКА" : "LOADING"}
          </p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const screenshots = post.media?.photo?.url
    ? [{ image: post.media.photo.url }]
    : [];
  const title = post.message?.split("\n")[0]?.slice(0, 120) || t("news.title");
  const leadParagraph = paragraphs[0];
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <>
      <header>
        <title>{t("page.project.title", { name: title })}</title>
        <meta name="description" content={post.message} />
        <meta
          name="keywords"
          content={t("page.project.keywords", { name: title })}
        />
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to={`/${language}/news`}
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-orange-200/80 hover:text-white transition-colors group"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            {language === "ru" ? "Назад к новостям" : "Back to news"}
          </Link>

          {formattedDate && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300 font-medium">
              <FiClock className="text-orange-300" />
              {formattedDate}
            </div>
          )}
        </div>

        <section className="relative overflow-hidden rounded-[32px] border border-orange-500/20 bg-gradient-to-br from-[#09080b] via-[#15131b]/95 to-[#09080b] px-6 sm:px-8 py-10 sm:py-12 shadow-[0_10px_60px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-10 w-64 h-64 bg-orange-500/15 blur-[150px]"></div>
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-orange-400/10 blur-[160px]"></div>
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_60%)]"></div>
            <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] animate-[shimmer_10s_linear_infinite]"></div>
          </div>

          <div>
            <div className="relative rounded-[26px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -bottom-16 -right-10 w-72 h-72 bg-orange-500/10 blur-[140px]"></div>
                <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent)]"></div>
              </div>

              <div className="relative space-y-6 text-gray-200 leading-relaxed text-base sm:text-lg">
                {leadParagraph ? (
                  <blockquote className="border-l-4 border-orange-400/70 pl-6 text-lg sm:text-xl text-orange-50/90 not-italic font-normal">
                    {leadParagraph}
                  </blockquote>
                ) : null}

                {remainingParagraphs.length > 0 ? (
                  remainingParagraphs.map((para, index) => (
                    <p
                      key={index}
                      className="text-gray-200/90 whitespace-pre-line"
                    >
                      {para}
                    </p>
                  ))
                ) : !leadParagraph ? (
                  <p className="text-gray-200/90 whitespace-pre-line">
                    {post.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {screenshots.length > 0 && (
          <section className="mt-10">
            <div className="rounded-[24px] border border-orange-500/10 bg-black/30 p-5 sm:p-6 shadow-inner shadow-orange-500/5">
              <ScreenshotGallery screenshots={screenshots} />
            </div>
          </section>
        )}
      </div>
    </>
  );
}
