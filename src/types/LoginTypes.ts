/**
 * Type definitions for Login related functionality
 */

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface GoogleOAuthState {
  isFormVisible: boolean;
  isEmailInputVisible: boolean;
  isNextButtonEnabled: boolean;
  hasCaptcha: boolean;
}

export interface LoginPageElements {
  anyteamLogo: boolean;
  continueWithGoogleButton: boolean;
  businessEmailHint: boolean;
  termsOfServiceLink: boolean;
  privacyPolicyLink: boolean;
}

export interface LoginTestData {
  validEmail: string;
  invalidEmail: string;
  businessEmail: string;
  personalEmail: string;
}

