import api from './testApiClient';

export type AdminHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface AdminApiResult {
  status: number;
  data: unknown;
}

// 어드민 테스트 페이지 전용 범용 API 호출기.
// 실제 기능 코드(authAPI, financialInfoAPI 등)에서는 사용하지 않는다.
export const callAdminApi = async (
  method: AdminHttpMethod,
  path: string,
  body?: unknown
): Promise<AdminApiResult> => {
  const response = await api.request({
    url: path,
    method,
    data: body,
  });

  return { status: response.status, data: response.data };
};
