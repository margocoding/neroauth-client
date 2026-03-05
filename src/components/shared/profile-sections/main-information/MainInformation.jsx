import Avatar from "../../../ui/Avatar";
import Input from "../../../ui/Input";
import {useTranslation} from "react-i18next";
import {useCallback, useState} from "react";
import Button from "../../../ui/Button";
import {toast} from "react-toastify";
import {exceptAxiosError} from "../../../../utils/exceptAxiosError";
import {userApi} from "../../../../api/userApi";

const MainInformation = ({avatar, login, inviteCode}) => {
    const {t} = useTranslation();

    const [isUpdating, setIsUpdating] = useState(false);
    const [currentLogin, setCurrentLogin] = useState(login);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateUser = useCallback(async (data) => {
        try {
            setIsLoading(true);
            const {success} = await exceptAxiosError(() => userApi.updateUser(data));
            if (success) {
                toast(t('profile.succeed_update'), {type: 'success'});
                setIsUpdating(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);


    return <div className={'space-y-3'}>
        <div className="flex w-full gap-3 items-center">
            <Avatar path={avatar} self/>
            <div className="flex flex-col gap-3 w-full">
                <Input label={t("auth.login")} value={currentLogin} onChange={(e) => setCurrentLogin(e.target.value)}
                       disabled={!isUpdating}/>
                <Input
                    label={t("profile.friend.invite_code.placeholder")}
                    value={inviteCode}
                    disabled
                />
            </div>
        </div>

        {isUpdating ?
            <Button isLoading={isLoading} onClick={() => handleUpdateUser({login: currentLogin})} color={'success'}
                    className={'w-full'}>{t('profile.buttons.update')}</Button> :
            <Button className={'w-full'}
                    onClick={() => setIsUpdating(prev => !prev)}>{t('profile.buttons.update')}</Button>
        }

    </div>
}

export default MainInformation;