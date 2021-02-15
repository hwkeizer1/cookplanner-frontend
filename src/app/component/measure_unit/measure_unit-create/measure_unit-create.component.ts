import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators'

import { AlertService } from 'src/app/service/alert/alert.service';
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
    private measureUnitService: MeasureUnitService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      pluralName: ['', Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.createForm.invalid) {
      alert("Invalid");
      return
    }

    this.loading = true;
    this.measureUnitService.create(this.createForm.value)
      .pipe(first())
      .subscribe(data => {
        this.alertService.success(`Maateenheid ${data.name} toegevoegd`, { keepAfterRouteChange: true })
        this.router.navigate(['/measureUnits']);
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
        this.router.navigate(['/measureUnits']);
      })
      .add(() => this.loading = false);
  }

  // Convenience getter for easy access to form fields
  get f() { return this.createForm.controls; }

}
