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
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const navigate = useNavigate();

  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      login: "",
      password: "",
      code: null,
    },
  });

  const { email, login, password, code } = watch();

  const [isUserExisting, setIsUserExisting] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async ({ email, login, password, code }) => {
      setLoading(true);

      try {
        switch (step) {
          case 1:
            const userExisting = await authApi.checkUserByEmail(email);
            if (!userExisting) {
              await exceptAxiosError(() => authApi.createCode(email));
            }
            setIsUserExisting(userExisting);
            setStep((step) => step + 1);
            break;
          case 2:
            await exceptAxiosError(async () => {
              if (!isUserExisting) {
                await authApi.register(email, login, password, +code);
              } else {
                await authApi.login(email, password);
              }
            });

            navigate(
              `/${language}/profile#token=${localStorage.getItem("token")}`,
            );

            break;
          default:
            break;
        }
      } finally {
        setLoading(false);
      }
    },
    [step, isUserExisting, language, navigate],
  );

  return (
    <div className="h-[70vh] max-w-[300px] w-full mx-auto">
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
          {step > 1 && (
            <motion.div
              key={isUserExisting ? "login" : "register"}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col gap-3 w-full"
            >
              {isUserExisting ? (
                <Input
                  placeholder={t("auth.password")}
                  {...register("password", { required: true })}
                  type="password"
                />
              ) : (
                <>
                  <Input
                    placeholder={t("auth.login")}
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
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={
            !(
              (step === 1 && email) ||
              (step === 2 &&
                (!isUserExisting
                  ? email && password && login && code
                  : email && password))
            ) || loading
          }
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              {t("auth.next")}{" "}
              <AnimatedArrow
                condition={
                  (step === 1 && email) ||
                  (step === 2 &&
                    (!isUserExisting
                      ? email && password && login && code
                      : email && password))
                }
              />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AuthPage;
