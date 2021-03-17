import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from 'src/app/model/tag.model';
import { AlertService } from '../alert/alert.service';
import { TagApiService } from './tag-api.service';

let compareTag = function(tag1: Tag, tag2: Tag) {
    if (tag1.name.toLowerCase() > tag2.name.toLowerCase()) { return 1 }
    if (tag1.name.toLowerCase() < tag2.name.toLowerCase()) { return -1 }
    return 0;
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private _tags$ = new BehaviorSubject<Tag[]>([]);
  private dataStore: { tags: Tag[] } = { tags: [] }
  readonly tags$ = this._tags$.asObservable();

  constructor(
    private tagApiService: TagApiService,
    private alertService: AlertService) {}

  loadAll() {
    this.tagApiService.getAll().subscribe(
      data => {
        this.dataStore.tags = data;
        this._tags$.next(Object.assign({}, this.dataStore).tags)
      },
      error => console.log('Could not load tags')
    )
  }

  load(id: string): any {
    let tag = this.dataStore.tags.find(x => x.id.toString() === id)
    return tag;
  }

  create(tag: Tag) {
    this.tagApiService.create(tag).subscribe(
      data => {
        this.dataStore.tags.push(data);
        this.dataStore.tags = this.dataStore.tags.sort(compareTag);
        this._tags$.next(Object.assign({}, this.dataStore).tags)
        this.alertService.success(`Categorie ${data.name} toegevoegd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  update(id: string, tag:Tag) {
    console.log(tag)
    this.tagApiService.update(id, tag).subscribe(
      data => {
        this.dataStore.tags.forEach((t, i) => {
          if (t.id.toString() === id) {
            tag.id = id;
            this.dataStore.tags[i]= tag;
            this.dataStore.tags = this.dataStore.tags.sort(compareTag);
          }
        });
        this._tags$.next(Object.assign({}, this.dataStore).tags)
        this.alertService.success(`Categorie ${data.name} gewijzigd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }

  remove(id: string) {
    this.tagApiService.delete(id).subscribe(
      data => {
        this.dataStore.tags.forEach((t, i) => {
          if (t.id === id) {
            this.dataStore.tags.splice(i, 1);
          }
        });
        this._tags$.next(Object.assign({}, this.dataStore).tags);
        this.alertService.success(`Categorie ${data.name} verwijderd`, { keepAfterRouteChange: true })
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      }
    )
  }
}
