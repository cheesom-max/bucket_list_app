'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RightSidebar } from '@/components/layout/right-sidebar'
import { ChatInterface } from '@/components/gemini/chat-interface'
import { DiscoveryPanel } from '@/components/gemini/discovery-panel'
import type { Experience } from '@/types/chat'

// Sample experiences - in production, these would come from API
const sampleExperiences: Experience[] = [
  {
    id: '1',
    title: 'Visit the Northern Lights',
    description: 'Witness the magical aurora borealis in Iceland or Norway',
    category: 'Travel',
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Learn to Play Guitar',
    description: 'Master your favorite songs and express yourself through music',
    category: 'Skill',
    difficulty: 'medium',
  },
  {
    id: '3',
    title: 'Run a Marathon',
    description: 'Train for and complete a full 42km marathon',
    category: 'Health',
    difficulty: 'hard',
  },
  {
    id: '4',
    title: 'Start a Side Business',
    description: 'Turn your passion into a profitable venture',
    category: 'Career',
    difficulty: 'hard',
  },
]

export default function GuidePage() {
  const router = useRouter()
  const [experiences] = useState<Experience[]>(sampleExperiences)

  const handleSelectExperience = (experience: Experience) => {
    // Navigate to create new bucket item with pre-filled data
    router.push(`/dashboard/bucket-items/new?title=${encodeURIComponent(experience.title)}&description=${encodeURIComponent(experience.description)}&category=${encodeURIComponent(experience.category)}`)
  }

  return (
    <div className="flex flex-1 h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatInterface />
      </div>

      {/* Right Sidebar - Discovery Panel */}
      <RightSidebar className="border-l">
        <DiscoveryPanel
          experiences={experiences}
          onSelect={handleSelectExperience}
        />
      </RightSidebar>
    </div>
  )
}
