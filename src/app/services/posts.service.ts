import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  // Commented after adding pagination
  // private postsUpdated = new Subject<Post[]>();
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  // Commented after adding pagination
  // getPosts() {
  getPosts(postsPerPage: number, currentPage: number) {
    // ([...]) Spread Operator -> Copy Array/Array Objects into new Array
    //  return [...this.posts];

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    // We can specify the type of get get<Post[]>('http:...)
    // At the moment the backend return json object with message and list of post objects
    // this.httpClient.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
    this.httpClient.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }), maxPosts: postData.maxPosts
        };
      }))
      // Commented after mapping the posts from server
      // .subscribe((postData) => {
      // Commented after adding pagination
      // .subscribe(transformedPosts => {
      .subscribe(transformedPostsData => {
        // Commented after mapping the posts from server        
        // this.posts = postData.posts;
        // Commented after adding pagination
        // this.posts = transformedPosts;
        this.posts = transformedPostsData.posts;
        // We send the copy of the posts, so we can't edit posts
        // Commented after adding pagination
        // this.postsUpdated.next([...this.posts]);
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // We're returning new object, because we want to clone the returned object
    // We dont get post from memory because if we're refreshing the page, the post will be empty
    // return { ...this.posts.find(p => p.id === id) };
    return this.httpClient.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    // The name "image" MUST BE  the same as the backend server excpect, check in post.js in post request
    postData.append("image", image, title);

    // Commented after adding upload image functionality
    // const post: Post = { id: null, title: title, content: content };
    // this.httpClient.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)

    this.httpClient.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        // Commented because we're navigation to different page
        // const post: Post = { id: responseData.post.id, title: responseData.post.title, content: responseData.post.content, imagePath: responseData.post.id };
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'])

        // Commented after adding upload image functionality
        // // console.log(responseData.message);
        // const id = responseData.postId;
        // post.id = id;
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        // this.router.navigate(['/'])
      });
    // Commented after connecting with the backend
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]);
  }

  // Commented after adding upload image functionality
  // updatePost(id: string, title: string, content: string) {
  updatePost(id: string, title: string, content: string, image: File | string) {
    // Commented after adding upload image functionality
    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      //Create FormData object
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };
    }

    // Commented after adding upload image functionality
    // this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        console.log(response)
        //IMPORTANT: If we're not visiting the posts page at all, there will be no posts
        // clone post array
        const updatedPost = [...this.posts];
        // search for old post version by id
        const oldPostIndex = updatedPost.findIndex(p => p.id === id);
        // update post element in cloned array
        const post: Post = {
          id: id,
          title: title,
          content: content,
          // imagePath: response.imagePath
          imagePath: ""
        };
        updatedPost[oldPostIndex] = post;
        // set post array to be equal to cloned array
        this.posts = updatedPost;
        // tell to all subscribers about changed post array
        // Commented because we're navigation to different page
        // this.postsUpdated.next([...updatedPost]);
        this.router.navigate(['/'])
      });
  }

  deletePost(postId: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
    // Commented after adding pagination
    // this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
    //   .subscribe(() => {
    //     const updatedPosts = this.posts.filter(post => post.id !== postId);
    //     this.posts = updatedPosts;
    //     this.postsUpdated.next([...this.posts]);
    //   });
  }
}
