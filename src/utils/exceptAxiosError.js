import i18next from "i18next";
import { toast } from "react-toastify";


export const exceptAxiosError = async (callback) => {
  try {
    return await callback();
  } catch (e) {
    console.log(e.response);
    if (e?.response?.data?.errors?.length) {
      e.response.data.errors.map(({ msg }) => toast(i18next.t(msg), { type: "error" }));
    } else if (e?.response?.data?.message) {
      toast(e.response.data.message, { type: "error" });
    }

    throw new Error();
  }
};
