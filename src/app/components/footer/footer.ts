import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content';
import { ContactContent } from '../../models/content.model';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent implements OnInit {
  private contentService = inject(ContentService);
  contact = signal<ContactContent | null>(null);
  year = new Date().getFullYear();

  ngOnInit() {
    this.contentService.getContact().subscribe(data => this.contact.set(data));
  }
}
