import { Component, OnInit, OnDestroy, signal, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-goat-milk',
  imports: [FormsModule],
  templateUrl: './goat-milk.html',
  styleUrl: './goat-milk.scss',
})
export class GoatMilkComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private route = inject(ActivatedRoute);

  submitted = signal(false);
  submitting = signal(false);
  submitError = signal('');

  private observer?: IntersectionObserver;
  private utmParams: Record<string, string> = {};

  readonly whatsappLink = `https://wa.me/919727763616?text=Hi%2C%20I%27m%20interested%20in%20your%20Goat%20Milk%20Powder.%20Can%20you%20share%20pricing%20and%20sample%20details%3F`;

  form = { name: '', email: '', phone: '' };
  errors: Record<string, string> = {};

  ngOnInit() {
    document.body.classList.add('nav-dark');

    this.route.queryParams.subscribe(params => {
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => {
        if (params[k]) this.utmParams[k] = params[k];
      });
    });

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    setTimeout(() => this.observeRevealElements(), 0);
  }

  ngOnDestroy() {
    document.body.classList.remove('nav-dark');
    this.observer?.disconnect();
  }

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
          source: 'Goat Milk Landing Page',
          ...this.form,
          ...this.utmParams,
        }),
      });
      this.submitted.set(true);
      this.form = { name: '', email: '', phone: '' };
      setTimeout(() => this.submitted.set(false), 8000);
    } catch {
      this.submitError.set('Could not submit. Please WhatsApp us or email priyanka@twamglobal.com');
    } finally {
      this.submitting.set(false);
    }
  }

  benefits = [
    { icon: '🥛', title: 'Easier to Digest', desc: 'Natural A2 protein and smaller fat globules make goat milk powder gentler on the stomach than cow milk — ideal for sensitive consumers.' },
    { icon: '🌿', title: 'Rich in Nutrients', desc: 'High in calcium, potassium, vitamin A and B6. Naturally closer to human milk composition than any other dairy source.' },
    { icon: '🏔️', title: 'Spray-Dried Quality', desc: 'Low-temperature spray drying preserves nutrients. Every batch tested for heavy metals, pathogens, and moisture before dispatch.' },
  ];

  specs = [
    { label: 'Protein Content', value: '≥ 24%' },
    { label: 'Fat Content', value: '26–28%' },
    { label: 'Moisture', value: '≤ 3.5%' },
    { label: 'Shelf Life', value: '24 months (sealed)' },
    { label: 'Packaging', value: '25 kg bags / custom' },
    { label: 'Min. Order Qty', value: '100 kg' },
  ];

  testimonials = [
    { quote: 'Quality and consistency batch after batch. Twam Global has become our primary supplier for goat milk powder across Southeast Asia.', name: 'R. Sharma', role: 'Procurement Head, Dairy Brand · Singapore', initial: 'R' },
    { quote: 'Fast response, thorough documentation, and a product that meets our strict EU import standards. Highly recommended.', name: 'M. Hoffmann', role: 'Import Director · Germany', initial: 'M' },
  ];

  countries = ['🇸🇬 Singapore', '🇩🇪 Germany', '🇦🇪 UAE', '🇺🇸 USA', '🇬🇧 UK', '🇦🇺 Australia', '🇳🇱 Netherlands', '🇸🇦 Saudi Arabia'];
}
