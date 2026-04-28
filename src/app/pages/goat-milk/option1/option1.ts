import { Component, OnInit, OnDestroy, signal, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-goat-milk-option1',
  imports: [FormsModule, RouterLink],
  templateUrl: './option1.html',
  styleUrl: './option1.scss',
})
export class GoatMilkOption1Component implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  submitted = signal(false);
  submitting = signal(false);
  submitError = signal('');
  private observer?: IntersectionObserver;

  form = { name: '', email: '', phone: '', company: '', quantity: '', message: '' };
  errors: Record<string, string> = {};

  ngOnInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    setTimeout(() => this.observeRevealElements(), 0);
  }

  ngOnDestroy() { this.observer?.disconnect(); }

  private observeRevealElements() {
    this.el.nativeElement.querySelectorAll('.reveal:not([data-observed])').forEach((el: Element) => {
      el.setAttribute('data-observed', '1');
      this.observer!.observe(el);
    });
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.name.trim()) this.errors['name'] = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) this.errors['email'] = 'Valid email is required';
    if (!this.form.phone.trim()) this.errors['phone'] = 'Phone number is required';
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
          source: 'Goat Milk Landing — Option 1 (Pure & Natural)',
          ...this.form,
        }),
      });
      this.submitted.set(true);
      this.form = { name: '', email: '', phone: '', company: '', quantity: '', message: '' };
      setTimeout(() => this.submitted.set(false), 8000);
    } catch {
      this.submitError.set('Could not submit. Please email us at info@twamglobal.com');
    } finally {
      this.submitting.set(false);
    }
  }

  benefits = [
    { icon: '🥛', title: 'Easier to Digest', desc: 'Natural A2 protein structure and smaller fat globules make goat milk powder gentler on the stomach than cow milk.' },
    { icon: '🌿', title: 'Rich in Nutrients', desc: 'High in calcium, potassium, vitamin A and B6. Naturally closer to human milk composition than any other dairy.' },
    { icon: '🏔️', title: 'Superior Quality', desc: 'Spray-dried at low temperatures to preserve nutrients. Tested for heavy metals, pathogens and moisture content.' },
  ];

  specs = [
    { label: 'Protein Content', value: '≥ 24%' },
    { label: 'Fat Content', value: '26–28%' },
    { label: 'Moisture', value: '≤ 3.5%' },
    { label: 'Shelf Life', value: '24 months (sealed)' },
    { label: 'Packaging', value: '25kg bags / custom' },
    { label: 'Min. Order Qty', value: '100 kg' },
  ];
}
