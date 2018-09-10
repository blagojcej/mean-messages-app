import { PostsService } from './../../../services/posts.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../../../models/post';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  // Don't need Output after creating service
  // @Output() postCreated = new EventEmitter();
  // newPost = 'NO CONTENT';

  constructor(public postsService: PostsService) {}

  ngOnInit() {}

  /*
  onAddPost(postInput: HTMLTextAreaElement) {
    console.log(postInput);
    console.dir(postInput);
    this.newPost = postInput.value;
  }
  */
  /*
  onAddPost() {
    // this.newPost = this.enteredContent;
    const post: Post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(post);
  }
  */

 onAddPost(form: NgForm) {
   if (form.invalid) {
     return;
   }
  const post: Post = {
    title: form.value.title,
    content: form.value.content
  };
  // this.postCreated.emit(post);
  this.postsService.addPost(form.value.title, form.value.content);
  form.resetForm();
}
}
