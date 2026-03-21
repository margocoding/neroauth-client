import Button from "../../../ui/Button";
import { useTranslation } from "react-i18next";

const Session = ({ deviceType, deviceName, os, browser, isCurrentSession, lastJoin, country, city, closeSession }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="relative w-full space-y-3 bg-[#222] rounded-lg p-3 text-white">
            <div className="flex gap-3 items-center">
                <div className="p-3 rounded-full bg-[#333]">
                    <img 
                        src={`/icons/devices/${deviceType || 'mobile'}.svg`} 
                        className="w-8 h-8" 
                        alt={deviceType} 
                    />
                </div>
                <div className="min-w-0">
                    <h1 className="text-lg font-semibold truncate">{deviceName || browser} {os}</h1>
                    <div className="text-sm text-gray-400">{country}, {city}</div>
                    <div className="text-xs text-gray-500">
                        {new Date(lastJoin).toLocaleString(i18n.language, {
                            month: 'long',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                </div>
            </div>
            {!isCurrentSession && (
                <Button 
                    color="danger" 
                    onClick={closeSession}
                    className="w-full font-bold"
                >
                    {t('sessions.actions.buttons.close')}
                </Button>
            )}
        </div>
    );
}

export default Session;