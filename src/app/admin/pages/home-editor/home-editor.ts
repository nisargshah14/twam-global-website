import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminContentService } from '../../services/admin-content.service';
import { HasUnsavedChanges } from '../../guards/unsaved-changes.guard';
import { HomeContent } from '../../../models/content.model';

@Component({
  selector: 'app-home-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home-editor.html',
  styleUrl: './home-editor.scss',
})
export class HomeEditorComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private content = inject(AdminContentService);

  saving = signal(false);
  saveSuccess = signal(false);
  loadError = signal('');

  form = this.fb.group({
    hero: this.fb.group({
      headline: ['', Validators.required],
      subheadline: [''],
      badge: [''],
      cta_text: [''],
      hero_image: [''],
      carousel_slides: this.fb.array([]),
      stats: this.fb.array([]),
    }),
    about_preview: this.fb.group({
      heading1: [''],
      heading2: [''],
      para1: [''],
      para2: [''],
      image_main: [''],
      image_accent: [''],
      badge_num: [''],
      badge_label: [''],
    }),
    why_us: this.fb.group({
      heading: [''],
      cards: this.fb.array([]),
    }),
    cta: this.fb.group({
      heading: [''],
      subtext: [''],
      image: [''],
    }),
  });

  ngOnInit(): void {
    this.content.getPage<HomeContent>('home').subscribe({
      next: (data) => this.patchForm(data),
      error: () => this.loadError.set('Failed to load home content.'),
    });
  }

  isDirty(): boolean { return this.form.dirty; }

  get carouselSlides(): FormArray { return this.form.get('hero.carousel_slides') as FormArray; }
  get stats(): FormArray { return this.form.get('hero.stats') as FormArray; }
  get whyCards(): FormArray { return this.form.get('why_us.cards') as FormArray; }

  private patchForm(data: HomeContent): void {
    this.form.patchValue({
      hero: {
        headline: data.hero.headline,
        subheadline: data.hero.subheadline,
        badge: data.hero.badge,
        cta_text: data.hero.cta_text,
        hero_image: data.hero.hero_image ?? '',
      },
      about_preview: data.about_preview,
      why_us: { heading: data.why_us.heading },
      cta: data.cta,
    });

    data.hero.carousel_slides.forEach((s) =>
      this.carouselSlides.push(this.fb.group({ image: [s.image], alt: [s.alt] }))
    );
    data.hero.stats.forEach((s) =>
      this.stats.push(this.fb.group({ num: [s.num], label: [s.label] }))
    );
    data.why_us.cards.forEach((c) =>
      this.whyCards.push(this.fb.group({ icon: [c.icon], title: [c.title], desc: [c.desc] }))
    );

    this.form.markAsPristine();
  }

  addSlide(): void { this.carouselSlides.push(this.fb.group({ image: [''], alt: [''] })); }
  removeSlide(i: number): void { this.carouselSlides.removeAt(i); }

  addStat(): void { this.stats.push(this.fb.group({ num: [''], label: [''] })); }
  removeStat(i: number): void { this.stats.removeAt(i); }

  addCard(): void { this.whyCards.push(this.fb.group({ icon: [''], title: [''], desc: [''] })); }
  removeCard(i: number): void { this.whyCards.removeAt(i); }

  slideGroup(i: number): FormGroup { return this.carouselSlides.at(i) as FormGroup; }
  statGroup(i: number): FormGroup { return this.stats.at(i) as FormGroup; }
  cardGroup(i: number): FormGroup { return this.whyCards.at(i) as FormGroup; }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.saveSuccess.set(false);
    this.content.savePage('home', this.form.getRawValue() as HomeContent).subscribe({
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
