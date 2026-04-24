import { Component, OnInit, OnDestroy, inject, signal, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  about = signal<AboutContent | null>(null);
  private observer?: IntersectionObserver;

  ngOnInit() {
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
