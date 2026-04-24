import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminContentService } from '../../services/admin-content.service';
import { HasUnsavedChanges } from '../../guards/unsaved-changes.guard';
import { ProductCategory } from '../../../models/content.model';

@Component({
  selector: 'app-product-category-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-category-editor.html',
  styleUrl: '../shared-editor.scss',
})
export class ProductCategoryEditorComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private content = inject(AdminContentService);

  slug = '';
  saving = signal(false);
  saveSuccess = signal(false);
  loadError = signal('');

  form = this.fb.group({
    name: ['', Validators.required],
    emoji: [''],
    cover_image: [''],
    description: [''],
    products: this.fb.array([]),
  });

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.content.getProduct(this.slug).subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data.name,
          emoji: data.emoji,
          cover_image: data.cover_image,
          description: data.description,
        });
        data.products.forEach((p) =>
          this.productsArray.push(this.fb.group({ name: [p.name], sublabel: [p.sublabel], image: [p.image] }))
        );
        this.form.markAsPristine();
      },
      error: () => this.loadError.set('Failed to load product category.'),
    });
  }

  isDirty(): boolean { return this.form.dirty; }

  get productsArray(): FormArray { return this.form.get('products') as FormArray; }
  productGroup(i: number): FormGroup { return this.productsArray.at(i) as FormGroup; }

  addProduct(): void {
    this.productsArray.push(this.fb.group({ name: [''], sublabel: [''], image: [''] }));
  }
  removeProduct(i: number): void { this.productsArray.removeAt(i); }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.saveSuccess.set(false);
    this.content.saveProduct(this.slug, this.form.getRawValue() as ProductCategory).subscribe({
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
