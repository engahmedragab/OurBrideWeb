import { useState, useEffect, createContext, useContext } from 'react';
import { UserType } from '../common/api/gen/ourbride-api';
import { jwtDecode } from 'jwt-decode';
import OurbrideHttpClient, { RequestUtils } from '../common/api/ourbride-http-client';

// Helper to get cookie (works in both browser and SSR)
const getCookie = (name) => {
  if (typeof window === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return undefined;
};

// Helper to set cookie
const setCookie = (name, value, days = 1) => {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
};

// AuthUser class definition
export class AuthUser {
  constructor(decodedToken) {
    this.id = decodedToken.nameIdentifier;
    this.email = decodedToken.email;
    this.userName = decodedToken.name;
    this.type = decodedToken.type;
    this.tier = decodedToken.tier;
    this.registerType = decodedToken.registerType;
    this.emailConfirmed = decodedToken.confirm === 'True';
    this.language = decodedToken.langClam;
    this.isInit = decodedToken.init === 'True';
    this.phoneNumber = decodedToken.mobilePhone;
    this.userId = decodedToken.sId;
    this.roles = decodedToken.role || [];
    this.permissions = decodedToken.Permission || [];
    this.guideProfileId = decodedToken.guideProfileId; // Extract if available in token
    this.profileUrl = decodedToken.profileUrl || '';
  }
}

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const authSessionKey = '_OURBRIDE_AUTH_';
const authTokenSessionKey = '_OURBRIDE_AUTH_TOKEN';
const authRefreshTokenSessionKey = '_OURBRIDE_AUTH_REFRESH_TOKEN';

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [refreshToken, setRefreshToken] = useState(undefined);

  useEffect(() => {
    const userCookie = getCookie(authSessionKey);
    if (userCookie && typeof userCookie === 'string') {
      try {
        const authUser: AuthUser = JSON.parse(userCookie);
        setAuthUser(authUser);

        // Also check for token and sync with HttpClient
        const token = getCookie(authTokenSessionKey) || localStorage.getItem('_OURBRIDE_AUTH_TOKEN');
        const refreshToken = getCookie(authRefreshTokenSessionKey) || localStorage.getItem('_OURBRIDE_AUTH_REFRESH_TOKEN');

        if (token) {
          setToken(token);
          RequestUtils.updateAuthToken(token);
        }

        if (refreshToken) {
          setRefreshToken(refreshToken);
        }
      } catch (error) {
        setAuthUser(undefined);
      }
    }
  }, []);

  const saveSession = (token, refreshToken) => {
    if (!token) {
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const authUser = new AuthUser(decodedToken);

      // Store in cookies and localStorage
      setCookie(authSessionKey, JSON.stringify(authUser), 1);
      setCookie(authTokenSessionKey, token, 1);
      if (refreshToken) {
        setCookie(authRefreshTokenSessionKey, refreshToken, 1);
      }

      localStorage.setItem('_OURBRIDE_AUTH_TOKEN', token);
      if (refreshToken) {
        localStorage.setItem('_OURBRIDE_AUTH_REFRESH_TOKEN', refreshToken);
      }

      setAuthUser(authUser);
      setToken(token);
      setRefreshToken(refreshToken);

      // Update HttpClient with the new token
      if (RequestUtils && typeof RequestUtils.updateAuthToken === 'function') {
        RequestUtils.updateAuthToken(token);
      }
      // Also update OurbrideHttpClient directly
      if (OurbrideHttpClient && typeof OurbrideHttpClient.updateAuthToken === 'function') {
        OurbrideHttpClient.updateAuthToken(token);
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const removeSession = async () => {
    // Reset state immediately
    setAuthUser(undefined);
    setToken(undefined);
    setRefreshToken(undefined);

    // Clear token from HttpClient
    if (RequestUtils && typeof RequestUtils.clearAuthToken === 'function') {
      RequestUtils.clearAuthToken();
    }
    // Also clear from OurbrideHttpClient directly
    if (OurbrideHttpClient && typeof OurbrideHttpClient.clearAuthToken === 'function') {
      OurbrideHttpClient.clearAuthToken();
    }

    // Clear cookies and localStorage
    if (typeof document !== 'undefined') {
      document.cookie = `${authSessionKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${authTokenSessionKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${authRefreshTokenSessionKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    localStorage.removeItem('_OURBRIDE_AUTH_TOKEN');
    localStorage.removeItem('_OURBRIDE_AUTH_REFRESH_TOKEN');
    localStorage.removeItem('guideProfileId');
  };

  return (
    <AuthContext.Provider
      value={{
        user: authUser,
        token: token,
        refreshToken: refreshToken,
        isAuthenticated: !!authUser && !!token,
        saveSession,
        removeSession,
      }}>
      {children}
    </AuthContext.Provider>
  );
};


