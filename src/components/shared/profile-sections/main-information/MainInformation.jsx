import Avatar from "../../../ui/Avatar";
import Input from "../../../ui/Input";
import { useTranslation } from "react-i18next";
import { useCallback, useState, useEffect } from "react";
import Button from "../../../ui/Button";
import { toast } from "react-toastify";
import { exceptAxiosError } from "../../../../utils/exceptAxiosError";
import { userApi } from "../../../../api/userApi";
import { FaCopy, FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../../../store/user";

const MainInformation = ({ avatar, login, inviteCode }) => {
    const { t } = useTranslation();
    const { setUser } = useUser();

    const [isUpdating, setIsUpdating] = useState(false);
    const [currentLogin, setCurrentLogin] = useState(login);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Sync currentLogin if login prop changes (e.g. from elsewhere)
    useEffect(() => {
        if (!isUpdating) {
            setCurrentLogin(login);
        }
    }, [login, isUpdating]);

    const handleUpdateUser = useCallback(async (newLogin) => {
        if (!newLogin || newLogin.trim() === "" || newLogin === login) {
            setIsUpdating(false);
            return;
        }

        try {
            setIsLoading(true);
            const { success } = await exceptAxiosError(() => userApi.updateUser({ login: newLogin }));
            if (success) {
                toast(t('profile.succeed_update'), { type: 'success' });
                // Update global user context immediately
                setUser(prev => ({ ...prev, login: newLogin }));
                setIsUpdating(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, [login, t, setUser]);

    const handleCancel = useCallback(() => {
        setCurrentLogin(login);
        setIsUpdating(false);
    }, [login]);

    const handleCopyCode = useCallback(() => {
        const copyText = (text) => {
            if (navigator.clipboard) {
                return navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }
                document.body.removeChild(textArea);
                return Promise.resolve();
            }
        };

        copyText(inviteCode).then(() => {
            setCopied(true);
            toast(t('profile.friend.invite_code.success_copy'), { type: 'success', autoClose: 2000 });
            setTimeout(() => setCopied(false), 2000);
        });
    }, [inviteCode, t]);

    const isChanged = currentLogin !== login && currentLogin.trim() !== "";

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row w-full gap-6 items-center sm:items-start">
                <div className="flex-shrink-0">
                    <Avatar path={avatar} self className="w-28 h-28 md:w-32 md:h-32" />
                </div>
                <div className="flex flex-col gap-3 grow w-full">
                    <div className="relative">
                        <Input 
                            label={t("auth.login")} 
                            value={currentLogin} 
                            onChange={(e) => setCurrentLogin(e.target.value)}
                            disabled={!isUpdating} 
                        />
                    </div>
                    
                    <div>
                        {<div className="text-gray-400">{t("profile.friend.invite_code.placeholder")}</div>}
                        <div className="relative">
                            <input
                                className="inline-block w-full bg-zinc-900 border border-zinc-700 text-white disabled:opacity-70 font-medium py-2 px-4 pr-11 rounded-lg transition-colors outline-none"
                                value={inviteCode}
                                disabled
                                readOnly
                            />
                            <button
                                onClick={handleCopyCode}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all border shadow-sm z-[30] 
                                  ${copied 
                                    ? "bg-green-500/20 border-green-500/40 text-green-500" 
                                    : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-orange-500"}`}
                                title={t("profile.friend.invite_code.copy_title") || "Copy code"}
                            >
                                {copied ? <FaCheck size={16} /> : <FaCopy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isUpdating ? (
                    <motion.div 
                        key="editing"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-3"
                    >
                        <Button 
                            isLoading={isLoading} 
                            onClick={() => handleUpdateUser(currentLogin)} 
                            color="success"
                            className="w-full flex items-center justify-center gap-2"
                            disabled={!isChanged}
                        >
                            <FaCheck /> {t('profile.buttons.save')}
                        </Button>
                        <Button 
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2"
                            color="danger"
                            onClick={handleCancel}
                        >
                            <FaTimes /> {t('profile.buttons.cancel')}
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="viewing"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <Button 
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => setIsUpdating(true)}
                        >
                            <FaEdit /> {t('profile.buttons.update')}
                        </Button>
                    </motion.div>
                )
                }
            </AnimatePresence>
        </div>
    );
};

export default MainInformation;