import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const NewsCard = ({ id }) => {
  const { i18n: { language } } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Сброс состояний при смене id или языка
  useEffect(() => {
    setIsLoaded(false);
    setHasFailed(false);
    setUseFallback(false);
  }, [id, language]);

  // Таймаут на случай, если iframe не загрузится
  useEffect(() => {
    if (isLoaded || hasFailed) return;
    
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setHasFailed(true);
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [id, language, isLoaded, hasFailed]);

  const channelName = language === "en" ? "[EN] Nero Team" : "[RU] Nero Team";
  const telegramChannel = language === "en" ? "neroteam_en" : "neroteam_ru";
  const postUrl = `https://t.me/${telegramChannel}/${id}?embed=1&dark=1`;
  const fallbackUrl = `https://t.me/${telegramChannel}/${id}`;

  const handleLoad = () => {
    setIsLoaded(true);
    setHasFailed(false);
  };

  const handleError = () => {
    setHasFailed(true);
  };

  const tryFallback = () => {
    setUseFallback(true);
    setHasFailed(false);
  };

  // Рендер контента поста (iframe или fallback)
  const renderPostContent = () => {
    if (useFallback) {
      return (
        <div className="w-full h-full rounded-b-lg bg-gradient-to-br from-gray-800/50 to-gray-700/50 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
            {language === "en" ? "Post Preview" : "Предварительный просмотр"}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 px-2">
            {language === "en"
              ? "Click the button below to view the full post"
              : "Нажмите кнопку ниже, чтобы просмотреть полный пост"
            }
          </p>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {language === "en" ? "View Post" : "Просмотреть пост"}
          </a>
        </div>
      );
    }

    return (
      <iframe
        src={postUrl}
        className="w-full h-full transition-all duration-300 block"
        frameBorder="0"
        scrolling="auto"
        onLoad={handleLoad}
        onError={handleError}
        title={`Telegram post ${id}`}
        loading="lazy"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    );
  };

  return (
    <div className="telegram-post-card group transition-all duration-700">
      {/* Header с иконкой и названием канала */}
      <div className="post-header py-2 sm:py-3 px-2 sm:px-3 border-b border-orange-500/20 bg-gradient-to-r from-gray-800/60 to-gray-700/60 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
          </div>
          <div className="font-bold text-white text-sm sm:text-base leading-none text-center">
            {channelName}
          </div>
        </div>
      </div>

      {/* Контент поста с лоадером и обработкой ошибок */}
      <div className="post-content flex-1 min-h-[350px] sm:min-h-[400px] max-h-[400px] sm:max-h-[450px] relative bg-gray-900/30 overflow-hidden rounded-lg border border-orange-500/20 leading-none flex flex-col">
        {/* Лоадер */}
        {!isLoaded && !hasFailed && !useFallback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 bg-black/50 z-10 rounded-lg backdrop-blur-sm p-4">
            <div className="relative">
              <div className="animate-spin w-8 h-8 sm:w-10 sm:h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full mb-3 sm:mb-4"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-ping"></div>
            </div>
            <p className="text-sm sm:text-base font-medium mb-2 text-center">
              {language === "en" ? "Loading post..." : "Загрузка поста..."}
            </p>
            <div className="text-xs sm:text-sm text-gray-400 text-center max-w-xs">
              {language === "en"
                ? "This may take a few seconds"
                : "Это может занять несколько секунд"
              }
            </div>
          </div>
        )}

        {/* Ошибка загрузки */}
        {hasFailed && !useFallback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 bg-black/50 z-10 rounded-lg backdrop-blur-sm p-4">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 110 20 10 10 0 010-20" />
                </svg>
              </div>
              <p className="text-sm sm:text-base font-medium mb-2 text-red-400">
                {language === "en" ? "Failed to load post" : "Не удалось загрузить пост"}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 text-center">
                {language === "en"
                  ? "The post couldn't be loaded. Try the alternative view below."
                  : "Пост не удалось загрузить. Попробуйте альтернативный просмотр ниже."
                }
              </p>
              <button
                onClick={tryFallback}
                className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm"
              >
                {language === "en" ? "Try Alternative View" : "Попробовать альтернативный просмотр"}
              </button>
            </div>
          </div>
        )}

        {renderPostContent()}
      </div>

      {/* Кнопка действия */}
      <div className="post-actions p-3 sm:p-4 pt-2 sm:pt-3 bg-gradient-to-r from-gray-800/40 to-gray-700/40">
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm font-bold text-center transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transform hover:scale-105 border border-orange-400/20 flex items-center justify-center gap-2"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {language === "en" ? "Open Post" : "Открыть пост"}
        </a>
      </div>
    </div>
  );
};

export default NewsCard;