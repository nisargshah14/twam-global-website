import { Component, OnInit, signal } from '@angular/core';
import { AdminContentService } from '../../services/admin-content.service';

@Component({
  selector: 'app-image-manager',
  standalone: true,
  imports: [],
  templateUrl: './image-manager.html',
  styleUrl: '../shared-editor.scss',
})
export class ImageManagerComponent implements OnInit {
  images = signal<Record<string, string[]>>({});
  uploading = signal(false);
  uploadFolder = signal<'banner' | 'product'>('product');
  loadError = signal('');
  copyFeedback = signal('');

  constructor(private content: AdminContentService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.content.listImages().subscribe({
      next: (data) => this.images.set(data),
      error: () => this.loadError.set('Failed to load images.'),
    });
  }

  get folders(): string[] { return Object.keys(this.images()); }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.content.uploadImage(file, this.uploadFolder()).subscribe({
      next: () => { this.uploading.set(false); this.load(); },
      error: () => this.uploading.set(false),
    });
  }

  copyPath(path: string): void {
    navigator.clipboard.writeText(path).then(() => {
      this.copyFeedback.set(path);
      setTimeout(() => this.copyFeedback.set(''), 2000);
    });
  }

  delete(folder: string, path: string): void {
    if (!confirm(`Delete ${path}?`)) return;
    const filename = path.split('/').pop() ?? '';
    this.content.deleteImage(folder, filename).subscribe({
      next: () => this.load(),
    });
  }

  filename(path: string): string {
    return path.split('/').pop() ?? path;
  }
}
