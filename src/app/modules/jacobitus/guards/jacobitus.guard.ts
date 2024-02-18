import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JacobitusGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const code = route.queryParams['code'];
    if (code) {
      // console.log('code: ', code);
      return true;
    } else {
      console.log('la variable code no esta presente en la ruta');
      this.router.navigate(['/adsib']);
      return false;
    }
  }
}
