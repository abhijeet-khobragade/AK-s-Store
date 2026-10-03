import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-filters',
  imports: [CommonModule, MatCardModule],
  templateUrl: './filters.component.html'
})
export class FiltersComponent {
  @Input() categories: string[] = [];
  @Input() selected: string | undefined;

  @Output() showCategory = new EventEmitter<string | undefined>();

  onShowCategory(category: string | undefined): void {
    this.showCategory.emit(category);
  }
}
