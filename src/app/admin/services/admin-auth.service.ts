import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

const TOKEN_KEY = 'twam_admin_token';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly isAuthenticated = computed(() => {
    const t = this._token();
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  });

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>('/api/auth/login', { username, password }).pipe(
      tap(({ token }) => {
        localStorage.setItem(TOKEN_KEY, token);
        this._token.set(token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}
