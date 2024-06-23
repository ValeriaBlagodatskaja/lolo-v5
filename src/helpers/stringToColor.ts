export default function stringToColor(str: string): string {
  const hashBase = 16 // Base for hexadecimal
  const shiftValue = 5 // Shift value used in hash calculation
  const bitMask = 0xff // Mask used to isolate the last 8 bits
  const fullColorComponentLength = 2 // Length of a full component in a hex color

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // Accumulate hash using both current character's code and existing hash
    hash = str.charCodeAt(i) + ((hash << shiftValue) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    // Right shift hash by 8*i bits, apply bit mask, and convert to hexadecimal string
    const value = (hash >> (i * 8)) & bitMask
    color += ('00' + value.toString(hashBase)).slice(-fullColorComponentLength)
  }

  return color
}
