import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators'
import { Tag } from 'src/app/model/tag.model'
import { AlertService } from 'src/app/service/alert/alert.service';
import { TagService } from 'src/app/service/tag/tag.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {
  tags!: Tag[];
  
  constructor(
    private tagService: TagService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.tagService.getAll()
      .pipe(first())
      .subscribe(tags => this.tags = tags)
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
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      });
  }

}
