import { Post } from './../../../models/post';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // We don't need binding after adding service
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postSub: Subscription;

  /*
  posts = [
    {
      title: 'First Post',
      content: 'This is a first post\'s content'
    },
    {
      title: 'Second Post',
      content: 'This is a second post\'s content'
    },
    {
      title: 'Third Post',
      content: 'This is a third post\'s content'
    }
  ];
  */

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

}
