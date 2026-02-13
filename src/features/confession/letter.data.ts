export const letterRecipient = 'GUELDA'
export const letterSignature = 'M.A.'
export const letterMessage = 'I am writing this because my heart has become too full to keep its secret any longer. For a long time, I tried to convince myself that what I felt for you was just a wonderful, deep friendship. I told myself that the butterflies in my stomach were just a reaction to your bright energy, and that the way my eyes searched for you in a crowded room was just habit. But I cannot hide from the truth anymore. I am completely, deeply, and irrevocably in love with you.Every single day spent in your presence feels like a gift. You have this incredible ability to make the ordinary world feel vibrant and full of magic. Your laughter is my favorite sound in the universe, a sweet melody that can instantly clear away my darkest days. When you speak about the things you care about, your eyes light up with a passion that absolutely captivates me. I find myself hanging onto your every word, wanting to know every corner of your mind, every dream you harbor, and every fear you carry.It happened slowly, and then all at once. It was in the quiet moments we shared—the comfortable silences, the shared glances, and the effortless way we understand each other. I realized that my favorite parts of the day are always the ones that involve you. You have become my safe harbor and my greatest adventure all wrapped into one. When something good happens, you are the first person I want to tell. When things go wrong, your presence is the only comfort I seek. You have changed the texture of my life just by being a part of it.I love you not just for who you are, but for the person I become when I am with you. You inspire me to be kinder, braver, and truer to myself. Your gentleness challenges my armor, and your strength gives me courage. To love you feels as natural and essential as breathing.Please know that I am telling you this with zero expectations. I value our connection more than words can say, and the last thing I ever want to do is create distance or make you feel pressured. I only know that a love this profound cannot be kept in the shadows. It deserves to be spoken aloud, to be given a voice. You deserve to know how deeply you are appreciated, how fiercely you are admired, and how completely you are loved.If you do not feel the same way, I understand, and I will respect your feelings completely. But if there is even a small spark of the same warmth in your heart, please let me know. I would love nothing more than the chance to show you, every single day, just how much you mean to me.'

const wordsPerPage = 80

export function splitLetterIntoPages(message: string) {
  const words = message.trim().split(/\s+/)
  const pages: string[] = []

  for (let index = 0; index < words.length; index += wordsPerPage) {
    pages.push(words.slice(index, index + wordsPerPage).join(' '))
  }

  return pages
}
