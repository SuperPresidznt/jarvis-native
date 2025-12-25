/**
 * AI API Service
 * Handles AI chat and natural language processing
 */

import { ENDPOINTS } from '../constants/config';
import { ChatMessage, ChatSession } from '../types';
import apiService from './api';

export interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  message: ChatMessage;
  sessionId: string;
  suggestions?: string[];
}

export interface NLCaptureRequest {
  input: string;
}

export interface NLCaptureResponse {
  intent: string;
  entities: Record<string, any>;
  action?: {
    type: string;
    data: Record<string, any>;
  };
}

export const aiApi = {
  /**
   * Send a message to the AI assistant
   */
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    return await apiService.post(ENDPOINTS.AI.CHAT, request);
  },

  /**
   * Process natural language input to extract structured data
   */
  nlCapture: async (request: NLCaptureRequest): Promise<NLCaptureResponse> => {
    return await apiService.post(ENDPOINTS.AI.NL_CAPTURE, request);
  },

  /**
   * Get chat history for a session
   */
  getChatHistory: async (sessionId: string): Promise<ChatSession> => {
    return await apiService.get(`${ENDPOINTS.AI.CHAT}/${sessionId}`);
  },

  /**
   * List all chat sessions
   */
  listSessions: async (): Promise<ChatSession[]> => {
    return await apiService.get(`${ENDPOINTS.AI.CHAT}/sessions`);
  },
};
