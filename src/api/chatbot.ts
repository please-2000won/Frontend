import api from './axiosInstance';
import type { ApiResponse } from './authAPI';

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  answer: string;
}

export const postChatMessage = async (
  data: ChatbotRequest
): Promise<ApiResponse<ChatbotResponse>> => {
  const response = await api.post<ApiResponse<ChatbotResponse>>(
    '/api/v1/chat',
    data
  );
  return response.data;
};
