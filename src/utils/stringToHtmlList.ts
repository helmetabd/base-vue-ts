// Utility to convert a newline-separated string into concatenated HTML tags.
// Example: "Urban\nSub-Urban" -> "<li>Urban</li><li>Sub-Urban</li>"

function escapeHtml(str: string): string {
  return str.replace(/[&<>'"]/g, (char) => {
    switch (char) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case "'": return '&#39;'
      case '"': return '&quot;'
      default: return char
    }
  })
}

export function stringToHtmlList(input: string | null | undefined, tag = 'li', delimiter = /\r?\n/): string {
  if (!input) return ''

  // Split by delimiter, trim each line, filter out empty
  const parts = input.split(delimiter).map(s => s.trim()).filter(Boolean)

  if (parts.length === 0) return ''

  // Build HTML by escaping content
  return parts.map(p => `<${tag}>${escapeHtml(p)}</${tag}>`).join('')
}

export default stringToHtmlList
