import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MeasureUnitService } from 'src/app/service/measure_unit/measure_unit.service';

@Component({
  selector: 'app-measure_unit-create',
  templateUrl: './measure_unit-create.component.html',
  styleUrls: ['./measure_unit-create.component.css']
})
export class MeasureUnitCreateComponent implements OnInit {
  createForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private measureUnitService: MeasureUnitService) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      pluralName: ['', Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid) {
      return
    }

    this.measureUnitService.create(this.createForm.value);
    this.router.navigate(['/measureUnits']);
  }

  get f() { return this.createForm.controls; }

}
