import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'home',
        loadComponent: () => import('./pages/home-editor/home-editor').then((m) => m.HomeEditorComponent),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about-editor/about-editor').then((m) => m.AboutEditorComponent),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact-editor/contact-editor').then((m) => m.ContactEditorComponent),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products-manager/products-manager').then((m) => m.ProductsManagerComponent),
      },
      {
        path: 'products/:slug',
        loadComponent: () =>
          import('./pages/product-category-editor/product-category-editor').then(
            (m) => m.ProductCategoryEditorComponent
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'media',
        loadComponent: () => import('./pages/image-manager/image-manager').then((m) => m.ImageManagerComponent),
      },
    ],
  },
  { path: 'login', component: LoginComponent },
];
