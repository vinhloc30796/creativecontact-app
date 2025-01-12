import { loginStaff, signupStaff } from '@/app/actions/auth/staff'
import { usePayload } from '@/hooks/usePayload'
import { cookies } from 'next/headers'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

describe('signupStaff', () => {
  const mockNewStaff = {
    id: '2',
    email: 'newstaff@example.com',
    name: 'New Staff',
    roles: ['check-in', 'content-creator'],
    collection: 'staff',
    createdAt: '2025-01-12T08:20:06.415Z',
    updatedAt: '2025-01-12T08:23:04.414Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock usePayload implementation for signup
    vi.mocked(usePayload).mockResolvedValue({
      create: vi.fn().mockResolvedValue(mockNewStaff)
    } as any)
  })

  it('should successfully create a new staff member', async () => {
    // Arrange
    const formData = new FormData()
    formData.append('email', 'newstaff@example.com')
    formData.append('password', 'securepassword123')
    formData.append('confirmPassword', 'securepassword123')
    formData.append('name', 'New Staff')

    // Act
    const result = await signupStaff({
      data: null,
      error: null
    }, formData)

    // Assert
    expect(result.data).toEqual({
      id: mockNewStaff.id,
      email: mockNewStaff.email,
      collection: mockNewStaff.collection,
      createdAt: mockNewStaff.createdAt,
      updatedAt: mockNewStaff.updatedAt
    })
    expect(result.error).toBeNull()

    // Verify Payload create was called with correct parameters
    const payload = await usePayload()
    expect(payload.create).toHaveBeenCalledWith({
      collection: 'staff',
      data: {
        email: 'newstaff@example.com',
        password: 'securepassword123',
        name: 'New Staff',
        roles: ['check-in', 'content-creator'],
        active: true
      }
    })
  })

  it('should handle duplicate email error', async () => {
    // Arrange
    const formData = new FormData()
    formData.append('email', 'existing@example.com')
    formData.append('password', 'password123')
    formData.append('confirmPassword', 'password123')
    formData.append('name', 'Duplicate Staff')

    // Mock usePayload to throw duplicate key error
    vi.mocked(usePayload).mockResolvedValue({
      create: vi.fn().mockRejectedValue(new Error('duplicate key value violates unique constraint'))
    } as any)

    // Act
    const result = await signupStaff({
      data: null,
      error: null
    }, formData)

    // Assert
    expect(result.data).toBeNull()
    expect(result.error).toEqual({
      code: 'DUPLICATE_EMAIL',
      message: 'Email already exists'
    })
  })
})
