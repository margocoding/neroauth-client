import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ScreenshotGallery = ({ screenshots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [showFullscreenControls, setShowFullscreenControls] = useState(true);
  const [controlsTimer, setControlsTimer] = useState(null);
  const { t } = useTranslation();

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length,
    );
  }, [screenshots.length]);

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    setShowFullscreenControls(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setShowFullscreenControls(true);
    if (controlsTimer) {
      clearTimeout(controlsTimer);
      setControlsTimer(null);
    }
    document.body.style.overflow = "unset";
  }, [controlsTimer]);

  const showControls = useCallback(() => {
    if (!isFullscreen) return;
    setShowFullscreenControls(true);
    if (controlsTimer) {
      clearTimeout(controlsTimer);
    }
    const hideDelay =
      typeof window !== "undefined" &&
        ("ontouchstart" in window || (navigator && navigator.maxTouchPoints > 0))
        ? 4000
        : 3000;
    const timer = setTimeout(() => {
      setShowFullscreenControls(false);
      setControlsTimer(null);
    }, hideDelay);
    setControlsTimer(timer);
  }, [isFullscreen, controlsTimer]);

  const hideControls = () => {
    if (!isFullscreen) return;
    setShowFullscreenControls(false);
  };

  const handleMouseMove = () => {
    if (isFullscreen && !("ontouchstart" in window)) {
      showControls();
    }
  };

  const handleImageInteraction = (e) => {
    e.stopPropagation();
    if (
      typeof window !== "undefined" &&
      ("ontouchstart" in window || (navigator && navigator.maxTouchPoints > 0))
    ) {
      return;
    }

    if (isFullscreen) {
      if (showFullscreenControls) {
        hideControls();
      } else {
        showControls();
      }
    }
  };

  const handleImageDoubleClick = (e) => {
    e.stopPropagation();
    if (isFullscreen) {
      hideControls();
    }
  };

  const handleTouchStart = (e) => {
    if (isFullscreen) {
      showControls();

      const touch = e.touches[0];
      setTouchStartX(touch.clientX);
      setTouchStartY(touch.clientY);
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e) => {
    if (isFullscreen) {
      showControls();

      const touch = e.changedTouches[0];
      setTouchEndX(touch.clientX);
      setTouchEndY(touch.clientY);

      handleSwipe();
      e.stopPropagation();
    }
  };

  const handleSwipe = () => {
    const minSwipeDistance = 50;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > minSwipeDistance
    ) {
      if (deltaX > 0) {
        prevSlide();
        showControls();
      } else {
        nextSlide();
        showControls();
      }
    }
  };

  const handleTouchForControls = () => {
    if (isFullscreen) {
      showControls();
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimer) {
        clearTimeout(controlsTimer);
      }
    };
  }, [controlsTimer]);

  useEffect(() => {
    if (screenshots.length === 0) return;

    const preloadImages = async () => {
      const imagePromises = screenshots.map((screenshot, index) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            resolve({ index, success: true });
          };
          img.onerror = () => {
            resolve({ index, success: false });
          };
          img.src = screenshot.image;
        });
      });

      const results = await Promise.all(imagePromises);
      const errors = new Set();
      results.forEach(({ index, success }) => {
        if (!success) {
          errors.add(index);
        }
      });

      setImageErrors(errors);
      setImagesLoaded(true);
    };

    preloadImages();
  }, [screenshots]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case "Escape":
          closeFullscreen();
          break;
        case "ArrowLeft":
          prevSlide();
          showControls(); // Показываем кнопки при навигации
          break;
        case "ArrowRight":
          nextSlide();
          showControls(); // Показываем кнопки при навигации
          break;
        default:
          nextSlide();
          showControls(); // Показываем кнопки при навигации
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, closeFullscreen, prevSlide, nextSlide, showControls]);

  if (!screenshots || screenshots.length === 0) return null;

  const currentScreenshot = screenshots[currentIndex];
  const hasCurrentImageError = imageErrors.has(currentIndex);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 md:md-6 neon-box bg-gray-900">
          {!imagesLoaded && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-4"></div>
                <p className="text-gray-400 text-sm md:text-base">
                  {t("loading.default")}
                </p>
              </div>
            </div>
          )}
          {imagesLoaded && hasCurrentImageError && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">{t("loading.error")}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {currentScreenshot.title}
                </p>
              </div>
            </div>
          )}
          {!hasCurrentImageError && (
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={currentScreenshot.image}
                alt={currentScreenshot.title || "post"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className={`object-contain transition-all duration-500 ease-in-out cursor-pointer
                  ${!imagesLoaded ? "opacity-0" : "opacity-100"}`}
                priority
                onClick={openFullscreen}
                onLoad={() => setImagesLoaded(true)}
                onError={() => {
                  setImageErrors((prev) => new Set([...prev, currentIndex]));
                }}
                onTouchStart={handleTouchForControls}
                onTouchEnd={handleTouchForControls}
                onDoubleClick={handleImageDoubleClick}
              />
            </div>
          )}

          <button
            onClick={prevSlide}
            onTouchStart={handleTouchForControls}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10 gallery-button hover:scale-110 hover:shadow-lg"
            aria-label="Previous screenshot"
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            onTouchStart={handleTouchForControls}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10 gallery-button hover:scale-110 hover:shadow-lg"
            aria-label="Next screenshot"
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Fullscreen button */}
          <button
            onClick={openFullscreen}
            onTouchStart={handleTouchForControls}
            className="absolute top-2 md:top-4 left-2 md:left-4 w-7 h-7 md:w-10 md:h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10 gallery-button hover:scale-110 hover:shadow-lg"
            aria-label="Open fullscreen"
          >
            <svg
              className="w-3 h-3 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>

          {/* Screenshot counter */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/60 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm backdrop-blur-sm font-medium">
            {currentIndex + 1} / {screenshots.length}
          </div>

          {/* Slide indicator dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                onTouchStart={handleTouchForControls}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "bg-orange-500 scale-125"
                    : "bg-white/50 hover:bg-white/75 hover:scale-110"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex flex-row gap-2 md:gap-3 overflow-x-auto pb-4 md:pb-6 scrollbar-hide mt-8 md:mt-2 mobile-thumbnails w-full px-2 md:px-4">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onTouchStart={handleTouchForControls}
              onFocus={(e) => e.currentTarget.blur()}
              tabIndex={-1}
              // 🔥 Главное изменение: w-20 md:w-24 вместо flex-1, и h-12 md:h-16
              className={`relative flex-shrink-0 w-20 md:w-24 h-12 md:h-16 rounded-none transition-all duration-300 appearance-none outline-none focus:outline-none ring-0 focus:ring-0 focus:ring-offset-0 ${index === currentIndex
                  ? "border-2 border-orange-500 shadow-lg shadow-orange-500/25"
                  : "opacity-70 hover:opacity-100 border border-orange-500/30"
                }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="w-full h-full rounded-none overflow-hidden relative">
                {imageErrors.has(index) ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={screenshot.image || screenshot}
                    alt={screenshot.title || "post"}
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    // 🔥 object-cover заставит картинку заполнить всю область превью
                    className="object-cover"
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 md:p-4 fullscreen-modal"
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeFullscreen}
              onTouchStart={handleTouchForControls}
              className={`absolute top-2 md:top-4 right-2 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 gallery-button hover:scale-110 hover:shadow-lg transition-opacity duration-300 ${showFullscreenControls
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
                }`}
              aria-label="Close fullscreen"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Fullscreen image */}
            <div className="relative w-full h-full flex items-center justify-center">
              {hasCurrentImageError ? (
                <div className="text-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg
                      className="w-8 h-8 md:w-12 md:h-12 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
                    {t("loading_error")}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    {t("loading.image_error")}
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={currentScreenshot.image}
                    alt={currentScreenshot.title || "post"}
                    fill
                    sizes="100vw"
                    className="object-contain transition-all duration-500 ease-in-out cursor-pointer"
                    priority
                    onClick={handleImageInteraction}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  />
                </div>
              )}

              {/* Fullscreen navigation arrows */}
              <button
                onClick={prevSlide}
                onTouchStart={handleTouchForControls}
                className={`absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 gallery-button hover:scale-110 hover:shadow-lg transition-opacity duration-300 ${showFullscreenControls
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                  }`}
                aria-label="Previous screenshot"
              >
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                onTouchStart={handleTouchForControls}
                className={`absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 gallery-button hover:scale-110 hover:shadow-lg transition-opacity duration-300 ${showFullscreenControls
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                  }`}
                aria-label="Next screenshot"
              >
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScreenshotGallery;
