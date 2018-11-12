import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from './../../angular-material.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    // For template driven forms
    FormsModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
  ]
})
export class AuthModule { }
