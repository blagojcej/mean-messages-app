import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  @Output() postCreated = new EventEmitter();
  // newPost = 'NO CONTENT';

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
    // this.newPost = this.enteredContent;
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(post);
  }
}
