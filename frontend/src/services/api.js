import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const uploadDocuments = async (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const queryAssistant = async (question, sessionId, geminiApiKey) => {
  const response = await axios.post(
    `${API_BASE_URL}/query`,
    {
      question,
      session_id: sessionId,
    },
    {
      headers: {
        'x-gemini-api-key': geminiApiKey,
      },
    }
  );
  return response.data;
};
