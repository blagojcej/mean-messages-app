import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './../../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // For reactive forms
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ],
  declarations: [PostCreateComponent, PostListComponent]
})
export class PostModule {}
