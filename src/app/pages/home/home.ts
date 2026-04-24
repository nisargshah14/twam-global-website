import { Component, OnInit, OnDestroy, inject, signal, AfterViewInit, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ContentService } from '../../services/content';
import { HomeContent, ProductCategory } from '../../models/content.model';

const BENTO_CLASSES: Record<string, string> = {
  spices: 'bc-spices', oilseeds: 'bc-oilseed', edibleoils: 'bc-edoils',
  sugar: 'bc-sugar', rice: 'bc-rice', raisins: 'bc-raisin',
  agri: 'bc-agri', pulses: 'bc-pulses',
};

const CATEGORY_SLUGS = ['spices', 'oilseeds', 'edibleoils', 'sugar', 'rice', 'raisins', 'agri', 'pulses'];

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private contentService = inject(ContentService);
  private el = inject(ElementRef);

  home = signal<HomeContent | null>(null);
  categories = signal<ProductCategory[]>([]);
  activeSlide = signal(0);
  marqueeItems: string[] = [];

  private carouselTimer?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });

    this.contentService.getHome().subscribe(data => {
      this.home.set(data);
      this.startCarousel(data.hero.carousel_slides.length);
      setTimeout(() => this.observeRevealElements(), 0);
    });
    this.contentService.getAllProducts().subscribe(cats => {
      this.categories.set(cats);
      this.marqueeItems = [...cats.map(c => c.name), ...cats.map(c => c.name)];
      setTimeout(() => this.observeRevealElements(), 0);
    });
  }

  ngAfterViewInit() {}

  private observeRevealElements() {
    this.el.nativeElement.querySelectorAll('.reveal:not([data-observed])').forEach((el: Element) => {
      el.setAttribute('data-observed', '1');
      this.observer!.observe(el);
    });
  }

  ngOnDestroy() {
    clearInterval(this.carouselTimer);
    this.observer?.disconnect();
  }

  startCarousel(count: number) {
    this.carouselTimer = setInterval(() => {
      this.activeSlide.update(i => (i + 1) % count);
    }, 5000);
  }

  prevSlide() {
    const count = this.home()?.hero.carousel_slides.length ?? 1;
    this.activeSlide.update(i => (i - 1 + count) % count);
  }

  nextSlide() {
    const count = this.home()?.hero.carousel_slides.length ?? 1;
    this.activeSlide.update(i => (i + 1) % count);
  }

  goToSlide(i: number) {
    this.activeSlide.set(i);
  }

  bentoClass(slug: string): string {
    return BENTO_CLASSES[slug] ?? '';
  }

  slugOf(cat: ProductCategory, index: number): string {
    return CATEGORY_SLUGS[index] ?? '';
  }

  bentoNum(i: number): string {
    return String(i + 1).padStart(2, '0');
  }
}
