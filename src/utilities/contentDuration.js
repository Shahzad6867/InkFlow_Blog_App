export function contentDuration(content) {
    const words = content?.trim().split(/\s+/).length;
    const duration = Math.ceil(words/200)
  return duration
}
