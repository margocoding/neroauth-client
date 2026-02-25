import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../api/authApi";
import AnimatedArrow from "../components/ui/AnimatedArrow";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import { exceptAxiosError } from "../utils/exceptAxiosError";

const AuthPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      email: localStorage.getItem("auth-email"),
      login: "",
      password: "",
      code: localStorage.getItem("auth-code"),
    },
  });

  const { email, login, password, code } = watch();

  const [isUserExisting, setIsUserExisting] = useState(
    localStorage.getItem("auth-user-existing") === "true",
  );
  const [authType, setAuthType] = useState(
    localStorage.getItem("auth-type") || "initial",
  );
  const [step, setStep] = useState(+localStorage.getItem("auth-step") || 1);
  const [loading, setLoading] = useState(false);

  const handleBackStep = useCallback(() => {
    if (step < 2) return;

    setStep((step) => step - 1);
    setAuthType("initial");
    localStorage.setItem("auth-type", "initial");
    localStorage.setItem("auth-step", step - 1);
  }, [step]);

  const handleForgotPassword = useCallback(async () => {
    await exceptAxiosError(() => authApi.createCode(email));
    localStorage.setItem("auth-type", "reset-password");
    setAuthType("reset-password");
  }, [email]);

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

            localStorage.setItem("auth-email", email);
            localStorage.setItem("auth-step", step + 1);
            localStorage.setItem("auth-user-existing", userExisting);

            setIsUserExisting(userExisting);
            setStep((step) => step + 1);
            break;
          case 2:
            await exceptAxiosError(async () => {
              if (authType === "initial") {
                if (!isUserExisting) {
                  await authApi.register(email, login, password, +code);
                } else {
                  await authApi.login(email, password);
                }
              } else if (authType === "reset-password") {
                await authApi.resetPassword(email, code, password);
                setAuthType("initial");
                setIsUserExisting(true);
              }
            });

            localStorage.removeItem("auth-email");
            localStorage.removeItem("auth-code");
            localStorage.removeItem("auth-step");
            localStorage.removeItem("auth-user-existing");

            const isGame = searchParams.get("isGame");
            if (isGame) console.log("exit");

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
    [step, navigate, language, authType, isUserExisting, searchParams],
  );

  const getFormByStep = useCallback(
    (step) => {
      switch (step) {
        case 2:
          if (authType === "initial") {
            return isUserExisting ? (
              <div>
                <Input
                  autoFocus
                  placeholder={t("auth.password")}
                  {...register("password", { required: true })}
                  type="password"
                />
              </div>
            ) : (
              <>
                <Input
                  placeholder={t("auth.login")}
                  maxLength={'15'}
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
                />
              </>
            );
          } else if (authType === "reset-password") {
            return (
              <>
                <Input
                  placeholder={t("auth.password")}
                  {...register("password", { required: true })}
                  type="password"
                />
                <Input
                  placeholder={t("auth.code")}
                  {...register("code", { required: true })}
                />
              </>
            );
          }
          break;
        default:
          break;
      }
    },
    [authType, isUserExisting, register, t],
  );

  const isNextButtonEnabled = useMemo(() => {
    if (!email || loading) return false;
    switch (step) {
      case 1:
        return !!email;
      case 2:
        if (authType === "initial") {
          if (isUserExisting) {
            return password;
          } else {
            return login && password && code;
          }
        } else if (authType === "reset-password") {
          return password && code;
        }
        return false;
      default:
        return false;
    }
  }, [email, loading, login, password, code, step, authType, isUserExisting]);

  return (
    <div className="h-[70vh] max-w-[300px] w-full mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 items-center justify-center h-full"
      >
        <header className="space-y-2 text-center">
          <h2 className="text-3xl">{t("auth.title")}</h2>
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
              {getFormByStep(step)}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 w-full">
          {step > 1 && (
            <Button type="button" color="fade" onClick={handleBackStep}>
              <img
                src="/icons/arrow-right.svg"
                className="rotate-180 h-[20px]"
                alt="arrow"
              />
            </Button>
          )}
          <Button
            className={"w-full"}
            type="submit"
            disabled={!isNextButtonEnabled}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                {t("auth.next")}{" "}
                <AnimatedArrow condition={isNextButtonEnabled} />
              </>
            )}
          </Button>
        </div>
        {authType === "initial" && isUserExisting && (
          <div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full mt-5 text-left text-orange-400"
            >
              {t("auth.forgot_password.button")}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthPage;
