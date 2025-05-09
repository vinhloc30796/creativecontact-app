import { NextResponse } from 'next/server'
import { getCustomPayload } from '@/lib/payload/getCustomPayload'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  // Check if the secret is set
  if (!process.env.DISCORD_INTERNAL_API_SECRET) {
    console.error('DISCORD_INTERNAL_API_SECRET is not set.')
    // It's crucial not to leak that the secret is missing, so return a generic error
    return NextResponse.json({ error: 'Internal Server Error: Configuration missing' }, { status: 500 })
  }
  // Then set the secret
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || authHeader !== `Bearer ${process.env.DISCORD_INTERNAL_API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getCustomPayload()
    const updatedUser = await payload.update({
      collection: 'staffs',
      id: userId,
      data: {
        status: 'rejected',
        active: false,
      },
    })

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found or update failed' }, { status: 404 })
    }

    // Optionally, you could trigger an email notification here (Task D1.2)
    // For now, just return success
    return NextResponse.json({
      message: `User ${userId} rejected successfully.`,
      user: {
        id: updatedUser.id,
        status: updatedUser.status,
        active: updatedUser.active,
      },
    })
  } catch (error) {
    console.error(`Error rejecting user ${userId}:`, error)
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
