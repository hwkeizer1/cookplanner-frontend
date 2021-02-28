import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators'
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Tag } from 'src/app/model/tag.model'
import { AlertService } from 'src/app/service/alert/alert.service';
import { TagTableService } from 'src/app/service/tag/tag-table.service';
import { TagService } from 'src/app/service/tag/tag.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {
  tags!: Tag[];

  tags$: Observable<Tag[]>
  total$: Observable<number>
  
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private tagService: TagService,
    public tagTableService: TagTableService,
    private alertService: AlertService) { 
      this.tags$ = tagTableService.tags$;
      this.total$ = tagTableService.total$;
      this.headers = new QueryList;
    }

  ngOnInit(): void {
    this.tagService.getAll()
      .pipe(first())
      .subscribe(tags => {
        this.tags = tags;
        this.tagTableService.tagList = this.tags;
      })
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      console.log(header)
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.tagTableService.sortColumn = column;
    this.tagTableService.sortDirection = direction;
    console.log(this.tagTableService.sortColumn)
    console.log(this.tagTableService.sortDirection)
  }

  deleteTag(id: string) {
    const tag = this.tags.find(x => x.id === id);
    if (!tag) return;
    tag.isDeleting = true;
    this.tagService.delete(id)
      .pipe(first())
      .subscribe(data => {
        this.alertService.success(`Categorie ${data.name} verwijderd`, { keepAfterRouteChange: true })
        this.tags = this.tags.filter(x => x.id !== id)
        this.tagTableService.removeTag(id);
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      });
  }

}
