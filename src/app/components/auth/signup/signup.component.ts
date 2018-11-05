import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSignUp(form: NgForm) {
    // console.log(form.value);


    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
    this.router.navigate(['/login']);
  }

}
