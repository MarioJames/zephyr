'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserManager } from 'oidc-client-ts';
import { userManager } from '../config/oidc';

interface OIDCContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  accessToken: string | null;
  refreshToken: string | null;
  refreshAccessToken: () => Promise<void>;
}

const OIDCContext = createContext<OIDCContextType | null>(null);

export function OIDCProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    if (!userManager) {
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const user = await userManager!.getUser();
        setUser(user);
        if (user) {
          setAccessToken(user.access_token || null);
          setRefreshToken(user.refresh_token || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'));
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    const handleUserLoaded = (user: User) => {
      setUser(user);
      setAccessToken(user.access_token || null);
      setRefreshToken(user.refresh_token || null);
      setIsLoading(false);
    };

    const handleUserUnloaded = () => {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setIsLoading(false);
    };

    const handleSilentRenewError = (error: Error) => {
      setError(error);
      setIsLoading(false);
    };

    userManager!.events.addUserLoaded(handleUserLoaded);
    userManager!.events.addUserUnloaded(handleUserUnloaded);
    userManager!.events.addSilentRenewError(handleSilentRenewError);

    return () => {
      userManager!.events.removeUserLoaded(handleUserLoaded);
      userManager!.events.removeUserUnloaded(handleUserUnloaded);
      userManager!.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, []);

  const login = async () => {
    if (!userManager) {
      setError(new Error('OIDC client not initialized'));
      return;
    }

    try {
      setIsLoading(true);
      await userManager.signinRedirect();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!userManager) {
      setError(new Error('OIDC client not initialized'));
      return;
    }

    try {
      setIsLoading(true);
      await userManager.signoutRedirect();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    if (!userManager || !user) {
      setError(new Error('OIDC client not initialized or user not logged in'));
      return;
    }

    try {
      setIsLoading(true);
      const newUser = await userManager.signinSilent();
      if (newUser) {
        setUser(newUser);
        setAccessToken(newUser.access_token || null);
        setRefreshToken(newUser.refresh_token || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Token refresh failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OIDCContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        accessToken,
        refreshToken,
        refreshAccessToken
      }}
    >
      {children}
    </OIDCContext.Provider>
  );
}

export function useOIDC() {
  const context = useContext(OIDCContext);
  if (!context) {
    throw new Error('useOIDC must be used within an OIDCProvider');
  }
  return context;
}
