import api from './axiosInstance';
import type { ApiResponse } from './authAPI';

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  answer: string;
  responseId: string;
}

export interface FeedbackRequest {
  responseId: string;
  message: string;
  answer: string;
  rating: 'LIKE' | 'DISLIKE';
  comment: string;
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

export const postChatFeedback = async (
  data: FeedbackRequest
): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>(
    '/api/v1/chat/feedback',
    data
  );
  return response.data;
};
