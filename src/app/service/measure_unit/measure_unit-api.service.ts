import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { MeasureUnit } from 'src/app/model/measure_unit.model';

const baseUrl = `${environment.backendUrl}/measure-units`

@Injectable({
  providedIn: 'root'
})
export class MeasureUnitApiService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<MeasureUnit[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<MeasureUnit>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post<MeasureUnit>(baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put<MeasureUnit>(`${baseUrl}/${id}`, params)
  }

  delete(id: string) {
    return this.http.delete<MeasureUnit>(`${baseUrl}/${id}`);
  }
}
