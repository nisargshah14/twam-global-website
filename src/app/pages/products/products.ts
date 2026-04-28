import { Component, OnInit, OnDestroy, inject, signal, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content';
import { ProductCategory } from '../../models/content.model';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private contentService = inject(ContentService);
  private el = inject(ElementRef);

  categories = signal<ProductCategory[]>([]);
  activeFilter = signal<string>('all');
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });

    this.contentService.getAllProducts().subscribe(cats => {
      this.categories.set(cats);
      setTimeout(() => this.observeRevealElements(), 0);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private observeRevealElements() {
    this.el.nativeElement.querySelectorAll('.reveal:not([data-observed])').forEach((el: Element) => {
      el.setAttribute('data-observed', '1');
      this.observer!.observe(el);
    });
  }

  setFilter(slug: string) {
    this.activeFilter.set(slug);
    if (slug !== 'all') {
      const el = this.el.nativeElement.querySelector(`#cat-${slug}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => this.observeRevealElements(), 0);
  }

  isVisible(index: number): boolean {
    const filter = this.activeFilter();
    if (filter === 'all') return true;
    return this.categorySlug(index) === filter;
  }

  scrollToSection(slug: string) {
    this.activeFilter.set('all');
    setTimeout(() => {
      const el = this.el.nativeElement.querySelector(`#cat-${slug}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  categorySlug(index: number): string {
    const slugs = ['spices', 'oilseeds', 'edibleoils', 'sugar', 'rice', 'raisins', 'agri', 'pulses'];
    return slugs[index] ?? '';
  }
}
