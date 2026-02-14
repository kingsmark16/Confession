export const letterRecipient = 'GUELDA'
export const letterSignature = 'M.A.'
export const letterMessage = `Hi… it’s me, Maria. Yeah, the name you called me when we first met. 😊

I actually started building this webpage on February 13, 2026, right after I realized I had fallen for you. Yieee. 💕 As someone in Info Tech, I thought this would be a unique and creative way to confess my feelings. I don’t know… maybe this is cringe or corny to you, but please don’t laugh, okay? 😅

I still remember the first time we met. What caught my attention right away was your smile and your energy. It felt so natural and warm. ✨ And your eyes… especially with your glasses on, I don’t know, they just looked perfect to me. 🤍

Then about a week later, that moment happened. You know it.When you suddenly startled me (ginulat mo ako) instead of the kid. 😳 I wasn’t even sure if it was really an accident, or if you did it on purpose just to tease me. But honestly, that was the exact moment something changed for me. 💫 That was when I started falling for you. 💖

Since then, you’ve been on my mind all the time, randomly and unexpectedly, no matter what I’m doing. And it’s strange, but in a good way. You made my life feel exciting again. 🌸 Waking up in the morning felt different, like I had something to look forward to. Like I had a reason to go to work, because there was a chance I’d see you. 😊

But then, things didn’t go the way I hoped. We were pulled out of the RHU and were reassigned to different department. I felt really sad, honestly. 💔 Not being able to see you anymore, it hurt more than I expected.

But instead of fading, my feelings for you only grew deeper. 💞

And the deeper my feelings became, the harder it was for me to confess. Because in my mind, we weren’t seeing each other anymore. I kept thinking that maybe you had already forgotten about me. And that thought scared me. 😔 It made me hold everything back, even when all I wanted was to tell you how I truly feel.

Even after I graduated, you never really left my mind. I still found myself thinking about you in the most random moments, like nothing had changed. 💭

So I decided to come back to this, to continue what I started and finally finish this page for you. 💻✨

And now, here it is.

I don’t know when or how you’ll find this, but I’m hoping that someday, somehow, you’ll get the chance to read this letter. 🌙 And when that day comes, I hope it brings a smile to your face, just like yours did to me. 😊

And maybe, just maybe, I hope that what I feel isn’t one-sided. 💗 I hope that somewhere in your heart, you felt something too. 💓`
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
