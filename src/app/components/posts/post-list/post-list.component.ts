import { Post } from './../../../models/post';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

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
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

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

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      // Subscribe after adding pagination
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    // this.posts = this.postsService.getPosts();
    // We are not returning the posts, we are subscribing

    this.isLoading = true;
    // Commented after adding pagination
    // this.postsService.getPosts();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postsService.getPostUpdateListener()
      // Commented after adding pagination
      // .subscribe((posts: Post[]) => {
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        // Commented after adding pagination
        // this.posts = posts;
        this.posts = postData.posts;
        //Added after adding pagination
        this.totalPosts=postData.postCount;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
