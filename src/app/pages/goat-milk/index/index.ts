import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-goat-milk-index',
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class GoatMilkIndexComponent {
  options = [
    {
      number: '01',
      route: '/goat-milk/option-1',
      title: 'Pure & Natural',
      theme: 'Cream / Light',
      description: 'Warm, trust-building layout with cream background, large serif headline, benefit cards, product specs table, and a centered lead form. Best for organic/SEO traffic and health-conscious buyers.',
      badge: 'Best for: SEO & Organic Traffic',
      highlight: 'cream',
    },
    {
      number: '02',
      route: '/goat-milk/option-2',
      title: 'Premium Dark',
      theme: 'Dark Luxury',
      description: 'Brand-consistent dark luxury design with split-screen hero — product image with floating stat badges on the left, lead capture form on the right. Best for B2B importers and distributors.',
      badge: 'Best for: B2B Buyers & Distributors',
      highlight: 'dark',
    },
    {
      number: '03',
      route: '/goat-milk/option-3',
      title: 'Story Journey',
      theme: 'Narrative / Mixed',
      description: 'Scroll-through storytelling — cinematic hero, farm-to-pack story section, product variants grid, testimonials, and FAQ accordion. Best for content marketing and social media traffic.',
      badge: 'Best for: Content & Social Traffic',
      highlight: 'story',
    },
    {
      number: '04',
      route: '/goat-milk/option-4',
      title: 'Laser Focus',
      theme: 'Ultra-Minimal',
      description: 'Zero-distraction conversion page. Above-the-fold split with headline + bullets on the left and form on the right. No nav, no noise. Best for paid ad campaigns (Google/Meta).',
      badge: 'Best for: Paid Ads & Warm Leads',
      highlight: 'minimal',
    },
  ];
}
