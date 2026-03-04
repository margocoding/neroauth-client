import Button from "../ui/Button";
import {useTranslation} from "react-i18next";

const Session = ({deviceType, deviceName, os, browser, isCurrentSession, lastJoin, country, city, closeSession}) => {
    const {t} = useTranslation();

    return <div
        className={'relative w-full space-y-3 bg-[#222] rounded-lg p-3 '}>
        <div className={'flex gap-3 items-center'}>

            <div className={'p-3 rounded-full bg-[#333]'}>
                <img src={`/icons/devices/${deviceType || 'mobile'}.svg`} className={'w-8 h-8'} alt={deviceType}/>
            </div>
            <div>
                <h1 className={'text-xl font-semibold'}>{deviceName || browser} {os}</h1>
                <div>{country}, {city}</div>
                <div>{new Date(lastJoin).toDateString({
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric',
                })}</div>
            </div>
        </div>
        {!isCurrentSession &&
            <Button color={'danger'} onClick={closeSession}
                    className={'w-full'}>{t('sessions.actions.buttons.close')}</Button>
        }
    </div>
}

export default Session;