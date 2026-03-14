import React, { useCallback, useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { exceptAxiosError } from "../../utils/exceptAxiosError";

const Avatar = ({ path, self = false, className }) => {
  const [avatarPath, setAvatarPath] = useState(null);
  const [file, setFile] = useState(null);

  const handleChange = useCallback(async () => {
    if (file) {
      const avatarPath = await userApi.addAvatar(file);
      setAvatarPath(process.env.REACT_APP_API_URL + "/" + avatarPath);
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
  }, [file]);

  return (
    <div className={`space-y-3 max-w-32 ${className}`}>
      <div className={"relative"}>
        {self && (
          <>
            <input
              className="absolute w-full h-full p-0 m-[-1px] overflow-hidden clip opacity-0 cursor-pointer border-0 whitespace-nowrap"
              onChange={(e) =>
                e.target.files.length && setFile(e.target.files[0])
              }
              type="file"
            />

            {avatarPath && (
              <button
                onClick={handleDelete}
                className={
                  "absolute top-0 right-0 bg-red-400 w-7 h-7 rounded-full"
                }
              >
                <img src={"/icons/cross.svg"} alt={"close"} />
              </button>
            )}
          </>
        )}
        <img
          className="rounded-full aspect-square border-0"
          src={avatarPath || "/icons/user.svg"}
          alt="avatar"
        />
      </div>
    </div>
  );
};

export default Avatar;
