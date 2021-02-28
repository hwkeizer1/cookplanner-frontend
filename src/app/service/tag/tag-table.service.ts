/*
This code is inspired by https://stackblitz.com/edit/ngbootstrap-table?file=app%2Ftable-complete.ts
*/
import { Injectable, PipeTransform } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { debounceTime, first, tap, switchMap, delay } from 'rxjs/operators'
import { Tag } from 'src/app/model/tag.model';
import { SortDirection } from 'src/app/directive/sortable.directive';
import { DecimalPipe } from '@angular/common';

interface SearchResult {
  tags: Tag[];
  total: number;
}
interface State {
  page: number,
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
  return tag.name.toLowerCase().includes(term)
    || pipe.transform(tag.id).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class TagTableService {
  private _TAGS: Tag[] = [];

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _tags$ = new BehaviorSubject<Tag[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize:4,
    searchTerm: '',
    sortColumn: '',
    sortDirection:''
  }

  constructor(
    private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._tags$.next(result.tags);
      this._total$.next(result.total);
    })

    this._search$.next();
  }

  // Visual remove the tag from list (delete from db will be implemented later as well)
  removeTag(id: string) {
    this._TAGS = this._TAGS.filter(x => x.id !== id)
    this._search$.next();
  }

  get tags$() { return this._tags$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get sortColumn() { return this._state.sortColumn; }
  get sortDirection() { return this._state.sortDirection; }

  set page(page: number) { this._set({page}) }
  set pageSize(pageSize: number) { this._set({pageSize})}
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn})}
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set tagList(tagList: Tag[]) { this._TAGS = tagList }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let tags = sort(this._TAGS, sortColumn, sortDirection);

    // 2. filter
    tags = tags.filter(tag => matches(tag, searchTerm, this.pipe));
    let total = tags.length;

    // 3. paginate
    tags = tags.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({tags, total});
  }
}
