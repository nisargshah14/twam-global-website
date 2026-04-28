import { Component, OnInit, OnDestroy, signal, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-goat-milk-option3',
  imports: [FormsModule, RouterLink],
  templateUrl: './option3.html',
  styleUrl: './option3.scss',
})
export class GoatMilkOption3Component implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  submitted = signal(false);
  submitting = signal(false);
  submitError = signal('');
  openFaq = signal<number | null>(null);
  private observer?: IntersectionObserver;

  form = { name: '', email: '', useCase: '', message: '' };
  errors: Record<string, string> = {};

  useCases = [
    'Infant Formula / Baby Food',
    'Sports & Nutrition Products',
    'Bakery & Confectionery',
    'Dietary Supplements',
    'Private Label Retail',
    'Hospitality / Food Service',
    'Other / General Enquiry',
  ];

  faqs = [
    { q: 'What is the minimum order quantity?', a: 'Our MOQ is 100 kg per order. We offer flexible packing in 5kg, 10kg, and 25kg bags. Custom packaging is available for orders above 500kg.' },
    { q: 'Do you provide a Certificate of Analysis?', a: 'Yes. Every batch comes with a full COA including protein, fat, moisture, heavy metals, and microbial testing from an accredited third-party lab.' },
    { q: 'Is your goat milk powder suitable for infant formula?', a: 'Our export-grade powder meets stringent purity standards. However, infant formula applications require regulatory compliance in your country. We can provide all technical documentation to support your application.' },
    { q: 'How is the product packaged for export?', a: 'Standard packaging is 25kg multi-layer paper bags with inner food-grade poly liner. We also offer 5kg and 10kg options, vacuum-sealed for extended shelf life.' },
    { q: 'Can you do private label / white label?', a: 'Yes. We support full private label with custom branding, bag design, and nutritional label formatting to match your market requirements.' },
  ];

  products = [
    { name: 'Full Cream Goat Milk Powder', fat: '26–28%', protein: '≥24%', use: 'Beverages, supplements, infant formula' },
    { name: 'Skimmed Goat Milk Powder', fat: '≤1.5%', protein: '≥32%', use: 'Sports nutrition, weight management' },
    { name: 'Spray-Dried Whole Milk', fat: '26%', protein: '≥24%', use: 'Bakery, confectionery, dairy blends' },
  ];

  testimonials = [
    { quote: 'Quality and consistency batch after batch. Twam Global has become our primary supplier for goat milk powder across Southeast Asia.', name: 'R. Sharma', role: 'Procurement Head, Dairy Brand — Singapore' },
    { quote: 'Fast response, thorough documentation, and a product that meets our strict EU import standards. Highly recommend.', name: 'M. Hoffmann', role: 'Import Director — Germany' },
  ];

  ngOnInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    setTimeout(() => this.observeRevealElements(), 0);
  }

  ngOnDestroy() { this.observer?.disconnect(); }

  private observeRevealElements() {
    this.el.nativeElement.querySelectorAll('.reveal:not([data-observed])').forEach((el: Element) => {
      el.setAttribute('data-observed', '1');
      this.observer!.observe(el);
    });
  }

  toggleFaq(i: number) {
    this.openFaq.set(this.openFaq() === i ? null : i);
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.name.trim()) this.errors['name'] = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) this.errors['email'] = 'Valid email is required';
    if (!this.form.useCase) this.errors['useCase'] = 'Please select a use case';
    return Object.keys(this.errors).length === 0;
  }

  async onSubmit() {
    if (!this.validate() || this.submitting()) return;
    this.submitting.set(true);
    this.submitError.set('');
    try {
      await fetch(environment.sheetsWebhookUrl, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: 'Goat Milk Landing — Option 3 (Story Journey)',
          ...this.form,
        }),
      });
      this.submitted.set(true);
      this.form = { name: '', email: '', useCase: '', message: '' };
      setTimeout(() => this.submitted.set(false), 8000);
    } catch {
      this.submitError.set('Could not submit. Please email us at info@twamglobal.com');
    } finally {
      this.submitting.set(false);
    }
  }
}
