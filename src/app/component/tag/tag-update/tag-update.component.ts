import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators'
import { Tag } from 'src/app/model/tag.model';
import { AlertService } from 'src/app/service/alert/alert.service';

import { TagService } from 'src/app/service/tag/tag.service';
import { TagTableService } from 'src/app/service/tag/tag-table.service';

@Component({
  selector: 'app-tag-update',
  templateUrl: './tag-update.component.html',
  styleUrls: ['./tag-update.component.css']
})
export class TagUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  id!: string
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private tagService: TagService,
    private tagTableService: TagTableService,
    private alertService:AlertService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required]
    })

    let tag: Tag = this.tagService.load(this.id)
    if (tag) {
      this.updateForm.patchValue(tag);
    }
    
  }

  get f() { return this.updateForm.controls}

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.updateForm.invalid) {
      return;
    }

    this.tagService.update(this.id, this.updateForm.value)
    this.tagTableService.notifyChange();
    this.router.navigate(['/tags']);
  }

}
