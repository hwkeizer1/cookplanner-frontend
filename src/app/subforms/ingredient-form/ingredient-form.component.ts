import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IngredientName } from 'src/app/model/ingredient_name.model';
import { MeasureUnit } from 'src/app/model/measure_unit.model';
import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient_name.service';
import { MeasureUnitService } from 'src/app/service/measure_unit/measure_unit.service';

export interface IngredientFormValues {
  amount: number;
  measureUnit: MeasureUnit;
  ingredientName: IngredientName;
}
@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IngredientFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IngredientFormComponent),
      multi: true
    }
  ]
})
export class IngredientFormComponent implements ControlValueAccessor, OnDestroy {
  @Input() submitted;
  form: FormGroup;
  subscriptions: Subscription[] = [];

  get value(): IngredientFormValues {
    return this.form.value;
  }

  set value(value: IngredientFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(
    private formBuilder: FormBuilder,
    public measureUnitService: MeasureUnitService,
    public ingredientNameService: IngredientNameService) {
      this.measureUnitService.loadAll();
      this.ingredientNameService.loadAll();
      
      this.form = this.formBuilder.group(
        {
          amount: ['', Validators.required],
          measureUnit: ['', Validators.required],
          ingredientName: ['', Validators.required]
        });

      this.subscriptions.push(
        // any time the inner form changes update the parent of any change
        this.form.valueChanges.subscribe(value => {
          this.onChange(value);
          this.onTouched();
        }
      )
    );
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  validate(_: FormControl) {
    return this.form.valid ? null : { passwords: { valid: false } };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  get f() { return this.form.controls; }

}
