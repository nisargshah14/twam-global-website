import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MediaPickerComponent } from '../../components/media-picker/media-picker';
import { AdminContentService } from '../../services/admin-content.service';
import { HasUnsavedChanges } from '../../guards/unsaved-changes.guard';
import { AboutContent } from '../../../models/content.model';

@Component({
  selector: 'app-about-editor',
  standalone: true,
  imports: [ReactiveFormsModule, MediaPickerComponent],
  templateUrl: './about-editor.html',
  styleUrl: '../shared-editor.scss',
})
export class AboutEditorComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private content = inject(AdminContentService);

  saving = signal(false);
  saveSuccess = signal(false);
  loadError = signal('');

  form = this.fb.group({
    heading: ['', Validators.required],
    subtext: [''],
    hero_image: [''],
    intro: this.fb.group({
      heading: [''],
      para1: [''],
      para2: [''],
      para3: [''],
      image: [''],
    }),
    stats: this.fb.array([]),
    vision: this.fb.group({ heading: [''], content: [''] }),
    mission: this.fb.group({ heading: [''], content: [''] }),
  });

  ngOnInit(): void {
    this.content.getPage<AboutContent>('about').subscribe({
      next: (data) => {
        this.form.patchValue({
          heading: data.heading,
          subtext: data.subtext,
          hero_image: data.hero_image,
          intro: data.intro,
          vision: data.vision,
          mission: data.mission,
        });
        data.stats.forEach((s) =>
          this.statsArray.push(this.fb.group({ num: [s.num], label: [s.label] }))
        );
        this.form.markAsPristine();
      },
      error: () => this.loadError.set('Failed to load about content.'),
    });
  }

  isDirty(): boolean { return this.form.dirty; }

  get statsArray(): FormArray { return this.form.get('stats') as FormArray; }
  statGroup(i: number): FormGroup { return this.statsArray.at(i) as FormGroup; }

  addStat(): void { this.statsArray.push(this.fb.group({ num: [''], label: [''] })); }
  removeStat(i: number): void { this.statsArray.removeAt(i); }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.saveSuccess.set(false);
    this.content.savePage('about', this.form.getRawValue() as AboutContent).subscribe({
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
