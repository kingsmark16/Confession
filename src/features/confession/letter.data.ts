export const letterRecipient = import.meta.env.VITE_LETTER_RECIPIENT
export const letterSignature = import.meta.env.VITE_LETTER_SIGNATURE
export const letterMessage = import.meta.env.VITE_LETTER_MESSAGE

const wordsPerPage = 80

export function splitLetterIntoPages(message: string) {
  const paragraphs = message.trim().split(/\n\s*\n/)
  const pages: string[] = []
  let currentParagraphs: string[] = []
  let currentWordCount = 0

  const addPage = () => {
    if (currentParagraphs.length === 0) return
    pages.push(currentParagraphs.join('\n\n'))
    currentParagraphs = []
    currentWordCount = 0
  }

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/)

    for (let index = 0; index < words.length; index += wordsPerPage) {
      const chunk = words.slice(index, index + wordsPerPage)
      if (currentWordCount > 0 && currentWordCount + chunk.length > wordsPerPage) addPage()
      currentParagraphs.push(chunk.join(' '))
      currentWordCount += chunk.length
      if (currentWordCount >= wordsPerPage) addPage()
    }
  }

  addPage()
  return pages
}
