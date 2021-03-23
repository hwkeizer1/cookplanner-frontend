import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Tag } from 'src/app/model/tag.model';

import { TagService } from 'src/app/service/tag/tag.service';

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
    private tagService: TagService) { }

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

  onSubmit() {
    this.submitted = true;

    if (this.updateForm.invalid) {
      return;
    }

    this.tagService.update(this.id, this.updateForm.value)
    this.router.navigate(['/tags']);
  }

  get f() { return this.updateForm.controls}

}
