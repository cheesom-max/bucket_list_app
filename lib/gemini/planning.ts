import { generateJSON } from './client'
import { BucketPlanResponse } from '@/types'

export async function generateBucketPlan(
  title: string,
  description?: string
): Promise<BucketPlanResponse> {
  let prompt = `Create a detailed action plan for achieving this bucket list item: "${title}"`

  if (description) {
    prompt += `\nDescription: ${description}`
  }

  prompt += `\n\nProvide a comprehensive plan with:
1. Steps: An array of step objects, each with:
   - title: string
   - description: string
   - order: number
   - estimatedTime: string (optional)

2. Timeline: An object with:
   - estimatedDuration: string
   - milestones: Array of {date: string, description: string}

3. Resources: An object with:
   - cost: string (optional)
   - time: string (optional)
   - materials: string[] (optional)

4. Obstacles: An array of objects with:
   - obstacle: string
   - solution: string

Return valid JSON only.`

  try {
    const plan = await generateJSON(prompt)
    return plan as BucketPlanResponse
  } catch (error) {
    console.error('Error generating plan:', error)
    throw new Error('Failed to generate bucket list plan')
  }
}

