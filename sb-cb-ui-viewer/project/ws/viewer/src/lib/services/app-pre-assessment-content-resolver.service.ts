import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { WidgetContentService } from '@sunbird-cb/toc'

@Injectable()
export class AppPreAssessmentContentResolverService {
  constructor(private contentSvc: WidgetContentService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    const collectionId =
      (_route.queryParams && _route.queryParams.collectionId) || ''

    const preAssessment =
      (_route.queryParams && _route.queryParams.preAssessment) || ''

    if (collectionId && preAssessment) {
      return this.contentSvc.fetchProgramContent(collectionId).pipe(
        map(
          (rData: any): IResolveResponse<any> => ({
            data: rData,
            error: null,
          }),
        ),
        catchError((error: unknown) =>
          of<IResolveResponse<any>>({
            error,
            data: null,
          }),
        ),
      )
    }

    return of<IResolveResponse<any>>({
      error: 'Collection Id not found',
      data: null,
    })
  }
}
