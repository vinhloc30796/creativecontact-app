async function getDataUsage(): Promise<number> {
  const response = await fetch('/api/storage/usage')
  if (!response.ok) {
    throw new Error('Failed to fetch data usage')
  }
  const data = await response.json()
  return data.result as number
}

export { getDataUsage }