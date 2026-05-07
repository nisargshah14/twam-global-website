import { Component, OnInit, OnDestroy, inject, signal, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ContentService } from '../../services/content';
import { AboutContent } from '../../models/content.model';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements OnInit, OnDestroy {
  private contentService = inject(ContentService);
  private el = inject(ElementRef);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  about = signal<AboutContent | null>(null);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.titleService.setTitle('About Us — TWAM GLOBAL | India\'s Trusted Agricultural Exporters');
    this.metaService.updateTag({ name: 'description', content: 'Learn about TWAM GLOBAL — a trusted Indian agricultural export company with over a decade of experience supplying premium spices, pulses, oilseeds, and more worldwide.' });
    this.metaService.updateTag({ property: 'og:title', content: 'About TWAM GLOBAL — India\'s Trusted Agricultural Exporters' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://twamglobal.com/about' });

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });

    this.contentService.getAbout().subscribe(data => {
      this.about.set(data);
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
}
