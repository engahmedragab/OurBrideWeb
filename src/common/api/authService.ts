import HttpClient from '@/common/httpClient'
import { AxiosResponse } from 'axios'
import { OurbrideApi } from '../ourbride-http-client'
import {
	EmailVarifyRequest,
	ProviderUserRequest,
	RefreshTokenRequest,
	SendEmailVarifyRequest,
	ServiceClass,
	UserInitRequest,
	UserRequest,
	PasswordRequest,
	ResetPasswordEmailRequest,
	ResetPasswordPhoneRequest,
	SendPhoneVarifyRequest,
	UserEmailRequest,
	UserType,
} from './gen/ourbride-api'
import { ProviderUserResponse } from '@/models/providers/ProviderUserResponse'

export interface AuthResponse {
	errors?: string[]
	success?: boolean
	token?: string
	refreshToken?: string
	user?: {
		type: UserType
		// Add other user fields as needed
	}
}

export interface ResetPasswordRequest {
	emailOrPhone: string
}

export interface ResetPasswordWithCodeRequest {
	emailOrPhone: string
	code: string
	newPassword: string
}

export interface BaseAuthResponse {
	errors?: string[]
	success?: boolean
	message?: string
}

export interface ChangePasswordRequest {
	currentPassword: string
	newPassword: string
}

export interface CheckAvailabilityRequest {
	email?: string
	phoneNumber?: string
}

export interface CheckAvailabilityResponse {
	exists: boolean
	message?: string
}

