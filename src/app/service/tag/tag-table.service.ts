/*
This code is inspired by https://stackblitz.com/edit/ngbootstrap-table?file=app%2Ftable-complete.ts
*/
import { Injectable, OnInit, PipeTransform } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { debounceTime, tap, switchMap, delay } from 'rxjs/operators'
import { Tag } from 'src/app/model/tag.model';
import { SortDirection } from 'src/app/directive/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { TagService } from './tag.service';

interface SearchResult {
  tags: Tag[];
  total: number;
}
interface State {
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
  sortColumn: string,
  sortDirection: SortDirection
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
}

function sort(tags: Tag[], column: string, direction: string): Tag[] {
  if (direction === '') {
    return tags;
  } else {
    return [...tags].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res: -res;
    })
  }
}

function matches(tag: Tag, term: string, pipe: PipeTransform) {
  return tag.name.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(tag.id).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class TagTableService {
  private _tagList: Tag[] = [];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _tagPage$ = new BehaviorSubject<Tag[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    pageNumber: 1,
    pageSize:10,
    searchTerm: '',
    sortColumn: '',
    sortDirection:''
  }

  constructor(
    private pipe: DecimalPipe,
    private tagService: TagService) {

    this.tagService.tags$.subscribe(
      data => {
        this._tagList = data;
      }
    )

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      console.log("CONSTRUCTOR")
      console.log(result)
      this._tagPage$.next(result.tags);
      this._total$.next(result.total);
    })

    this._search$.next();
  }

  // DIT WERKT MAAR IS WEL HEEL RAAR!!!!
  // refreshed de lijst
  notifyChange() {
    this._search$.next();
  }

  // removeTag(id: string) {
  //   this._tagList = this._tagList.filter(x => x.id !== id)
  //   this._search$.next();
  //   return this.tagService.delete(id);
  // }

  get tags$() { return this._tagPage$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.pageNumber; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get sortColumn() { return this._state.sortColumn; }
  get sortDirection() { return this._state.sortDirection; }

  set page(page: number) { console.log(`pagenumber: ${page}`); this._set({pageNumber: page}) }
  set pageSize(pageSize: number) { this._set({pageSize})}
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn})}
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, pageNumber: page, searchTerm} = this._state;

    // 1. sort
    let tags = sort(this._tagList, sortColumn, sortDirection);
    console.log(tags)
    // 2. filter
    tags = tags.filter(tag => matches(tag, searchTerm, this.pipe));
    let total = tags.length;

    // 3. paginate
    tags = tags.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({tags, total});
  }
}
