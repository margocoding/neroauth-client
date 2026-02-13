import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { authApi } from "../api/authApi";
import { exceptAxiosError } from "../utils/exceptAxiosError";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import AnimatedArrow from "../components/ui/AnimatedArrow";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const AuthPage = () => {
    const {
        t, i18n: { language },
    } = useTranslation();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const { register, watch, handleSubmit } = useForm({
        defaultValues: {
            email: localStorage.getItem('auth-email'), login: "", password: "", code: localStorage.getItem('auth-code'),
        },
    });

    const { email, login, password, code } = watch();

    const [isUserExisting, setIsUserExisting] = useState(localStorage.getItem('auth-user-existing') === 'true');
    const [authType, setAuthType] = useState('initial');
    const [step, setStep] = useState(+localStorage.getItem('auth-step') || 1);
    const [loading, setLoading] = useState(false);

    const onSubmit = useCallback(async ({ email, login, password, code }) => {
        setLoading(true);

        try {
            switch (step) {
                case 1:
                    const userExisting = await authApi.checkUserByEmail(email);
                    if (!userExisting) {
                        await exceptAxiosError(() => authApi.createCode(email));
                    }

                    localStorage.setItem('auth-email', email);
                    localStorage.setItem('auth-code', code);
                    localStorage.setItem('auth-step', step + 1);
                    localStorage.setItem('auth-user-existing', userExisting);

                    setIsUserExisting(userExisting);
                    setStep((step) => step + 1);
                    break;
                case 2:
                    await exceptAxiosError(async () => {
                        if (authType === 'initial') {
                            if (!isUserExisting) {
                                await authApi.register(email, login, password, +code);
                            } else {
                                await authApi.login(email, password);
                            }

                            localStorage.removeItem('auth-email');
                            localStorage.removeItem('auth-code');
                            localStorage.removeItem('auth-step');
                            localStorage.removeItem('auth-user-existing');
                            
                            const isGame = searchParams.get('isGame');

                            if(isGame) console.log('exit');

                        } else if (authType === 'reset-password') {
                            await authApi.requestResetPassword(email);
                        }
                    });

                    navigate(`/${language}/profile#token=${localStorage.getItem("token")}`,);

                    break;

                case 3:
                    await exceptAxiosError(async () => {
                        if (authType === 'reset-password') {
                            await authApi.resetPassword(email, code);
                        }
                    })
                    break;
                default:
                    break;
            }
        } finally {
            setLoading(false);
        }
    }, [step, navigate, language, authType, isUserExisting]);

    return (<div className="h-[70vh] max-w-[300px] w-full mx-auto">
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 items-center justify-center h-full"
        >
            <header className="space-y-2">
                <h2 className="text-3xl text-center">{t("auth.title")}</h2>
                <h4 className="text-gray-400 text-sm">{t("auth.description")}</h4>
            </header>

            <Input
                disabled={step > 1}
                {...register("email", { required: true })}
                placeholder={t("auth.emailInput")}
                type="email"
            />

            <AnimatePresence mode="wait">
                {step > 1 && (<motion.div
                    key={isUserExisting ? "login" : "register"}
                    variants={{
                        hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex flex-col gap-3 w-full"
                >
                    {isUserExisting ? (<Input
                        autoFocus
                        placeholder={t("auth.password")}
                        {...register("password", { required: true })}
                        type="password"
                    />) : (<>
                        <Input
                            placeholder={t("auth.login")}
                            autoFocus
                            {...register("login", { required: true })}
                        />
                        <Input
                            placeholder={t("auth.password")}
                            {...register("password", { required: true })}
                            type="password"
                        />
                        <Input
                            placeholder={t("auth.code")}
                            {...register("code", { required: true })}
                            type="number"
                        />
                    </>)}
                </motion.div>)}
            </AnimatePresence>

            <div className="flex gap-3 w-full">
                {step > 1 &&
                    <Button color="fade" onClick={() => setStep(step => step - 1)}>
                        <img
                            src="/icons/arrow-right.svg"
                            className="rotate-180 h-[20px]"
                            alt="arrow"
                        />
                    </Button>
                }
                <Button
                    className={'w-full'}
                    type="submit"
                    disabled={!((step === 1 && email) || (step === 2 && (!isUserExisting ? email && password && login && code : email && password))) || loading}
                >
                    {loading ? (<Spinner />) : (<>
                        {t("auth.next")}{" "}
                        <AnimatedArrow
                            condition={(step === 1 && email) || (step === 2 && (!isUserExisting ? email && password && login && code : email && password))}
                        />
                    </>)}
                </Button>
            </div>
        </form>
    </div>);
};

export default AuthPage;
