import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  readonly sections = [
    { label: 'Home Page', link: '../home', icon: 'home', desc: 'Hero, carousel, stats, why-us, CTA' },
    { label: 'About Page', link: '../about', icon: 'info', desc: 'Intro, stats, vision & mission' },
    { label: 'Contact Page', link: '../contact', icon: 'mail', desc: 'Contact details, certifications' },
    { label: 'Products', link: '../products', icon: 'box', desc: '8 product categories' },
    { label: 'Image Manager', link: '../images', icon: 'image', desc: 'Upload & manage banner/product images' },
  ];
}
