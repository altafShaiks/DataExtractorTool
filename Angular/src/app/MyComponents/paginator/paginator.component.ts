import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDataInterface } from '../Interfaces/user-data-interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent {
  @Input() users: UserDataInterface[] | any = [];
  @Input() pageSize: number = 15;
  @Input() currentPage: number = 0;

  @Output() pageSizeUpdated = new EventEmitter<number>();
  @Output() currentPageUpdated = new EventEmitter<number>();
   
  handlePageEvent(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex;
    this.pageSizeUpdated.emit(this.pageSize)
    this.currentPageUpdated.emit(this.currentPage);
  }
}
