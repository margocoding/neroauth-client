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
    <div className={`relative flex-shrink-0 ${className || "w-32 h-32"}`}>
      {self && (
        <>
          <input
            className="absolute inset-0 w-full h-full p-0 m-0 opacity-0 cursor-pointer z-20"
            onChange={(e) => e.target.files?.length && setFile(e.target.files[0])}
            type="file"
            accept="image/*"
          />
          {avatarPath && (
            <button
              onClick={handleDelete}
              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all z-30 border-2 border-[#111] text-white"
              title={t("profile.avatar.buttons.delete")}
              type="button"
            >
              <FaTimes size={10} />
            </button>
          )}
        </>
      )}
      <img
        className="w-full h-full aspect-square rounded-full shadow-inner object-cover"
        src={avatarPath || "/icons/user.svg"}
        alt="avatar"
        onError={(e) => {
          e.currentTarget.src = "/icons/user.svg";
        }}
      />
    </div>
  );
};

export default Avatar;