import { Component, OnInit, OnDestroy, inject, signal, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../services/content';
import { ContactContent } from '../../models/content.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent implements OnInit, OnDestroy {
  private contentService = inject(ContentService);
  private el = inject(ElementRef);

  contact = signal<ContactContent | null>(null);
  submitted = signal(false);
  submitting = signal(false);
  submitError = signal('');
  private observer?: IntersectionObserver;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  };

  errors: Record<string, string> = {};

  ngOnInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });

    this.contentService.getContact().subscribe(data => {
      this.contact.set(data);
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

  validate(): boolean {
    this.errors = {};
    if (!this.form.firstName.trim()) this.errors['firstName'] = 'First name is required';
    if (!this.form.lastName.trim()) this.errors['lastName'] = 'Last name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) this.errors['email'] = 'Valid email is required';
    if (!this.form.message.trim()) this.errors['message'] = 'Message is required';
    return Object.keys(this.errors).length === 0;
  }

  async onSubmit() {
    if (!this.validate() || this.submitting()) return;

    this.submitting.set(true);
    this.submitError.set('');

    const payload = {
      timestamp: new Date().toISOString(),
      name: `${this.form.firstName} ${this.form.lastName}`,
      email: this.form.email,
      phone: this.form.phone || '',
      message: this.form.message,
    };

    try {
      // Apps Script requires no-cors — response is opaque but data is written to the sheet
      await fetch(environment.sheetsWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      this.submitted.set(true);
      this.form = { firstName: '', lastName: '', email: '', phone: '', message: '' };
      setTimeout(() => this.submitted.set(false), 8000);
    } catch {
      this.submitError.set('Could not submit. Please email us directly at ' + (this.contact()?.email1 ?? ''));
    } finally {
      this.submitting.set(false);
    }
  }
}
