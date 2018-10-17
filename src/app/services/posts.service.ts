import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated=new Subject<Post[]>();

  constructor(private httpClient: HttpClient) { }

  getPosts() {
    // ([...]) Spread Operator -> Copy Array/Array Objects into new Array
    //  return [...this.posts];

    // We can specify the type of get get<Post[]>('http:...)
    // At the moment the backend return json object with message and list of post objects
    this.httpClient.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    // Commented after mapping the posts from server
    // .subscribe((postData) => {
    .subscribe(transformedPosts => {
      // Commented after mapping the posts from server
      // this.posts = postData.posts;
      this.posts = transformedPosts;
      // We send the copy of the posts, so we can't edit posts
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content};
    this.httpClient.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      // console.log(responseData.message);
      const id = responseData.postId;
      post.id = id;
          this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
    // Commented after connecting with the backend
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]);
  }

  deletePost(postId: string) { 
    this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
