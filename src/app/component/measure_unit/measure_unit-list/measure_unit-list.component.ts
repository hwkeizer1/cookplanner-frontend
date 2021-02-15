import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators'

import { MeasureUnit } from 'src/app/model/measure_unit';
import { AlertService } from 'src/app/service/alert/alert.service';
import { MeasureUnitService } from 'src/app/service/measure_unit/measure_unit.service';

@Component({
  selector: 'app-measure_unit-list',
  templateUrl: './measure_unit-list.component.html',
  styleUrls: ['./measure_unit-list.component.css']
})
export class MeasureUnitListComponent implements OnInit {
  measureUnits!: MeasureUnit[];

  constructor(
    private measureUnitService: MeasureUnitService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.measureUnitService.getAll()
      .pipe(first())
      .subscribe(measureUnits => this.measureUnits = measureUnits)
      console.log(this.measureUnits)
  }

  deleteMeasureUnit(id: string) {
    const measureUnit = this.measureUnits.find(x => x.id === id);
    if (!measureUnit) return;
    measureUnit.isDeleting = true;
    this.measureUnitService.delete(id)
      .pipe(first())
      .subscribe(data => {
        this.alertService.success(`Maateenheid ${data.name} verwijderd`, { keepAfterRouteChange: true })
        this.measureUnits = this.measureUnits.filter(x => x.id !== id)
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
      });
  }

}
