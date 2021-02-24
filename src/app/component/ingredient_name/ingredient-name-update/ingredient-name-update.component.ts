import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators'

import { IngredientName } from 'src/app/model/ingredient_name';
import { AlertService } from 'src/app/service/alert/alert.service';
import { IngredientNameService } from 'src/app/service/ingredient_name/ingredient-name.service';

function removeEmptyProperties(properties: any) {
  if (properties.ingredientType == '') delete properties["ingredientType"]
  if (properties.shopType == '') delete properties["shopType"]
}

@Component({
  selector: 'app-ingredient-name-update',
  templateUrl: './ingredient-name-update.component.html',
  styleUrls: ['./ingredient-name-update.component.css']
})
export class IngredientNameUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  id!: string
  loading = false;
  submitted = false;

  shopTypes!: string[];
  ingredientTypes!: string[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ingredientNameService: IngredientNameService,
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

    this.ingredientNameService.getById(this.id)
      .pipe(first())
      .subscribe(x => this.updateForm.patchValue(x));
    

    this.ingredientNameService.getAvailableIngredientTypes()
      .pipe(first())
      .subscribe(ingredientTypes => {this.ingredientTypes = ingredientTypes});

    this.ingredientNameService.getAvailableShopTypes()
      .pipe(first())
      .subscribe(shopTypes => {this.shopTypes = shopTypes});
  }

  get f() { return this.updateForm.controls}

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.updateForm.invalid) {
      return;
    }

    removeEmptyProperties(this.updateForm.value);

    this.ingredientNameService.update(this.id, this.updateForm.value)
      .pipe(first())
      .subscribe(data => {
        this.alertService.success(`Ingrediënt ${data.name} gewijzigd`, { keepAfterRouteChange: true })
        this.router.navigate(['/ingredientNames']);
      },
      error => {
        this.alertService.error(`${error.error.message}`, { keepAfterRouteChange: true });
        this.router.navigate(['/ingredientNames']);
      })
  }
}
