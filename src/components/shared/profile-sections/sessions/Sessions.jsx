import { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../../../../api/authApi";
import Session from "./Session";
import { useTranslation } from "react-i18next";
import { exceptAxiosError } from "../../../../utils/exceptAxiosError";
import { toast } from "react-toastify";
import Button from "../../../ui/Button";
import Password from "./Password";
import Modal from "../../../ui/Modal";
import Input from "../../../ui/Input";
import { userApi } from "../../../../api/userApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../store/user";

const Sessions = () => {
  const { t } = useTranslation();

  const { setUser } = useUser();

  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      const sessions = await authApi.fetchSessions();

      setSessions(sessions);
    };

    fetchSessions();
  }, []);

  const clearSessions = useCallback(
    (id) => setSessions((prev) => prev.filter((session) => session._id !== id)),
    [],
  );

  const handleCloseSession = useCallback(
    async (id) => {
      const { success } = await exceptAxiosError(() =>
        authApi.closeSession(id),
      );
      if (success) {
        clearSessions(id);
        toast(t("sessions.actions.success_closed"), { type: "success" });
      }
    },
    [t, clearSessions],
  );

  const handleCloseAllSessions = useCallback(async () => {
    const { success } = await exceptAxiosError(() =>
      authApi.closeAllSessions(),
    );
    if (success) {
      toast(t("sessions.actions.success_closed_all"), { type: "success" });
      const currentToken = JSON.parse(
        localStorage.getItem("refreshToken"),
      ).value;
      setSessions((prev) =>
        prev.filter((session) => session.token === currentToken),
      );
    }
  }, [t]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      setDeleteAccountLoading(true);
      const { success } = await exceptAxiosError(() => userApi.deleteAccount());
      if (success) {
        toast(t("sessions.actions.delete_account_success"), {
          type: "success",
        });
        localStorage.clear();
        setUser(null);
        navigate("/");
      }
    } finally {
      setDeleteAccountLoading(false);
      setOpenedDeleteModal(false);
    }
  });

  const currentToken = (() => {
    try {
      return JSON.parse(localStorage.getItem("refreshToken")).value;
    } catch {
      return null;
    }
  })();

  const sortedSessions = [...sessions].sort((a, b) => {
    const aIsCurrent = a.token === currentToken ? -1 : 0;
    const bIsCurrent = b.token === currentToken ? -1 : 0;
    return aIsCurrent - bIsCurrent;
  });

  const confirmWords = useMemo(
    () => t("sessions.delete_account.modal.input.confirm_words"),
    [t],
  );
  const isValid = useMemo(
    () => confirmWords === confirmPhrase,
    [confirmWords, confirmPhrase],
  );

  return (
    <div className={"space-y-5"}>
      <Password clearSessions={clearSessions} />
      <h2 className="font-semibold text-3xl text-center">
        {t("sessions.title")}
      </h2>
      <div className={"space-y-3"}>
        {sortedSessions.map((session, index) => {
          const isCurrent = session.token === currentToken;
          return (
            <div key={session._id}>
              <Session
                isCurrentSession={isCurrent}
                closeSession={() => handleCloseSession(session._id)}
                os={session.device.os}
                deviceName={session.device.name}
                deviceType={session.device.deviceType}
                lastJoin={session.lastJoin}
                country={session.location.country}
                city={session.location.city}
                browser={session.device.browser}
              />
              {isCurrent && sortedSessions.length > 1 && (
                <div className="flex items-center justify-center my-3">
                  <div className="divider w-full h-px rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sessions.length > 1 && (
        <>
          <div className="flex items-center justify-center">
            <div className="divider w-full h-px rounded-full"></div>
          </div>
          <Button
            onClick={handleCloseAllSessions}
            className={
              "w-full font-bold bg-red-600 hover:bg-red-700 border-red-600 text-white"
            }
          >
            {t("sessions.actions.buttons.close_all")}
          </Button>
        </>
      )}

      <>
        <div className="flex items-center justify-center">
          <div className="divider w-full h-px rounded-full"></div>
        </div>

        <Button
          className={"w-full"}
          color="danger"
          onClick={() => setOpenedDeleteModal(true)}
        >
          {t("sessions.delete_account.button")}
        </Button>
      </>

      <Modal
        className="w-full max-w-md"
        onClose={() => setOpenedDeleteModal(false)}
        opened={openedDeleteModal}
      >
        <div className="flex flex-col gap-5">
          <header className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-white">
              {t("sessions.delete_account.modal.subtitle")}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("sessions.delete_account.modal.description")}
            </p>
          </header>

          <div className="bg-red-500/10 border border-red-500/30 text-center rounded-lg p-3 text-sm text-red-400">
            {t("sessions.delete_account.modal.warning")}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-400 text-center">
              {t("sessions.delete_account.modal.input.confirm").replace(
                "confirm_words",
                confirmWords,
              )}
            </p>

            <Input
              value={confirmPhrase}
              disabled={deleteAccountLoading}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder={t("sessions.delete_account.modal.input.placeholder")}
              className="text-center"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleDeleteAccount}
              className="w-full"
              color="danger"
              disabled={!isValid}
              isLoading={deleteAccountLoading}
            >
              {t("sessions.delete_account.modal.confirm")}
            </Button>

            {/* <Button
              variant="ghost"
              className="w-full text-gray-400"
              onClick={() => setOpenedDeleteModal(false)}
            >
              {t("common.cancel")}
            </Button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sessions;
