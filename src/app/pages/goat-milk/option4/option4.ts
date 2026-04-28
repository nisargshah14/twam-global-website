import { Component, OnInit, signal, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-goat-milk-option4',
  imports: [FormsModule, RouterLink],
  templateUrl: './option4.html',
  styleUrl: './option4.scss',
})
export class GoatMilkOption4Component implements OnInit {
  private el = inject(ElementRef);
  submitted = signal(false);
  submitting = signal(false);
  submitError = signal('');

  form = { name: '', email: '', phone: '', quantity: '' };
  errors: Record<string, string> = {};

  bullets = [
    'Spray-dried, low moisture (≤3.5%) — long shelf life',
    'Lab tested: protein ≥24%, fat 26–28%',
    'MOQ 100 kg · Custom packaging available',
    'FSSAI compliant · Export licensed',
    'Free sample on request',
  ];

  trustItems = ['FSSAI Certified', 'ISO Compliant', 'Export Licensed', 'Lab Tested — COA Provided', 'Sample Available'];

  quickBenefits = [
    { icon: '🚚', title: 'Fast Dispatch', desc: '7–14 day lead time from order confirmation.' },
    { icon: '🧪', title: 'Sample First', desc: 'Request a free 500g sample before committing to a bulk order.' },
    { icon: '📦', title: 'Flexible MOQ', desc: 'Start from 100 kg. Scale up with volume discounts.' },
  ];

  ngOnInit() {
    // Scroll to form smoothly when CTA is clicked
    const hero = this.el.nativeElement.querySelector('.hero-cta');
    if (hero) {
      hero.addEventListener('click', () => {
        this.el.nativeElement.querySelector('#lead-form')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.name.trim()) this.errors['name'] = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) this.errors['email'] = 'Valid email required';
    if (!this.form.phone.trim()) this.errors['phone'] = 'Phone is required';
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
          source: 'Goat Milk Landing — Option 4 (Laser Focus)',
          ...this.form,
        }),
      });
      this.submitted.set(true);
      this.form = { name: '', email: '', phone: '', quantity: '' };
      setTimeout(() => this.submitted.set(false), 8000);
    } catch {
      this.submitError.set('Could not submit. Email us at info@twamglobal.com');
    } finally {
      this.submitting.set(false);
    }
  }
}
