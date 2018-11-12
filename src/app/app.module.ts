import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { HeaderComponent } from './components/header/header.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './components/error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostModule } from './components/posts/post.module';
import { AuthModule } from './components/auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    PostModule,
    // Commented after adding lazy loading child routes
    // AuthModule
  ],
  providers: [
    // with multi: true, we tell to Angular to doesn't override exiting interceptors, add additional one instead 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent
  ]
})
export class AppModule { }
