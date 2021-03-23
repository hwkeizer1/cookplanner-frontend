import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { MeasureUnitService } from 'src/app/service/measure_unit/measure_unit.service';

@Component({
  selector: 'app-measure_unit-list',
  templateUrl: './measure_unit-list.component.html',
  styleUrls: ['./measure_unit-list.component.css']
})
export class MeasureUnitListComponent {
  
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public measureUnitService: MeasureUnitService) { 
      this.measureUnitService.loadAll();
      this.headers = new QueryList;
    }

    onSort({column, direction}: SortEvent) {
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
  
      this.measureUnitService.sortColumn = column;
      this.measureUnitService.sortDirection = direction;
    }

    deleteMeasureUnit(id: string) {
      this.measureUnitService.remove(id);
    }

}
