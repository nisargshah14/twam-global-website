import {
  Component,
  forwardRef,
  inject,
  signal,
  computed,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { AdminContentService } from '../../services/admin-content.service';

@Component({
  selector: 'app-media-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './media-picker.html',
  styleUrl: './media-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MediaPickerComponent),
      multi: true,
    },
  ],
})
export class MediaPickerComponent implements ControlValueAccessor {
  @Input() label = 'Image';

  private contentService = inject(AdminContentService);

  value = signal('');
  open = signal(false);
  tab = signal<'library' | 'external'>('library');
  images = signal<Record<string, string[]>>({});
  loading = signal(false);
  uploading = signal(false);
  uploadError = signal('');
  uploadFolder = signal<'banner' | 'product'>('product');
  externalInput = signal('');
  disabled = signal(false);

  folders = computed(() => Object.keys(this.images()));
  allImages = computed(() =>
    this.folders().flatMap((f) => this.images()[f].map((p) => ({ path: p, folder: f })))
  );

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void {
    this.value.set(v ?? '');
    this.externalInput.set(v ?? '');
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled.set(d); }

  toggle(): void {
    if (this.disabled()) return;
    if (!this.open()) {
      this.refreshImages();
    }
    this.open.update((v) => !v);
    this.onTouched();
  }

  select(path: string): void {
    this.value.set(path);
    this.externalInput.set(path);
    this.onChange(path);
    this.open.set(false);
  }

  clear(): void {
    this.value.set('');
    this.externalInput.set('');
    this.onChange('');
  }

  applyExternal(): void {
    const v = this.externalInput().trim();
    this.value.set(v);
    this.onChange(v);
    this.open.set(false);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // reset so the same file can be picked again
    if (!file) return;

    this.uploading.set(true);
    this.uploadError.set('');

    this.contentService.uploadImage(file, this.uploadFolder()).subscribe({
      next: ({ path }) => {
        this.uploading.set(false);
        // Select immediately so the user sees it right away
        this.select(path);
        // Refresh list silently so future opens include the new image
        this.contentService.listImages().subscribe({
          next: (data) => this.images.set(data),
        });
      },
      error: () => {
        this.uploading.set(false);
        this.uploadError.set('Upload failed — check file type (jpg/png/webp) and size (max 5 MB).');
      },
    });
  }

  private refreshImages(): void {
    this.loading.set(true);
    this.contentService.listImages().subscribe({
      next: (data) => { this.images.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  filename(path: string): string {
    return path.split('/').pop() ?? path;
  }

  shortPath(path: string): string {
    return path.length > 45 ? '…' + path.slice(-42) : path;
  }
}
