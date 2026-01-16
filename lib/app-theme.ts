'use client';

import { useSyncExternalStore } from 'react';
import { Observable } from '@/lib/observable';

// System

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
const isClient = typeof window !== 'undefined';

const INITIAL_SYSTEM_THEME =
  hasMatchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? AppTheme.DARK : AppTheme.LIGHT;

const systemThemeStore = new Observable<AppTheme>(INITIAL_SYSTEM_THEME);

const setSystemTheme = (theme: AppTheme) => systemThemeStore.set(theme);

const getSystemTheme = () => systemThemeStore.get();

if (hasMatchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    setSystemTheme(event.matches ? AppTheme.DARK : AppTheme.LIGHT);
  });
}

export const useSystemTheme = () => useSyncExternalStore(systemThemeStore.subscribe, systemThemeStore.get);

// User

export enum UserTheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

const USER_TO_APP_THEME: Record<UserTheme.LIGHT | UserTheme.DARK, AppTheme> = {
  [UserTheme.LIGHT]: AppTheme.LIGHT,
  [UserTheme.DARK]: AppTheme.DARK,
};

const USER_THEME_VALUES = Object.values(UserTheme);
export const isValidUserTheme = (value: string | null): value is UserTheme =>
  USER_THEME_VALUES.includes(value as UserTheme);

// const LOCALSTORAGE_KEY = `${(await getUser()).navIdent}/app_theme`;
const LOCALSTORAGE_KEY = '/app_theme';

const getLocalStorageTheme = async (): Promise<UserTheme> => {
  const storedValue = isClient ? localStorage.getItem(LOCALSTORAGE_KEY) : null;

  if (isValidUserTheme(storedValue)) {
    return storedValue;
  }

  // const legacyLocalstorageKey = `${(await getUser()).navIdent}/darkmode`;
  const legacyLocalstorageKey = '/darkmode';

  const legacyStoredValue = isClient ? localStorage.getItem(legacyLocalstorageKey) : null;

  if (legacyStoredValue === 'true') {
    return UserTheme.DARK;
  }
  if (legacyStoredValue === 'false') {
    return UserTheme.LIGHT;
  }

  return UserTheme.SYSTEM;
};

const userThemeStore = new Observable<UserTheme>(await getLocalStorageTheme());

export const setUserTheme = (theme: UserTheme) => userThemeStore.set(theme);

const getUserTheme = () => userThemeStore.get();

if (isClient) {
  window.addEventListener('storage', async (event) => {
    if (event.key === LOCALSTORAGE_KEY) {
      setUserTheme(isValidUserTheme(event.newValue) ? event.newValue : UserTheme.SYSTEM);
    }
  });
}

export const useUserTheme = () => useSyncExternalStore(userThemeStore.subscribe, userThemeStore.get);

// Combined

const getInitialTheme = (): AppTheme => {
  const userTheme = getUserTheme();

  if (userTheme === UserTheme.SYSTEM) {
    return getSystemTheme();
  }

  return USER_TO_APP_THEME[userTheme];
};

const appThemeStore = new Observable<AppTheme>(getInitialTheme());

userThemeStore.subscribe((userTheme) => {
  appThemeStore.set(userTheme === UserTheme.SYSTEM ? getSystemTheme() : USER_TO_APP_THEME[userTheme]);

  if (isClient) {
    localStorage.setItem(LOCALSTORAGE_KEY, userTheme);
  }
});

systemThemeStore.subscribe((systemTheme) => {
  if (getUserTheme() === UserTheme.SYSTEM) {
    appThemeStore.set(systemTheme);
  }
});

export const useAppTheme = () => useSyncExternalStore(appThemeStore.subscribe, appThemeStore.get, () => AppTheme.LIGHT);
