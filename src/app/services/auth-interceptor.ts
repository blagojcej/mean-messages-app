import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();

        // clone request before manipulate with it, if we don't clone we couse side effects
        const authRequest = req.clone({
            //edit headers
            //we set Authorization header because we're extracting token from Authorization header at backend
            //we set Bearer because we extract data at backend
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });

        return next.handle(authRequest);
    }
}