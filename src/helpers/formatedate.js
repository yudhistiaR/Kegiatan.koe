export function formatDate(dateFormat) {
  const date = new Date(dateFormat)

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
