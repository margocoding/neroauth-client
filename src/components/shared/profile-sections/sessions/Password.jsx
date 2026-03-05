import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {exceptAxiosError} from "../../../../utils/exceptAxiosError";
import {userApi} from "../../../../api/userApi";
import {toast} from "react-toastify";

const Password = ({clearSessions}) => {
    const {t} = useTranslation();

    const [isChanging, setIsChanging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');

    const handleChangePassword = useCallback(async (currentPassword, password) => {
        try {
            setIsLoading(true)
            const {success} = await exceptAxiosError(() => userApi.changePassword(currentPassword, password));

            if (success) {
                toast(t('profile.password.success_change'), {type: 'success'});
                setIsChanging(false);
                setCurrentPassword('');
                setPassword('');
                clearSessions();
            }
        } finally {
            setIsLoading(false);
        }
    }, [clearSessions, t])

    return <div>
        {isChanging ?
            <div className={'space-y-3'}>
                <Input disabled={isLoading} type={'password'} placeholder={t('profile.password.old_password_input')}
                       value={currentPassword}
                       onChange={(e) => setCurrentPassword(e.target.value)}/>
                <Input disabled={isLoading} type={'password'} placeholder={t('profile.password.new_password_input')}
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
                <div className={'flex gap-3'}>
                    <Button isLoading={isLoading} className={'w-full'}
                            onClick={() => handleChangePassword(currentPassword, password)}
                            color={'success'}>{t('profile.password.buttons.change')}</Button>
                    <Button isLoading={isLoading} className={'w-full'} color={'danger'}
                            onClick={() => setIsChanging(prev => !prev)}>{t('profile.password.buttons.cancel')}</Button>
                </div>
            </div> :
            <div className={'flex gap-3 w-full'}>

                <Input type={'password'} disabled value={'************'}/>
                <Button
                    onClick={() => setIsChanging(prev => !prev)}>{t('profile.password.buttons.change')}</Button>
            </div>
        }
    </div>
}

export default Password;