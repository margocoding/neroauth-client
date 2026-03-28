import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { invitationApi } from "../api/invitationApi";
import { userApi } from "../api/userApi";
import AnimatedArrow from "../components/ui/AnimatedArrow";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useUser } from "../store/user";
import { exceptAxiosError } from "../utils/exceptAxiosError";

const FriendsPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [friendLoading, setFriendLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [code, setCode] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      const data = await invitationApi.fetchInvitations();
      setInvitations(data);
    };

    fetchInvitations();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id) return;
      const data = await userApi.fetchFriends(user._id);
      setFriends(data);
    };

    fetchFriends();
  }, [user?._id]);

  const deleteFriend = useCallback(
    async (id) => {
      setFriendLoading(true);
      try {
        await exceptAxiosError(() => userApi.deleteFriend(id));
        toast(t("profile.friend.success_delete"), { type: "success" });
        setFriends((prev) => prev.filter((friend) => friend._id !== id));
      } finally {
        setFriendLoading(false);
      }
    },
    [t],
  );

  const inviteFriend = useCallback(async () => {
    if (!code) return;
    await exceptAxiosError(() => invitationApi.createInvite(code));
    toast(t("profile.friend.invite_code.success_invite"), { type: "success" });
    setCode("");
  }, [code, t]);

  const applyInvitation = useCallback(
    async (id) => {
      setInviteLoading(true);
      try {
        const foundInvitation = invitations.find((inv) => inv._id === id);
        if (!foundInvitation) return;
        await exceptAxiosError(() => invitationApi.applyInvitation(foundInvitation._id));
        toast(t("profile.friend.invite_code.success_apply"), { type: "success" });
        setInvitations((prev) => prev.filter((inv) => inv._id !== id));
        setFriends((prev) => [...prev, foundInvitation.from]);
      } finally {
        setInviteLoading(false);
      }
    },
    [invitations, t],
  );

  const declineInvitation = useCallback(
    async (id) => {
      setInviteLoading(true);
      try {
        const foundInvitation = invitations.find((inv) => inv._id === id);
        if (!foundInvitation) return;
        // Using applyInvitation for decline as well if that's the current API usage
        await exceptAxiosError(() => invitationApi.applyInvitation(foundInvitation._id));
        toast(t("profile.friend.invite_code.success_decline"), { type: "success" });
        setInvitations((prev) => prev.filter((inv) => inv._id !== id));
      } finally {
        setInviteLoading(false);
      }
    },
    [invitations, t],
  );

  return (
    <div className="space-y-4 max-w-[500px] mx-auto text-white">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold text-center">
          {t("profile.friend.invite_code.title")}
        </h2>
        <div className="space-y-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("profile.friend.invite_code.placeholder")}
          />
          <Button className={"w-full"} onClick={inviteFriend} disabled={!code}>
            {t("profile.friend.send_request")} <AnimatedArrow condition={!!code} />{" "}
          </Button>
        </div>
      </div>

      {friends.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-center my-2">
            <div className="divider w-full h-px rounded-full"></div>
          </div>
          <h2 className="font-semibold text-2xl text-center">
            {t("profile.friend.list")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends.map((friend) => (
              <div key={friend._id} className="space-y-2 bg-[#222] p-3 rounded-lg flex flex-col items-center text-center">
                <Avatar path={friend.avatar} className="w-20 h-20" />
                <div className="text-xl font-semibold truncate w-full px-2">
                  {friend.login}
                </div>
                <Button
                  className="w-full mt-auto"
                  onClick={() => deleteFriend(friend._id)}
                  color="danger"
                  isLoading={friendLoading}
                >
                  {t("profile.friend.buttons.delete")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {invitations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-center my-2">
            <div className="divider w-full h-px rounded-full"></div>
          </div>
          <h2 className="text-2xl font-semibold text-center">
            {t("profile.friend.invitations.title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {invitations.map((invitation) => (
              <div key={invitation._id} className="space-y-3 bg-[#222] p-3 rounded-lg flex flex-col items-center">
                <Avatar path={invitation.from.avatar} className="w-20 h-20" />
                <div className="text-center text-xl font-semibold truncate w-full px-2">
                  {invitation.from.login}
                </div>
                <div className="space-y-1 w-full mt-auto">
                  <Button
                    className="w-full"
                    isLoading={inviteLoading}
                    color="success"
                    onClick={() => applyInvitation(invitation._id)}
                  >
                    {t("profile.friend.invitations.buttons.apply")}
                  </Button>
                  <Button
                    className="w-full"
                    isLoading={inviteLoading}
                    color="danger"
                    onClick={() => declineInvitation(invitation._id)}
                  >
                    {t("profile.friend.invitations.buttons.decline")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
