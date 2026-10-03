import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SortOrder } from '../../../../services/store.service';

@Component({
  selector: 'app-products-header',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './products-header.component.html',
})
export class ProductsHeaderComponent {
  @Input() cols = 3;
  @Input() sort: SortOrder = 'desc';
  @Input() itemsShowCount = 12;

  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<SortOrder>();
  @Output() itemsCountChange = new EventEmitter<number>();

  readonly sortLabels: Record<SortOrder, string> = {
    desc: 'Price: high to low',
    asc: 'Price: low to high',
  };
  readonly layouts = [
    { cols: 1, icon: 'view_list', label: 'List view' },
    { cols: 3, icon: 'view_module', label: '3 columns' },
    { cols: 4, icon: 'apps', label: '4 columns' },
  ];

  onSortUpdate(newSort: SortOrder): void {
    this.sortChange.emit(newSort);
  }

  onItemsUpdate(count: number): void {
    this.itemsCountChange.emit(count);
  }

  onColumnsUpdated(colsNum: number): void {
    this.columnsCountChange.emit(colsNum);
  }
}
