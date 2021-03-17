import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment'
import { Tag } from 'src/app/model/tag.model'

const baseUrl = `${environment.backendUrl}/tags`

@Injectable({
  providedIn: 'root'
})
export class TagApiService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Tag[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<Tag>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post<Tag>(baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put<Tag>(`${baseUrl}/${id}`, params)
  }

  delete(id: string) {
    return this.http.delete<Tag>(`${baseUrl}/${id}`);
  }
}