export const AuthService = {
	// Login method to authenticate the user and retrieve the token and other details
	// Supports both email and phone number for login
	login: async (emailOrPhone: string, password: string): Promise<AuthResponse> => {
		try {
			// Determine if input is email or phone number
			const isEmail = emailOrPhone.includes('@')
			
			let response: AuthResponse
			
			if (isEmail) {
				// Use email login endpoint
				response = await HttpClient.post<AuthResponse>(
					'/api/v1/identity/adminlogin',
					{
						email: emailOrPhone,
						password,
						isRestoreDeletedUser: false,
					}
				)
			} else {
				// Use phone login endpoint
				response = await HttpClient.post<AuthResponse>(
					'/api/v1/identity/phonelogin',
					{
						phoneNumber: emailOrPhone,
						password,
						isRestoreDeletedUser: false,
					}
				)
			}
			
			return response // Return the response data containing token, roles, and permissions
		} catch (error) {
			throw new Error('Login failed')
		}
	},

	// Register method (new method)
	// Supports both email and phone number registration
	register: async (
		email: string,
		password: string,
		confirmPassword: string,
		userName: string,
		phoneNumber: string,
		type: UserType,
		referralCode?: string
	): Promise<AuthResponse> => {
		try {
			// Ensure passwords match before sending the request
			if (password !== confirmPassword) {
				throw new Error('Passwords do not match')
			}
			let response: any
			if (email && email.includes('@')) {
				// Use email registration endpoint
				const res = await OurbrideApi.api.v1IdentityAdminregisterCreate({
					email,
					password,
					confirmPassword,
					userName,
					phoneNumber,
					type,
					referralCode,
				})
				response = res.data as any
			} else if (phoneNumber) {
				// Use phone registration endpoint with password
				const res = await OurbrideApi.api.v1IdentityPhoneregisterCreate({
					phoneNumber,
					password,
					type,
					countryCode: 20, // Default to Egypt, can be made configurable
					referralCode,
				})
				response = res.data as any
			} else {
				throw new Error('Either email or phone number is required')
			}
			return response // Return the response data containing token, roles, and permissions
		} catch (error: any) {
			// Provide more specific error messages
			if (error.response?.data?.message) {
				throw new Error(error.response.data.message)
			} else if (error.message) {
				throw new Error(error.message)
			} else {
				throw new Error('Registration failed')
			}
		}
	},

	// ✅ Verify email code
	refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
		const res = await OurbrideApi.api.v1IdentityRefreshCreate(data)
		return res.data as unknown as AuthResponse
	},

	// ✅ Verify email code
	verifyEmailCode: async (data: EmailVarifyRequest): Promise<AuthResponse> => {
		const res = await OurbrideApi.api.v1IdentityEmailvarifyCreate(data)
		return res.data as unknown as AuthResponse
	},

	// ✅ Send verification code to email
	sendVerificationEmail: async (data: SendEmailVarifyRequest) => {
		const res = await OurbrideApi.api.v1IdentitySendcodeMialCreate(data)
		return res
	},

	// ✅ Call profile init API with user init request
	initProviderUserProfile: async (data: UserInitRequest) => {
		const res = await OurbrideApi.api.v1ProfileInitCreate(data)
		return res
	},

	getProviderUserProfile: async (): Promise<ProviderUserResponse> => {
		const res = await OurbrideApi.api.v1UserManagementProviderUserList()
		const response = (res.data as any)?.data as ProviderUserResponse
		if (!response) {
			throw new Error('Failed to get user profile')
		}
		return response
	},

	updateProviderUserProfile: async (
		data: ProviderUserRequest
	): Promise<ProviderUserResponse> => {
		const res = await OurbrideApi.api.v1UserManagementProviderUserCreate(data)
		const response = res.data as unknown as ProviderUserResponse
		if (!response) {
			throw new Error('Failed to update provider user profile')
		}
		return response
	},

	// 🔐 Password Reset and Change Methods

	// Send reset password code (email)
	sendResetCodeEmail: async (email: string): Promise<BaseAuthResponse> => {
		try {
			const data: SendEmailVarifyRequest = { email }
			const res = await OurbrideApi.api.v1ResetpasswordSendcodeEmailCreate(data)
			return (res.data as unknown) as BaseAuthResponse
		} catch (error) {
			throw new Error('Failed to send reset code to email')
		}
	},

	// Send reset password code (phone)
	sendResetCodePhone: async (phoneNumber: string, countryCode: number = 20): Promise<BaseAuthResponse> => {
		try {
			const data: SendPhoneVarifyRequest = { phone: phoneNumber, countryCode }
			const res = await OurbrideApi.api.v1ResetpasswordSendcodePhoneCreate(data)
			return (res.data as unknown) as BaseAuthResponse
		} catch (error) {
			throw new Error('Failed to send reset code to phone')
		}
	},

	// Reset password with email and code
	resetPasswordWithEmail: async (email: string, code: number, newPassword: string): Promise<AuthResponse> => {
		try {
			const data: ResetPasswordEmailRequest = { email, code, newPassword }
			const res = await OurbrideApi.api.v1ResetpasswordEmailCreate(data)
			return (res.data as unknown) as AuthResponse
		} catch (error) {
			throw new Error('Failed to reset password with email')
		}
	},

	// Reset password with phone and code
	resetPasswordWithPhone: async (phoneNumber: string, code: number, newPassword: string): Promise<AuthResponse> => {
		try {
			const data: ResetPasswordPhoneRequest = { phoneNumber, code, newPassword }
			const res = await OurbrideApi.api.v1ResetpasswordPhoneCreate(data)
			return (res.data as unknown) as AuthResponse
		} catch (error) {
			throw new Error('Failed to reset password with phone')
		}
	},

	// Change password (for authenticated users)
	changePassword: async (currentPassword: string, newPassword: string) => {
		try {
			const data: PasswordRequest = { 
				password: currentPassword, 
				newPassword: newPassword 
			}
			const res = await OurbrideApi.api.v1IdentityChangepasswordCreate(data)
			return res
		} catch (error) {
			throw new Error('Failed to change password')
		}
	},

	// Forgot password (send reset link)
	forgotPassword: async (email: string) => {
		try {
			const data: UserEmailRequest = { userEmail: email }
			const res = await OurbrideApi.api.v1IdentityForgetpasswordCreate(data)
			return res
		} catch (error) {
			throw new Error('Failed to send forgot password email')
		}
	},

	// Reset password with token
	resetPasswordWithToken: async (userEmail: string, token: string, password: string) => {
		try {
			const data = { userEmail, token, password }
			const res = await OurbrideApi.api.v1IdentityResetpasswordCreate(data)
			return res
		} catch (error) {
			throw new Error('Failed to reset password with token')
		}
	},

	// Check email availability (using email verification)
	checkEmailAvailability: async (email: string): Promise<CheckAvailabilityResponse> => {
		try {
			const data: SendEmailVarifyRequest = { email }
			const res = await OurbrideApi.api.v1IdentitySendcodeMialCreate(data)
			// If successful, email exists
			return { exists: true, message: 'Email exists' }
		} catch (error: any) {
			// If error indicates email doesn't exist
			if (error.response?.status === 404 || error.message?.includes('not found')) {
				return { exists: false, message: 'Email not found' }
			}
			throw new Error('Failed to check email availability')
		}
	},

	// Check phone availability (using phone verification)
	checkPhoneAvailability: async (phoneNumber: string, countryCode: number = 20): Promise<CheckAvailabilityResponse> => {
		try {
			const data: SendPhoneVarifyRequest = { phone: phoneNumber, countryCode }
			const res = await OurbrideApi.api.v1IdentitySendcodeCreate(data)
			// If successful, phone exists
			return { exists: true, message: 'Phone exists' }
		} catch (error: any) {
			// If error indicates phone doesn't exist
			if (error.response?.status === 404 || error.message?.includes('not found')) {
				return { exists: false, message: 'Phone not found' }
			}
			throw new Error('Failed to check phone availability')
		}
	},

	// Unified method to send reset code (determines email or phone automatically)
	sendResetCode: async (emailOrPhone: string): Promise<BaseAuthResponse> => {
		const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone)
		
		if (isEmail) {
			return await AuthService.sendResetCodeEmail(emailOrPhone)
		} else {
			return await AuthService.sendResetCodePhone(emailOrPhone)
		}
	},

	// Unified method to reset password with code
	resetPasswordWithCode: async (emailOrPhone: string, code: string, newPassword: string): Promise<AuthResponse> => {
		const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone)
		
		if (isEmail) {
			return await AuthService.resetPasswordWithEmail(emailOrPhone, parseInt(code), newPassword)
		} else {
			return await AuthService.resetPasswordWithPhone(emailOrPhone, parseInt(code), newPassword)
		}
	},

	// Resend reset code (same as sendResetCode)
	resendResetCode: async (emailOrPhone: string): Promise<BaseAuthResponse> => {
		return await AuthService.sendResetCode(emailOrPhone)
	},
}

