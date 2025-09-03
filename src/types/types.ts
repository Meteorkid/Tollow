export interface TextContent {
  title: string
  content: string
  source: string
  type: 'text' | 'epub'
}

export interface TypingStats {
  wpm: number
  accuracy: number
  totalWords: number
  typedWords: number
  errors: number
  timeElapsed: number
}

export interface TypingProgress {
  currentPosition: number
  typedText: string
  errors: number[]
  startTime: number
  isComplete: boolean
}
