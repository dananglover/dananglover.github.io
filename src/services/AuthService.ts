
import { User } from '@/types';
import { authRepository } from '@/repositories/AuthRepository';

export class AuthService {
  constructor(private repository = authRepository) {}

  async signInWithGoogle() {
    return this.repository.signInWithGoogle();
  }

  async signInWithEmail(email: string, password: string) {
    return this.repository.signInWithEmail(email, password);
  }

  async signUpWithEmail(email: string, password: string, name: string) {
    return this.repository.signUpWithEmail(email, password, name);
  }

  async updatePassword(newPassword: string) {
    return this.repository.updatePassword(newPassword);
  }

  async resetPasswordForEmail(email: string) {
    return this.repository.resetPasswordForEmail(email);
  }

  async signOut() {
    return this.repository.signOut();
  }

  async restoreSession() {
    return this.repository.getSession();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.repository.getCurrentUser();
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.repository.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
