import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MeasureUnit } from 'src/app/model/measure_unit.model';

import { MeasureUnitService } from 'src/app/service/measure_unit/measure_unit.service';

@Component({
  selector: 'app-measure_unit-update',
  templateUrl: './measure_unit-update.component.html',
  styleUrls: ['./measure_unit-update.component.css']
})
export class MeasureUnitUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  id!: string
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private measureUnitService: MeasureUnitService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      pluralName: ['', Validators.required]
    })

    let measureUnit: MeasureUnit = this.measureUnitService.load(this.id)
    if (measureUnit) {
      this.updateForm.patchValue(measureUnit);
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.updateForm.invalid) {
      return;
    }

    this.measureUnitService.update(this.id, this.updateForm.value)
    this.router.navigate(['/measureUnits']);
  }

  get f() { return this.updateForm.controls}
}
