import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public timout : ReturnType<typeof setTimeout> = setTimeout(()=>{},100000);
  public ALLOWEDIDLETIME : number = 300 * 60 * 1000 // for this much time session can be idle
  code_token = null;
  email: string
  username: string;
  password: string;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getCodeToken(): string {
    return this.code_token;
  }

  resendCode(){
    return this.http.post(
      `${environment.apiUrl}/auth/login/`,
      { username : this.username, password : this.password}
    )
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  get refeshToken(): string {
    return localStorage.getItem('refresh_token');
  }

  setCodeToken(token){
    this.code_token = token;
  }

  sessionSet(data){
    this.setSession(data);
  }

  code(username: string, password: string){
    this.username = username;
    this.password = password;
    return this.http.post(
      `${environment.apiUrl}/auth/login/`,
      { username , password }
    )
  }

  resetPassword(username: string){
    this.username = username;
    return this.http.post(
      `${environment.apiUrl}/auth/get-otp/`,
      { username}
    )
  }

  updatePassword(user){
    return this.http.post(`${environment.apiUrl}/auth/reset-password/confirm/`,user)
  }

  decryptedData(Base64CBC){
    var iv = CryptoJS.enc.Utf8.parse(`${environment.EncryptionIV}`);
    var key =`${environment.EncryptionKey}`;
    key = CryptoJS.enc.Utf8.parse(key);
    var decrypted =  CryptoJS.AES.decrypt(Base64CBC, key, { iv: iv, mode: CryptoJS.mode.CBC});
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }

  private setSession(authResult) {
    const expiresAt = moment().add(Number(this.decryptedData(authResult.expires_in)),'s');
    localStorage.setItem('token', this.decryptedData(authResult.access_token).toString());
    localStorage.setItem('refresh_token',this.decryptedData(authResult.refresh_token).toString());
    localStorage.setItem('expires_at', expiresAt.valueOf().toString());
    localStorage.setItem('USER_ID', this.decryptedData(authResult.ID).toString());
    localStorage.setItem('USER_NAME', this.decryptedData(authResult.username).toString());
    localStorage.setItem('EMAIL_ID', this.decryptedData(authResult.email).toString());
    localStorage.setItem('COMPANY_ID', this.decryptedData(authResult.tenant_id.toString()));
    localStorage.setItem('currentUser', this.decryptedData(authResult.ID).toString());
    localStorage.setItem('roles', JSON.stringify(authResult.roles));
  }

  login(code_token: string, code: string) {
    return this.http.post(
      `${environment.apiUrl}/auth/login/`,
      { code_token, code }
    ).pipe(
      tap(response => {
        this.setSession(response);
        this.username = null;
        this.password = null;
      }),
      shareReplay(),
    );
  }

  serverLogOut(){
    this.http.post(
      `${environment.apiUrl}/auth/logout/`,
      { token: this.token }
    ).subscribe();
    return ;
  }

  logout() {
    this.serverLogOut();
    localStorage.clear();
    return of({ success: false });
  }

  private UpdateSession(response) {
    const expiresAt = moment().add(Number(this.decryptedData(response.expires_in)),'s');
    localStorage.setItem('token', this.decryptedData(response.access_token).toString());
    localStorage.setItem('refresh_token',this.decryptedData(response.refresh_token).toString());
    localStorage.setItem('expires_at', expiresAt.valueOf().toString());
    return
  }

  refreshToken() {
    if (moment().isBetween(this.getExpiration().subtract(1, 'h'), this.getExpiration())) {
      return this.http.post(
        `${environment.apiUrl}/auth/refresh-token/`,
        { token: this.token, refresh_token : this.refeshToken  }
      ).pipe(
        tap(response => this.UpdateSession(response)),
        shareReplay(),
      ).subscribe();
    }
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);

    return moment(expiresAt);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer '.concat(token))
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.authService.refreshToken();
      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['']);
      return false;
    }
  }
}
