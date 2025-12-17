import funcUrls from '../../backend/func2url.json';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export interface User {
  id: number;
  google_id: string;
  email: string;
  name: string;
  avatar_url: string;
}

export async function loginWithGoogle(credential: string): Promise<User> {
  const payload = JSON.parse(atob(credential.split('.')[1]));
  
  const response = await fetch(funcUrls.auth, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      google_id: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar_url: payload.picture
    })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const user = await response.json();
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function logout() {
  localStorage.removeItem('user');
}

export async function uploadAvatar(imageBase64: string, userId: number): Promise<string> {
  const response = await fetch(funcUrls['upload-avatar'], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId.toString()
    },
    body: JSON.stringify({
      image: imageBase64,
      user_id: userId
    })
  });

  if (!response.ok) {
    throw new Error('Avatar upload failed');
  }

  const data = await response.json();
  return data.url;
}
