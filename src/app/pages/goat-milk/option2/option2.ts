import { Component, OnInit, OnDestroy, signal, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-goat-milk-option2',
  imports: [FormsModule, RouterLink],
  templateUrl: './option2.html',
  styleUrl: './option2.scss',
})
export class GoatMilkOption2Component implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  submitted = signal(false);
  submitting = signal(false);
  submitError = signal('');
  private observer?: IntersectionObserver;

  form = { name: '', email: '', phone: '', country: '', volume: '', company: '' };
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
    if (!this.form.name.trim()) this.errors['name'] = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) this.errors['email'] = 'Valid email is required';
    if (!this.form.phone.trim()) this.errors['phone'] = 'Phone is required';
    if (!this.form.country.trim()) this.errors['country'] = 'Country is required';
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
          source: 'Goat Milk Landing — Option 2 (Premium Dark)',
          ...this.form,
        }),
      });
      this.submitted.set(true);
      this.form = { name: '', email: '', phone: '', country: '', volume: '', company: '' };
      setTimeout(() => this.submitted.set(false), 8000);
    } catch {
      this.submitError.set('Could not submit. Please email us at info@twamglobal.com');
    } finally {
      this.submitting.set(false);
    }
  }

  stats = [
    { value: '≥24%', label: 'Protein' },
    { value: '26–28%', label: 'Fat Content' },
    { value: '99.9%', label: 'Purity' },
    { value: '24mo', label: 'Shelf Life' },
  ];

  benefits = [
    { icon: '💰', title: 'Competitive Pricing', desc: 'Direct farm-to-export pricing with no middlemen. Volume discounts available from 500kg+.' },
    { icon: '🧪', title: 'Lab Certified', desc: 'Every batch tested for protein, fat, moisture, heavy metals and microbial safety. COA on request.' },
    { icon: '📦', title: 'Custom Packaging', desc: 'Private label, custom bag sizes (5kg–25kg), and retail-ready packaging available.' },
  ];

  volumeOptions = ['100–500 kg / month', '500kg–1 MT / month', '1–5 MT / month', '5 MT+ / month'];

  scrollToForm() {
    this.el.nativeElement.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' });
  }
}
