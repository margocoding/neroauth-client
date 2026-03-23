import { useCallback, useEffect, useState } from "react";
import { authApi } from "../../../../api/authApi";
import Session from "./Session";
import { useTranslation } from "react-i18next";
import { exceptAxiosError } from "../../../../utils/exceptAxiosError";
import { toast } from "react-toastify";
import Button from "../../../ui/Button";
import Password from "./Password";

const Sessions = () => {
  const { t } = useTranslation();

  const [sessions, setSessions] = useState([]);

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
      const currentToken = localStorage.getItem("refreshToken");
      setSessions((prev) =>
        prev.filter((session) => session.token == currentToken),
      );
    }
  });

  return (
    <div className={"space-y-5"}>
      <Password clearSessions={clearSessions} />
      <h2 className="font-semibold text-3xl text-center">
        {t("sessions.title")}
      </h2>
      <div className={"space-y-3"}>
        {sessions.map((session) => (
          <Session
            key={session._id}
            isCurrentSession={
              session.token === localStorage.getItem("refreshToken")
            }
            closeSession={() => handleCloseSession(session._id)}
            os={session.device.os}
            deviceName={session.device.name}
            deviceType={session.device.deviceType}
            lastJoin={session.lastJoin}
            country={session.location.country}
            city={session.location.city}
            browser={session.device.browser}
          />
        ))}
      </div>

      {sessions.length > 1 && (
        <Button
          color={"danger"}
          onClick={handleCloseAllSessions}
          className={"w-full"}
        >
          {t("sessions.actions.buttons.close_all")}
        </Button>
      )}
    </div>
  );
};

export default Sessions;
