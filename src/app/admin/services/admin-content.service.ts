import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeContent, AboutContent, ContactContent, ProductCategory } from '../../models/content.model';

@Injectable({ providedIn: 'root' })
export class AdminContentService {
  constructor(private http: HttpClient) {}

  // Pages
  getPage<T>(page: 'home' | 'about' | 'contact') {
    return this.http.get<T>(`/api/content/pages/${page}`);
  }

  savePage(page: 'home' | 'about' | 'contact', data: HomeContent | AboutContent | ContactContent) {
    return this.http.put<{ ok: boolean }>(`/api/content/pages/${page}`, data);
  }

  // Products
  getAllProducts() {
    return this.http.get<(ProductCategory & { slug: string })[]>('/api/content/products');
  }

  getProduct(slug: string) {
    return this.http.get<ProductCategory>(`/api/content/products/${slug}`);
  }

  saveProduct(slug: string, data: ProductCategory) {
    return this.http.put<{ ok: boolean }>(`/api/content/products/${slug}`, data);
  }

  // Images
  listImages() {
    return this.http.get<Record<string, string[]>>('/api/images');
  }

  uploadImage(file: File, folder: 'banner' | 'product') {
    const form = new FormData();
    form.append('image', file);
    form.append('folder', folder);
    return this.http.post<{ path: string }>('/api/images/upload', form);
  }

  deleteImage(folder: string, filename: string) {
    return this.http.delete<{ ok: boolean }>(`/api/images/${folder}/${filename}`);
  }
}
