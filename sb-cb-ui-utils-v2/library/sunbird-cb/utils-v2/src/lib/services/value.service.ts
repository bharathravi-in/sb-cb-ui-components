import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ValueService {

  public isXSmall$: Observable<boolean>
  public isLtMedium$: Observable<boolean>

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
    this.isXSmall$ = this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((res: BreakpointState) => res.matches))
    this.isLtMedium$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((res: BreakpointState) => res.matches))
  }

}
