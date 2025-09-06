import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import LargeSecureStorage from "../../database/connector/storage/newLargeSecureStorage.ts";
import { BaseConfig } from "../../constants/index.ts";
import { ZodSchema } from "zod";

export const CarlogApiClient = () => {
    const api = axios.create({
        baseURL: BaseConfig.BACKEND_API_BASE_URL,
        headers: { "Content-Type": "application/json" }
    });

    api.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            const token = await LargeSecureStorage.getItem(BaseConfig.SECURE_STORAGE_KEY_TOKEN);

            if(token) config.headers["Authorization"] = `Bearer ${ token }`;

            return config;
        },
        (error) => Promise.reject(error)
    );

    createAxiosResponseInterceptor();

    function createAxiosResponseInterceptor() {
        const interceptor = api.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                if(error?.response?.status !== 401) return Promise.reject(error);

                //401 - UNAUTHORIZED = try refresh token and retry request
                const refreshToken = await LargeSecureStorage.getItem(BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN);
                if(!refreshToken) return;

                try {
                    api.interceptors.response.eject(interceptor);
                    const refreshEndpoint = "auth/refresh";
                    const body = { refreshToken };

                    const response = await axios.post(refreshEndpoint, JSON.stringify(body));
                    await LargeSecureStorage.setItem(BaseConfig.SECURE_STORAGE_KEY_TOKEN, response.data.access_token);
                    await LargeSecureStorage.setItem(
                        BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN,
                        response.data.refresh_token
                    );

                    error.response.config.headers["Authorization"] = `Bearer ${ response.data.access_token }`;
                    return axios(error.response.config); // recall the base request with new tokens
                } catch(error: AxiosError) {
                    console.log("Error at refresh token", error.message);

                    if(error?.response?.status === 400) throw { response: { status: 401 } };

                    return Promise.reject(error);
                } finally {
                    createAxiosResponseInterceptor();
                }
            }
        );
    }

    const get = async <Response>(
        endpoint: string,
        schema?: ZodSchema<Response>,
        config?: AxiosRequestConfig
    ): AxiosResponse<Response> => {
        const response = await api.get(endpoint, config);

        return { ...response, data: schema ? schema?.parse(response.data) : response.data };
    };

    const post = async <Response>(
        endpoint: string,
        body: any,
        schema?: ZodSchema<Response>,
        config?: AxiosRequestConfig
    ): AxiosResponse<Response> => {
        const response = await api.post(endpoint, body, config);

        return { ...response, data: schema ? schema?.parse(response.data) : response.data };
    };

    const put = async <Response>(
        endpoint: string,
        body: any,
        schema?: ZodSchema<Response>,
        config?: AxiosRequestConfig
    ): AxiosResponse<Response> => {
        const response = await api.put(endpoint, body, config);

        return { ...response, data: schema ? schema?.parse(response.data) : response.data };
    };

    const patch = async <Response>(
        endpoint: string,
        body: any,
        schema?: ZodSchema<Response>,
        config?: AxiosRequestConfigs
    ): AxiosResponse<Response> => {
        const response = await api.patch(endpoint, body, config);

        return { ...response, data: schema ? schema?.parse(response.data) : response.data };
    };

    const del = async <Response>(
        endpoint: string,
        schema: ZodSchema<Response>
    ): AxiosResponse<Response> => {
        const response = await api.delete(endpoint);

        return { ...response, data: schema ? schema?.parse(response.data) : response.data };
    };

    return { get, post, patch, put, del };
};

export type CarlogApi = ReturnType<typeof CarlogApiClient>;