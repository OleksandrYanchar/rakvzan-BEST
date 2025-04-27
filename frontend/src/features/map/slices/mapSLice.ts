import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi, baseQueryWithReauth } from "../../../app/baseQuery";
import { unpackPrams } from "../../../utils/unpackPrams";

export const mapApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getPoints: builder.query({
        query: (body) =>({
             url: `/establishments/list?${unpackPrams(body)}`,
             method: 'GET',
        }),
      }),
      getPoint: builder.query({
        query: (id: number) =>({
             url: `/establishments/${id}`,
             method: 'GET',
        }),
      }),
      buildRoute: builder.query({
        query: (body: {lat_a: number, lon_a: number, lat_b: number, lon_b: number}) =>({
             url: `/establishments/generate_route?${unpackPrams(body)}`,
             method: 'GET',
        }),
      }),
    }),
  });

  export const { useLazyGetPointsQuery, useGetPointQuery, useLazyBuildRouteQuery, useLazyGetPointQuery } = mapApi