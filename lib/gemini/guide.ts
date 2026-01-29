import { generateJSON, generateText } from './client'

export type GuideQuestion = {
  question: string
  type: 'multiple_choice' | 'text' | 'number' | 'multi_select'
  options?: string[]
  key: string
}

export type GuideAnswers = {
  [key: string]: string | number | string[]
}

export async function generateGuideQuestions(
  previousAnswers?: GuideAnswers
): Promise<GuideQuestion[]> {
  let prompt = `You are a helpful assistant helping someone create their bucket list. 
Based on the conversation so far, generate 2-3 relevant questions to understand what they want to achieve in life.

${previousAnswers ? `Previous answers: ${JSON.stringify(previousAnswers)}` : 'This is the first set of questions.'}

Generate questions that will help discover:
- Their interests and passions
- Their current life situation
- What they want to experience or achieve
- Their constraints (budget, time, etc.)

Return a JSON array of question objects. Each question should have:
- question: string (the question text in Korean)
- type: "multiple_choice" | "text" | "number" | "multi_select"
- options: string[] (only for multiple_choice and multi_select types)
- key: string (unique identifier like "interests", "age", "budget", etc.)

Example format:
[
  {
    "question": "당신의 나이는 어떻게 되나요?",
    "type": "number",
    "key": "age"
  },
  {
    "question": "어떤 분야에 관심이 있으신가요?",
    "type": "multi_select",
    "options": ["여행", "음악", "스포츠", "요리", "예술", "기술", "자기계발", "봉사활동"],
    "key": "interests"
  }
]

Return only valid JSON, no markdown formatting.`

  try {
    const questions = await generateJSON(prompt)
    return questions as GuideQuestion[]
  } catch (error) {
    console.error('Error generating guide questions:', error)
    // Fallback questions
    return [
      {
        question: '당신의 나이는 어떻게 되나요?',
        type: 'number',
        key: 'age',
      },
      {
        question: '어떤 분야에 관심이 있으신가요? (여러 개 선택 가능)',
        type: 'multi_select',
        options: ['여행', '음악', '스포츠', '요리', '예술', '기술', '자기계발', '봉사활동'],
        key: 'interests',
      },
      {
        question: '버킷리스트를 달성하기 위해 사용할 수 있는 예산은 어느 정도인가요?',
        type: 'multiple_choice',
        options: ['10만원 이하', '10-50만원', '50-100만원', '100만원 이상', '예산 제한 없음'],
        key: 'budget',
      },
    ]
  }
}

export async function generatePersonalizedSuggestions(
  answers: GuideAnswers
): Promise<{ suggestions: string[]; explanation: string }> {
  let prompt = `Based on the following information about a person, generate personalized bucket list suggestions.

User Information:
${JSON.stringify(answers, null, 2)}

Generate:
1. 10-15 personalized bucket list items that match their interests, age, and situation
2. A brief explanation (2-3 sentences in Korean) of why these suggestions are suitable for them

Return a JSON object with:
- suggestions: string[] (array of bucket list item titles in Korean)
- explanation: string (brief explanation in Korean)

Example:
{
  "suggestions": ["파리 에펠탑 방문하기", "기타 배우기", "마라톤 완주하기"],
  "explanation": "당신의 관심사와 상황을 고려하여 다양한 경험을 할 수 있는 버킷리스트를 추천했습니다."
}

Return only valid JSON, no markdown formatting.`

  try {
    const result = await generateJSON(prompt)
    return result as { suggestions: string[]; explanation: string }
  } catch (error) {
    console.error('Error generating personalized suggestions:', error)
    return {
      suggestions: [],
      explanation: '추천을 생성하는 중 오류가 발생했습니다.',
    }
  }
}

export async function generateEncouragementMessage(answers: GuideAnswers): Promise<string> {
  const prompt = `사용자가 버킷리스트를 시작하려고 합니다. 다음 정보를 바탕으로 격려 메시지를 작성해주세요.

${JSON.stringify(answers, null, 2)}

2-3문장의 따뜻하고 격려하는 메시지를 한국어로 작성해주세요.`

  try {
    const message = await generateText(prompt)
    return message
  } catch (error) {
    console.error('Error generating encouragement:', error)
    return '버킷리스트를 시작하신 것을 축하합니다! 당신의 목표를 달성할 수 있을 거예요.'
  }
}

