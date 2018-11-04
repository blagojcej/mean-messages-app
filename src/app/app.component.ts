import { Post } from './models/post';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // We don't need binding after adding service
  /*
  storedPosts: Post[] = [];

  onPostAdded(post) {
    this.storedPosts.push(post);
  }
  */

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
