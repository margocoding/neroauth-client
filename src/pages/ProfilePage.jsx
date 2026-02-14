import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { invitationApi } from "../api/invitationApi";
import { userApi } from "../api/userApi";
import AnimatedArrow from "../components/ui/AnimatedArrow";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { exceptAxiosError } from "../utils/exceptAxiosError";

export default function ProfilePage() {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendLoading, setFriendLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [code, setCode] = useState(null);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    if (!loading && !user) navigate(`/${language}/auth`);
  }, [loading, user?._id]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await userApi.fetchProfile();

      setUser(data);

      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchInvitations = async () => {
      const data = await invitationApi.fetchInvitations();

      setInvitations(data);
    };

    fetchInvitations();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      const data = await userApi.fetchFriends(user._id);

      setFriends(data);
    };

    fetchFriends();
  }, [user?._id]);

  const deleteFriend = useCallback(async (id) => {
    setFriendLoading(true);
    try {
      await exceptAxiosError(() => userApi.deleteFriend(id));

      toast(t("profile.friend.success_delete"), { type: "success" });
      setFriends((prev) => prev.filter((friend) => friend._id !== id));
    } finally {
      setFriendLoading(false);
    }
  }, []);

  const inviteFriend = useCallback(async () => {
    if (!code) return;
    await exceptAxiosError(() => invitationApi.createInvite(code));

    toast(t("profile.friend.invite_code.success_invite"), {
      type: "success",
    });
    setCode(null);
  }, [code, t]);

  const applyInvitation = useCallback(
    async (id) => {
      setInviteLoading(true);
      try {
        const foundInvitation = invitations.find(
          (invitation) => invitation._id === id,
        );

        if (!foundInvitation) return;

        await exceptAxiosError(() =>
          invitationApi.applyInvitation(foundInvitation._id),
        );

        toast(t("profile.friend.invite_code.success_apply"), {
          type: "success",
        });

        setInvitations((prev) =>
          prev.filter((invitation) => invitation._id !== foundInvitation._id),
        );
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
        const foundInvitation = invitations.find(
          (invitation) => invitation._id === id,
        );

        if (!foundInvitation) return;

        await exceptAxiosError(() =>
          invitationApi.applyInvitation(foundInvitation._id),
        );

        toast(t("profile.friend.invite_code.success_decline"), {
          type: "success",
        });

        setInvitations((prev) =>
          prev.filter((invitation) => invitation._id !== foundInvitation._id),
        );
      } finally {
        setInviteLoading(false);
      }
    },
    [invitations, t],
  );

  if (!user) return;

  return (
    <div className="max-w-[500px] mx-auto flex flex-col justify-center gap-5">
      <h2 className="text-3xl text-center font-semibold">
        {t("profile.title")}
      </h2>

      <div className="flex flex-col gap-3">
        <Input label={t("auth.emailInput")} value={user.email} disabled />
        <Input label={t("auth.login")} value={user.login} disabled />
        <Input
          label={t("profile.friend.invite_code.placeholder")}
          value={user.inviteCode}
          disabled
        />
      </div>

      <div className="space-y-5">
        <h2 className="text-3xl font-semibold text-center">
          {t("profile.friend.invite_code.title")}
        </h2>
        <div className="space-y-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("profile.friend.invite_code.placeholder")}
            type="number"
          />
          <Button className={'w-full'} onClick={inviteFriend} disabled={!code}>
            {t("profile.friend.add")} <AnimatedArrow condition={code} />{" "}
          </Button>
        </div>
      </div>

      {friends.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-3xl text-center">
            {t("profile.friend.list")}
          </h2>
          <div className="grid grid-cols-3 max-md:grid-cols-2">
            {friends.map((friend) => (
              <div className="space-y-1">
                <div>
                  <img
                    src="/icons/user.svg"
                    width={100}
                    height={100}
                    alt="user"
                    className="w-full"
                  />
                </div>
                <div className="text-center text-xl font-semibold">
                  {friend.login}
                </div>
                <div>
                  <Button
                    className={'w-full'}
                    onClick={() => deleteFriend(friend._id)}
                    color="danger"
                    isLoading={friendLoading}
                  >
                    {t("profile.friend.buttons.delete")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {invitations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-center">
            {t("profile.friend.invitations.title")}
          </h2>

          <div className="grid grid-cols-3 max-md:grid-cols-2">
            {invitations.map((invitation) => (
              <div className="space-y-3">
                <div>
                  <img
                    src="/icons/user.svg"
                    width={100}
                    height={100}
                    alt="user"
                    className="w-full"
                  />
                </div>
                <div className="text-center text-xl font-semibold">
                  {invitation.from.login}
                </div>
                <div className="space-y-1">
                  <Button
                    className={'w-full'}
                    isLoading={inviteLoading}
                    color="success"
                    onClick={() => applyInvitation(invitation._id)}
                  >
                    {t("profile.friend.invitations.buttons.apply")}
                  </Button>
                  <Button
                    className={'w-full'}
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
}
