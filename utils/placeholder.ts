export async function getPlaceholderImage(name: string): Promise<string> {
  const encodedUrl = encodeURIComponent(name);
  // Option 1: UI Avatars (simple, no API key needed)
  // return `https://ui-avatars.com/api/?name=${encodedUrl}&background=random`;

  // Option 2: DiceBear (more stylish)
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

  // Option 3: Gravatar with custom default
  // const hash = await generateMD5(name.toLowerCase().trim());
  // return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

// If using Gravatar, you'll need an MD5 hash function
async function generateMD5(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
} 