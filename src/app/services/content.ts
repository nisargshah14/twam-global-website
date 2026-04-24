import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeContent, AboutContent, ContactContent, ProductCategory } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);

  getHome(): Observable<HomeContent> {
    return this.http.get<HomeContent>('assets/content/pages/home.json');
  }

  getAbout(): Observable<AboutContent> {
    return this.http.get<AboutContent>('assets/content/pages/about.json');
  }

  getContact(): Observable<ContactContent> {
    return this.http.get<ContactContent>('assets/content/pages/contact.json');
  }

  getProductCategory(slug: string): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(`assets/content/products/${slug}.json`);
  }

  getAllProducts(): Observable<ProductCategory[]> {
    const slugs = ['spices', 'oilseeds', 'edibleoils', 'sugar', 'rice', 'raisins', 'agri', 'pulses'];
    return new Observable(observer => {
      const results: ProductCategory[] = [];
      let loaded = 0;
      slugs.forEach((slug, i) => {
        this.getProductCategory(slug).subscribe(cat => {
          results[i] = cat;
          loaded++;
          if (loaded === slugs.length) {
            observer.next(results);
            observer.complete();
          }
        });
      });
    });
  }
}
