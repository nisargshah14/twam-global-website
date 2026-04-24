import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MediaPickerComponent } from '../../components/media-picker/media-picker';
import { AdminContentService } from '../../services/admin-content.service';
import { HasUnsavedChanges } from '../../guards/unsaved-changes.guard';
import { ContactContent } from '../../../models/content.model';

@Component({
  selector: 'app-contact-editor',
  standalone: true,
  imports: [ReactiveFormsModule, MediaPickerComponent],
  templateUrl: './contact-editor.html',
  styleUrl: '../shared-editor.scss',
})
export class ContactEditorComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private content = inject(AdminContentService);

  saving = signal(false);
  saveSuccess = signal(false);
  loadError = signal('');

  form = this.fb.group({
    company_name: ['', Validators.required],
    tagline: [''],
    founded: [''],
    email1: [''],
    email2: [''],
    phone1: [''],
    phone2: [''],
    address1: [''],
    address2: [''],
    address3: [''],
    hours: [''],
    maps_url: [''],
    hero_heading: [''],
    hero_tag: [''],
    hero_subtext: [''],
    hero_image: [''],
    info_heading: [''],
    info_subtext: [''],
    form_heading: [''],
    form_subtext: [''],
    certifications: this.fb.array([]),
    footer_text: [''],
    strip_response_time: [''],
    strip_countries: [''],
    city_heading: [''],
  });

  ngOnInit(): void {
    this.content.getPage<ContactContent>('contact').subscribe({
      next: (data) => {
        const { certifications, ...rest } = data;
        this.form.patchValue(rest);
        certifications.forEach((c) => this.certs.push(this.fb.control(c)));
        this.form.markAsPristine();
      },
      error: () => this.loadError.set('Failed to load contact content.'),
    });
  }

  isDirty(): boolean { return this.form.dirty; }

  get certs(): FormArray { return this.form.get('certifications') as FormArray; }

  addCert(): void { this.certs.push(this.fb.control('')); }
  removeCert(i: number): void { this.certs.removeAt(i); }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.saveSuccess.set(false);
    this.content.savePage('contact', this.form.getRawValue() as ContactContent).subscribe({
      next: () => {
        this.form.markAsPristine();
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: () => this.saving.set(false),
    });
  }
}
