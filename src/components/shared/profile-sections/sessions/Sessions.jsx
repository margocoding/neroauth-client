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
      const currentToken = JSON.parse(localStorage.getItem("refreshToken")).value;
      setSessions((prev) =>
        prev.filter((session) => session.token === currentToken),
      );
    }
  }, [t]);

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
            className={"w-full font-bold bg-red-600 hover:bg-red-700 border-red-600 text-white"}
          >
            {t("sessions.actions.buttons.close_all")}
          </Button>
        </>
      )}
    </div>
  );
};

export default Sessions;
