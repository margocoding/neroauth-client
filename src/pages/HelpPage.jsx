import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

const HelpPage = () => {
    const {
        t, i18n: {language},
    } = useTranslation();
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        setVideoError(false);
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [language]);

    const cards = [{
        image: t("help.cards.1.image"),
        alt: t("help.cards.1.alt"),
        title: t("help.cards.1.title"),
        text: t("help.cards.1.text"),
    }, {
        image: t("help.cards.2.image"),
        alt: t("help.cards.2.alt"),
        title: t("help.cards.2.title"),
        text: t("help.cards.2.text"),
    }, {
        image: t("help.cards.3.image"),
        alt: t("help.cards.3.alt"),
        title: t("help.cards.3.title"),
        text: t("help.cards.3.text"),
    },];

    function StepCard({index, image, alt, title, text}) {
        const [src, setSrc] = useState(image);
        const transparentPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAFElEQVR42u3BMQEAAADCoPdPbQ43oAAAAAAAAJ8G3mQAAQzZy3QAAAAASUVORK5CYII=";

        return (<div className="w-full">
                <div className="rounded-2xl overflow-hidden mb-3 text-center neon-box glass border border-white/10">
                    <div className="relative w-full aspect-[15/8] bg-black/20">
                        <img
                            src={src || transparentPng}
                            alt={alt || `Step ${index + 1}: ${title}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 480px"
                            className="object-cover help-card-image"
                            priority={index === 0}
                            onError={() => setSrc(transparentPng)}
                        />
                    </div>
                    <div className="p-5">
                        <div className="mb-2">
                            <h3 className="text-xl font-semibold">{title}</h3>
                        </div>
                        <p className="text-gray-300">{text}</p>
                    </div>
                </div>

                {index < cards.length - 1 && (<div className="flex flex-col items-center mb-4" aria-hidden>
                        <div className="h-4 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                        <div
                            className="w-8 h-8 rounded-full grid place-items-center bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,150,60,0.25)]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-4 h-4 text-orange-300"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 16a1 1 0 0 1-.7-.29l-5-5a1 1 0 0 1 1.4-1.42L12 13.59l4.3-4.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-.7.29Z"
                                />
                            </svg>
                        </div>
                        <div className="h-4 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                    </div>)}
            </div>);
    }

    return (<>
            <header>
                <title>{t("page.help.title")}</title>
                <meta name="description" content={t("help.intro")}/>
                <meta name="keywords" content={t("page.help.keywords")}/>
            </header>
            <section className="max-w-2xl mx-auto py-4 px-4">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">
                    {t("help.title")}
                </h1>
                <p className="text-gray-300 mb-4 text-center max-w-xl mx-auto">
                    {t("help.intro")}
                </p>

                <div className="flex flex-col items-center">
                    {cards.map((card, index) => (<StepCard
                            key={index}
                            index={index}
                            image={card.image}
                            alt={card.alt}
                            title={card.title}
                            text={card.text}
                        />))}
                </div>

                <p className="text-gray-400 mt-4 text-center">
                    {t("help.more")
                        .split("Telegram")
                        .map((part, index, array) => {
                            if (index === array.length - 1) {
                                return part
                                    .split("support@neroteam.org")
                                    .map((emailPart, emailIndex, emailArray) => {
                                        if (emailIndex === emailArray.length - 1) {
                                            return emailPart;
                                        }
                                        return (<span key={`email-${emailIndex}`}>
                        {emailPart}
                                                <a
                                                    href="mailto:support@neroteam.org"
                                                    className="text-orange-400 hover:text-orange-300 underline transition-colors"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                          support@neroteam.org
                        </a>
                      </span>);
                                    });
                            }
                            return (<span key={index}>
                  {part}
                                    <a
                                        href={`https://t.me/neroteam_ru`}
                                        className="text-orange-400 hover:text-orange-300 underline transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                    Telegram
                  </a>
                </span>);
                        })}
                </p>

                {/* Troubleshooting Section */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-center">
                        {t("help.troubleshooting.title")}
                    </h2>
                    <p className="text-gray-300 mb-2 text-center max-w-xl mx-auto">
                        {t("help.troubleshooting.subtitle")}
                    </p>

                    {/* Video Section */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-6 text-center">
                            {t("help.troubleshooting.video.title")}
                        </h3>
                        <div className="rounded-2xl overflow-hidden neon-box glass border border-white/10">
                            <div className="w-full aspect-video bg-black/20">
                                {videoError ? (<div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <svg
                                                className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
                                            <p className="text-gray-300 mb-4">
                                                {t("help.troubleshooting.video.error")}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setVideoError(false);
                                                    if (videoRef.current) {
                                                        videoRef.current.load();
                                                    }
                                                }}
                                                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                            >
                                                {t("help.troubleshooting.video.retry")}
                                            </button>
                                        </div>
                                    </div>) : (<video
                                        key={language}
                                        ref={videoRef}
                                        controls
                                        className="w-full h-full"
                                        preload="metadata"
                                        playsInline
                                        poster={`/help/${language}/adb.png`}
                                        onError={(e) => {
                                            console.error("Video error:", e);
                                            setVideoError(true);
                                        }}
                                    >
                                        <source
                                            src={`${process.env.REACT_APP_API_URL}/help/video?locale=${language}`}
                                            type="video/mp4"
                                        />
                                        <source
                                            src={`/help/${language}/adb.mp4`}
                                            type="video/mp4"
                                        />
                                        <p className="text-gray-300 p-4 text-center">
                                            {t("help.troubleshooting.video.error")}
                                        </p>
                                    </video>)}
                            </div>
                        </div>
                    </div>

                    {/* Tools Section */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-center">
                            {t("help.troubleshooting.tools.title")}
                        </h3>
                        <p className="text-gray-300 mb-6 text-center max-w-xl mx-auto">
                            {t("help.troubleshooting.tools.description")}
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {/* Shizuku */}
                            <div
                                className="rounded-2xl overflow-hidden neon-box glass border border-white/10 p-4 text-center">
                                <h4 className="text-lg font-semibold mb-1">
                                    {t("help.troubleshooting.tools.shizuku.title")}
                                </h4>
                                <p className="text-gray-300 mb-3 text-sm">
                                    {t("help.troubleshooting.tools.shizuku.description")}
                                </p>
                                <a
                                    href="/neroteam-auth/uploads/downloads/Shizuku.apk"
                                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                                    download
                                >
                                    {t("help.troubleshooting.download")}
                                </a>
                            </div>

                            {/* Install with Options */}
                            <div
                                className="rounded-2xl overflow-hidden neon-box glass border border-white/10 p-4 text-center">
                                <h4 className="text-lg font-semibold mb-1">
                                    {t("help.troubleshooting.tools.installwithoptions.title")}
                                </h4>
                                <p className="text-gray-300 mb-3 text-sm">
                                    {t("help.troubleshooting.tools.installwithoptions.description",)}
                                </p>
                                <a
                                    href="/neroteam-auth/uploads/downloads/InstallWithOptions.apk"
                                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                                    download
                                >
                                    {t("help.troubleshooting.download")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>);
};

export default HelpPage;
