import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {exceptAxiosError} from "../exceptAxiosError";
import {authApi} from "../../api/authApi";

export const useVerifyAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const refreshToken = async () => {
            try {
                await exceptAxiosError(() => authApi.refreshToken())
            } catch (e) {
                console.error(e);
                navigate('/auth');
            }
        }

        refreshToken();
    }, []);

    return null;
}