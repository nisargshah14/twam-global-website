import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminContentService } from '../../services/admin-content.service';
import { ProductCategory } from '../../../models/content.model';

type ProductWithSlug = ProductCategory & { slug: string };

@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products-manager.html',
  styleUrl: '../shared-editor.scss',
})
export class ProductsManagerComponent implements OnInit {
  products = signal<ProductWithSlug[]>([]);
  loadError = signal('');

  constructor(private content: AdminContentService) {}

  ngOnInit(): void {
    this.content.getAllProducts().subscribe({
      next: (data) => this.products.set(data),
      error: () => this.loadError.set('Failed to load products.'),
    });
  }
}
