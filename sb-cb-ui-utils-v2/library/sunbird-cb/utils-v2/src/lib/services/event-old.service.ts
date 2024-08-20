import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { WsEventsOld } from './event-old.model'
@Injectable({
  providedIn: 'root',
})
export class EventOldService {
  private eventsSubject = new Subject<WsEventsOld.IWsEvents<any>>()
  public events$ = this.eventsSubject.asObservable()

  constructor() {
    // this.focusChangeEventListener()
  }

  dispatchEvent<T>(event: WsEventsOld.IWsEvents<T>) {
    this.eventsSubject.next(event)
  }

  // helper functions
  raiseInteractTelemetry(type: string, subType: string | undefined, object: any, from?: string) {
    this.dispatchEvent<WsEventsOld.IWsEventTelemetryInteract>({
      eventType: WsEventsOld.WsEventType.Telemetry,
      eventLogLevel: WsEventsOld.WsEventLogLevel.Info,
      data: {
        type,
        subType,
        object,
        eventSubType: WsEventsOld.EnumTelemetrySubType.Interact,
      },
      from: from || '',
      to: 'Telemetry',
    })
  }

  // private focusChangeEventListener() {
  //   fromEvent(window, 'focus').subscribe(() => {
  //     this.raiseInteractTelemetry('focus', 'gained', {})
  //   })
  //   fromEvent(window, 'blur').subscribe(() => {
  //     this.raiseInteractTelemetry('focus', 'lost', {})
  //   })
  // }
}
