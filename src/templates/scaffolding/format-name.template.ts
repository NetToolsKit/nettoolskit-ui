/**
 * Name formatting scaffold utility.
 * Mirrors the reference `formatName` util for proper name capitalization.
 */

const LOWERCASE_WORDS = ['de', 'da', 'do', 'das', 'dos', 'di', 'du', 'e']

export function templateFormatName(name: string): string {
  if (!name) return ''

  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index > 0 && LOWERCASE_WORDS.includes(word)) {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
