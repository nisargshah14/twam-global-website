import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthService);
  if (auth.isAuthenticated()) return true;
  return inject(Router).createUrlTree(['/admin/login']);
};
