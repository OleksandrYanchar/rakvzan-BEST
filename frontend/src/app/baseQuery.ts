import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_HOST } from './config';

const baseQuery = fetchBaseQuery({
    baseUrl: `${API_HOST}/api/v1/ninja/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

const baseRegisterQuery = fetchBaseQuery({
    baseUrl: `${API_HOST}/api/v1/`,
  });
  
  export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: 'token/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
            //@ts-ignore
          localStorage.setItem('access', refreshResult.data.token);
          //@ts-ignore
          if (refreshResult.data.refreshToken) {
            //@ts-ignore
            localStorage.setItem('refresh', refreshResult.data.refreshToken);
          }
          result = await baseQuery(args, api, extraOptions);
        } else {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      }
    }
    return result;
  };

  export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (credentials) => ({
          url: 'token/pair',
          method: 'POST',
          body: credentials,
        }),
      }),
    }),
  });

  export const registerApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseRegisterQuery,
    endpoints: (builder) => ({
      register: builder.mutation({
        query: (credentials) => ({
          url: 'drf/auth/register/',
          method: 'POST',
          body: credentials,
        }),
      }),
    }),
  });

  export const { useLoginMutation } = baseApi
  export const { useRegisterMutation } = registerApi
  