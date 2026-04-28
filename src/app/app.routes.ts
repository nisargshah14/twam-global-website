import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { ProductsComponent } from './pages/products/products';
import { ContactComponent } from './pages/contact/contact';
import { GoatMilkIndexComponent } from './pages/goat-milk/index/index';
import { GoatMilkOption1Component } from './pages/goat-milk/option1/option1';
import { GoatMilkOption2Component } from './pages/goat-milk/option2/option2';
import { GoatMilkOption3Component } from './pages/goat-milk/option3/option3';
import { GoatMilkOption4Component } from './pages/goat-milk/option4/option4';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'goat-milk', component: GoatMilkIndexComponent },
  { path: 'goat-milk/option-1', component: GoatMilkOption1Component },
  { path: 'goat-milk/option-2', component: GoatMilkOption2Component },
  { path: 'goat-milk/option-3', component: GoatMilkOption3Component },
  { path: 'goat-milk/option-4', component: GoatMilkOption4Component },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
