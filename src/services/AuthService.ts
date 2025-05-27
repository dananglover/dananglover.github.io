import { User } from '@/types';
import { authRepository } from '@/repositories/AuthRepository';

export class AuthService {
  constructor(private repository = authRepository) {}

  async signInWithGoogle() {
    return this.repository.signInWithGoogle();
  }

  async signOut() {
    return this.repository.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.repository.getCurrentUser();
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.repository.onAuthStateChange(callback);
  }
}

export const authService = new AuthService(); 