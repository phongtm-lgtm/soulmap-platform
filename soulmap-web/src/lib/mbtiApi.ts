import type { Question } from '../types';

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

type MbtiQuestionsData = {
  totalQuestions: number;
  questions: {
    questionId: number;
    stt: number;
    text: string;
    options: {
      id: string;
      text: string;
    }[];
  }[];
};

type MbtiResultData = {
  type: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
}

export async function fetchMbtiQuestions(): Promise<Question[]> {
  const data = await request<MbtiQuestionsData>('/mbti/questions');

  return data.questions.map((question) => ({
    id: question.questionId,
    questionText: question.text,
    options: question.options.map((option) => ({
      key: option.id.toUpperCase() as 'A' | 'B',
      text: option.text,
      mbtiValue: '',
    })),
  }));
}

export async function submitMbtiAnswers(answers: Record<number, 'A' | 'B'>): Promise<string> {
  const data = await request<MbtiResultData>('/mbti/results', {
    method: 'POST',
    body: JSON.stringify({
      answers: Object.entries(answers)
        .map(([questionId, optionId]) => ({
          questionId: Number(questionId),
          optionId: optionId.toLowerCase(),
        }))
        .sort((a, b) => a.questionId - b.questionId),
    }),
  });

  return data.type;
}
