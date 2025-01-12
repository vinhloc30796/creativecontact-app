import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginStaff } from '@/app/actions/auth/staff'
import { cookies } from 'next/headers'
import { usePayload } from '@/hooks/usePayload'
import { cookiePolicy } from '@/app/collections/staff'

// Mock the modules
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
    get: vi.fn(),
    toString: vi.fn()
  }))
}))

vi.mock('@/hooks/usePayload', () => ({
  usePayload: vi.fn()
}))

describe('loginStaff', () => {
  const mockUser = {
    id: '1',
    email: 'vinhloc30796@gmail.com',
    roles: ['check-in', 'admin'],
    name: 'Loc Nguyen',
    active: true,
    collection: 'staff',
    createdAt: '2025-01-12T08:20:06.415Z',
    updatedAt: '2025-01-12T08:23:04.414Z',
    lastLogin: '2025-01-12T08:23:04.402Z',
    loginAttempts: 0
  }

  const mockToken = 'mock-jwt-token'

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock usePayload implementation
    vi.mocked(usePayload).mockResolvedValue({
      login: vi.fn().mockResolvedValue({
        user: mockUser,
        token: mockToken
      })
    } as any)
  })

  it('should successfully authenticate staff and set cookies', async () => {
    // Arrange
    const formData = new FormData()
    formData.append('email', 'vinhloc30796@gmail.com')
    formData.append('password', 'validpassword')

    const mockCookieStore = {
      set: vi.fn(),
      get: vi.fn(),
      toString: vi.fn()
    }
    vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

    // Act
    const result = await loginStaff({
      data: null,
      error: null
    }, formData)

    // Assert
    expect(result.data).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      collection: mockUser.collection,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt
    })
    expect(result.error).toBeNull()

    // Verify cookies were set
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'payloadStaffAuth',
      'true',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
    )
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'payload-token',
      mockToken,
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
    )

    // Verify Payload login was called with correct parameters
    const payload = await usePayload()
    expect(payload.login).toHaveBeenCalledWith({
      collection: 'staff',
      data: {
        email: 'vinhloc30796@gmail.com',
        password: 'validpassword'
      }
    })
  })
})
