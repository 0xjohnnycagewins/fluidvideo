import { useHttpClient } from 'provider/http-client-provider';
import { isNil } from 'ramda';
import { useMutation, useQuery, UseQueryResult } from 'react-query';
import { Stream } from 'service/http/model/stream';

export const useGetStream = (streamId: string | undefined): UseQueryResult<Stream | null> => {
  const httpClient = useHttpClient();
  return useQuery<Stream | null>('getStream', () => {
    if (isNil(streamId)) {
      return null;
    }
    return httpClient.get(`stream/${streamId}`).then((res) => res.data);
  });
};

export const useGetStreams = (): UseQueryResult<Stream[]> => {
  const httpClient = useHttpClient();
  return useQuery<Stream[]>('getStreams', () =>
    httpClient.get(`stream?streamsonly=1`).then((res) => res.data),
  );
};

export const useCreateStream = () => {
  const httpClient = useHttpClient();
  return useMutation((name: string) =>
    httpClient
      .post(`stream`, {
        name,
        profiles: [
          {
            name: '720p',
            bitrate: 2000000,
            fps: 30,
            width: 1280,
            height: 720,
          },
          {
            name: '480p',
            bitrate: 1000000,
            fps: 30,
            width: 854,
            height: 480,
          },
          {
            name: '360p',
            bitrate: 500000,
            fps: 30,
            width: 640,
            height: 360,
          },
        ],
      })
      .then((res) => res.data),
  );
};
