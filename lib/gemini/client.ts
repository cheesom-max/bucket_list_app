import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

let _genAI: GoogleGenerativeAI | null = null
let _model: GenerativeModel | null = null

function getModel(): GenerativeModel {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }

  if (!_model) {
    _model = _genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  return _model
}

export const geminiModel = {
  generateContent: async (prompt: string) => {
    return getModel().generateContent(prompt)
  },
}

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await getModel().generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate text from Gemini API')
  }
}

export async function generateJSON(prompt: string): Promise<any> {
  try {
    const result = await getModel().generateContent(
      `${prompt}\n\nPlease respond with valid JSON only, no markdown formatting.`
    )
    const response = await result.response
    const text = response.text()

    // Remove markdown code blocks if present
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    return JSON.parse(cleanedText)
  } catch (error) {
    console.error('Gemini API JSON error:', error)
    throw new Error('Failed to generate JSON from Gemini API')
  }
}
