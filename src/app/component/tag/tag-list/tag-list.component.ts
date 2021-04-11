import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';

import { TagService } from 'src/app/service/tag/tag.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent {
  
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public tagService: TagService) { 
      this.tagService.loadAll();
      this.headers = new QueryList;
    }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.tagService.sortColumn = column;
    this.tagService.sortDirection = direction;
  }

  deleteTag(id: string) {
    this.tagService.remove(id);
  }

}
