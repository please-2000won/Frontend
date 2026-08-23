import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseURL,
});

//요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); //에러를 개별 함수로 던짐
  }
);

//응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          throw new Error('리프레쉬 토큰이 없습니다.');
        }

        //인터셉터가 붙지 않은 axios 사용
        const refreshResponse = await axios.post(
          `${baseURL}/api/v1/auth/refresh`,
          { refreshToken: refreshToken }
        );

        //백엔드에서 보내준 새 엑세스 토큰 꺼냄(응답 구조에 따른 수정 필요!!!)
        const newAccessToken = refreshResponse.data.accessToken;

        if (newAccessToken) {
          useAuthStore.setState({ accessToken: newAccessToken });

          //백에서 리프레쉬 토큰도 새로 발급해줬다면 교체
          if (refreshResponse.data.refreshToken) {
            useAuthStore.setState({
              refreshToken: refreshResponse.data.refreshToken,
            });
          }

          //방금 실패했던 요청의 헤더에 새 토큰 넣기
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          //새 토큰으로 원래 요청 전송
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('토큰 재발급 실패, 로그아웃', refreshError);

        useAuthStore.getState().clearAuth();
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          console.warn('잘못된 요청입니다 : ', error.response.data);
          break;
        case 403:
          console.warn(
            '해당 기능에 접근 권한이 없습니다 : ',
            error.response.data
          );
          break;
        case 404:
          console.error(
            '요청하신 데이터를 찾을 수 없습니다 : ',
            error.response.data
          );
          break;
        case 500:
          console.warn(
            '서버에 일시적인 문제가 발생했습니다. : ',
            error.response.data
          );
          break;

        default:
          console.error(`서버 오류 발생 (${status})`, error.response.data);
      }
    } else {
      // 서버에 닿지도 못하고 인터넷이 끊겼거나 CORS 에러가 났을 때
      alert('네트워크 연결이 불안정합니다. 인터넷 상태를 확인해주세요.');
    }

    return Promise.reject(error);
  }
);

export default api;
