import { PostsService } from './../../../services/posts.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../../../models/post';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  // Don't need Output after creating service
  // @Output() postCreated = new EventEmitter();
  // newPost = 'NO CONTENT';

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {

    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
    });

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        // Check if route has postId from route
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          //Show spinner
          this.isLoading = true;
          //Getting the post from memory
          // this.post = this.postsService.getPost(this.postId);
          this.postsService.getPost(this.postId)
            .subscribe(postData => {
              //Hide spinner
              this.isLoading = false;
              this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath, creator: postData.creator };
              //Populate the form
              this.form.setValue({
                'title': this.post.title,
                'content': this.post.content,
                'image': this.post.imagePath
              });
            });
        }
        else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

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

  // We're passing NgForm for Template driven forms
  // onSavePost(form: NgForm) {
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    //We're not setting this to false because we're navigating to other page
    this.isLoading = true;

    //Get the values from form and convert into Post object
    // So we can send to service the whole object, or property by property
    // If we're sending every property to the service, into the service we're creating the whole object SEE POST SERVICE
    // const post: Post = {
    //   id: null,
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);
    if (this.mode == 'create') {
      // this.postsService.addPost(form.value.title, form.value.content);
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      // this.postsService.updatePost(this.postId, form.value.title, form.value.content)
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    // form.resetForm();
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    //patchValue accessing single control, setValue accessing all controls
    this.form.patchValue({ image: file });
    //Run the validators
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
