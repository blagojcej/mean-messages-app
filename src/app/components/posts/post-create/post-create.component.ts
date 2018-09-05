import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredValue = '';
  newPost = 'NO CONTENT';

  constructor() {}

  ngOnInit() {}

  /*
  onAddPost(postInput: HTMLTextAreaElement) {
    console.log(postInput);
    console.dir(postInput);
    this.newPost = postInput.value;
  }
  */
  onAddPost() {
    this.newPost = this.enteredValue;
  }
}
