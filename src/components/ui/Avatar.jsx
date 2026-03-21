import React, { useCallback, useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { exceptAxiosError } from "../../utils/exceptAxiosError";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Avatar = ({ path, self = false, className }) => {
  const { t } = useTranslation();
  const [avatarPath, setAvatarPath] = useState(null);
  const [file, setFile] = useState(null);

  const handleChange = useCallback(async () => {
    if (file) {
      const newPath = await userApi.addAvatar(file);
      setAvatarPath(process.env.REACT_APP_API_URL + "/" + newPath);
    }
  }, [file]);

  const handleDelete = useCallback(async () => {
    const { success } = await exceptAxiosError(() => userApi.deleteAvatar());
    if (success) {
      setAvatarPath(null);
    }
  }, []);

  useEffect(() => {
    if (path) {
      setAvatarPath(process.env.REACT_APP_API_URL + "/" + path);
    }
  }, [path]);

  useEffect(() => {
    handleChange();
  }, [file, handleChange]);

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="relative w-full h-full">
        {self && (
          <>
            <input
              className="absolute w-full h-full p-0 m-[-1px] overflow-hidden opacity-0 cursor-pointer border-0 whitespace-nowrap z-20"
              onChange={(e) => e.target.files?.length && setFile(e.target.files[0])}
              type="file"
              accept="image/*"
            />

            {avatarPath && (
              <button
                onClick={handleDelete}
                className="absolute top-0 right-0 bg-red-400 w-7 h-7 rounded-full flex items-center justify-center z-30 shadow-md"
                title={t("profile.avatar.buttons.delete")}
              >
                <img src="/icons/cross.svg" alt="close" className="w-3 h-3" />
              </button>
            )}
          </>
        )}
        <img
          className="rounded-full w-full h-full aspect-square shadow-inner"
          src={avatarPath || "/icons/user.svg"}
          alt="avatar"
          onError={(e) => {
            e.currentTarget.src = "/icons/user.svg";
          }}
        />
      </div>
    </div>
  );
};

export default Avatar;