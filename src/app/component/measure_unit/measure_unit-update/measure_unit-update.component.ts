import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators'

import { AlertService } from 'src/app/service/alert/alert.service';
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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private measureUnitService: MeasureUnitService,
    private alertService:AlertService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      pluralName: ['', Validators.required],
      stock: [''],
      shopType: [''],
      ingredientType: ['']
    })

    this.measureUnitService.getById(this.id)
      .pipe(first())
      .subscribe(x => this.updateForm.patchValue(x));
  }

  get f() { return this.updateForm.controls}

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.updateForm.invalid) {
      return;
    }

    this.measureUnitService.update(this.id, this.updateForm.value)
      .pipe(first())
      .subscribe(data => {
        this.alertService.success(`Maateenheid ${data.name} gewijzigd`, { keepAfterRouteChange: true })
        this.router.navigate(['/measureUnits']);
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
        this.router.navigate(['/measureUnits']);
      })
  }
}
