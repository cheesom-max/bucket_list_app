import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate text from Gemini API')
  }
}

export async function generateJSON(prompt: string): Promise<any> {
  try {
    const result = await geminiModel.generateContent(
      `${prompt}\n\nPlease respond with valid JSON only, no markdown formatting.`
    )
    const response = await result.response
    const text = response.text()
    
    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error('Gemini API JSON error:', error)
    throw new Error('Failed to generate JSON from Gemini API')
  }
}

