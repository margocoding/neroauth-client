import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {useEffect, useRef, useState} from "react";

const FALLBACK_IMAGE = "/nero_troops/splash.png";

const NewsCard = ({ id }) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoaded(false);
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-post", `neroteam_ru/${id}`);
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-dark", "1");

    containerRef.current.appendChild(script);

    const observer = new MutationObserver(() => {
      const iframe = containerRef.current?.querySelector("iframe");
      if (iframe) {
        iframe.onload = () => {
          setIsLoaded(true);
        };
        observer.disconnect();
      }
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [id]);

  return (
      <div className="h-[600px] p-1 rounded-xl overflow-y-auto relative">

        {!isLoaded && (
            <div className="absolute inset-0 animate-pulse rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800" />
        )}

        <div
            ref={containerRef}
            className={`transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
            }`}
        />
      </div>
  );

  // return (
  //   <article
  //     className="
  //               card neon-box group rounded-2xl flex flex-col relative
  //               bg-linear-to-br from-[#0c0c0f] via-[#131217] to-[#0c0c0f] overflow-hidden
  //               border border-orange-500/15 hover:border-orange-400/50 transition-all duration-500
  //           "
  //   >
  //     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
  //       <div className="absolute inset-6 rounded-3xl bg-orange-500/10 blur-3xl"></div>
  //     </div>
  //
  //     <div className="relative w-full overflow-hidden z-10">
  //       <div className="relative h-[220px] sm:h-60 md:h-[260px] overflow-hidden">
  //         <img
  //           src={displayImage}
  //           alt="News"
  //           width={1024}
  //           height={1024}
  //           className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:brightness-110"
  //           priority
  //         />
  //         <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent"></div>
  //         <div className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
  //       </div>
  //     </div>
  //
  //     <div className="p-4 sm:p-6 flex flex-col flex-1 gap-4 relative z-10">
  //       <div className="flex items-center justify-center gap-2 text-[0.75rem] uppercase tracking-[0.4em] text-orange-200/80 font-semibold">
  //         <span className="inline-flex h-px w-6 bg-linear-to-r from-transparent to-orange-400/60"></span>
  //         {tagLabel}
  //         <span className="inline-flex h-px w-6 bg-linear-to-l from-transparent to-orange-400/60"></span>
  //       </div>
  //       {/*
  //       {title && (
  //         <h3 className="text-xl sm:text-2xl font-bold text-center text-white leading-tight line-clamp-3">
  //           {title}
  //         </h3>
  //       )} */}
  //
  //       <div className="relative rounded-2xl h-full border border-white/5 bg-white/5 p-4 sm:p-5 overflow-hidden">
  //         <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  //         <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-orange-500/10 blur-3xl"></div>
  //         <p className="relative text-base sm:text-lg text-gray-100 leading-relaxed line-clamp-6 space-y-10">
  //           {message}
  //         </p>
  //       </div>
  //
  //       <Link
  //         to={`/${language}/news/${id}`}
  //         className="
  //                       btn-primary w-full px-4 py-3 rounded-xl font-bold transition-all duration-300 neon-box
  //                       flex items-center justify-center text-base sm:text-lg mt-auto relative
  //                       hover:shadow-[0_0_30px_rgba(255,122,0,0.35)]
  //                   "
  //       >
  //         <span className="relative z-10">{t("card.more")}</span>
  //         <div className="absolute inset-0 -left-full group-hover:left-full transition-[left] duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
  //       </Link>
  //     </div>
  //   </article>
  // );
};

export default NewsCard;
