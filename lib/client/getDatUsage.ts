async function getDataUseage() {
  const response = await fetch('/api/storage/usage')
  if (!response.ok) {
    throw new Error('Failed to fetch data usage')
  }
  return response.json()
}

export { getDataUseage }