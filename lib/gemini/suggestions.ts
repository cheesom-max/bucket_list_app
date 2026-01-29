import { generateJSON } from './client'
import { GeminiSuggestionRequest } from '@/types'

export async function generateBucketListSuggestions(
  request: GeminiSuggestionRequest
): Promise<string[]> {
  const { category, difficulty, interests, age } = request

  let prompt = `Generate a list of 10 bucket list items that would be interesting and achievable.`

  if (category) {
    prompt += ` Focus on the category: ${category}.`
  }

  if (difficulty) {
    prompt += ` The difficulty level should be ${difficulty}.`
  }

  if (interests && interests.length > 0) {
    prompt += ` The person is interested in: ${interests.join(', ')}.`
  }

  if (age) {
    prompt += ` The person is ${age} years old.`
  }

  prompt += `\n\nReturn a JSON array of strings, each string being a bucket list item title. Example: ["Visit Paris", "Learn to play guitar", "Run a marathon"]`

  try {
    const suggestions = await generateJSON(prompt)
    if (Array.isArray(suggestions)) {
      return suggestions.slice(0, 10)
    }
    return []
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return []
  }
}

