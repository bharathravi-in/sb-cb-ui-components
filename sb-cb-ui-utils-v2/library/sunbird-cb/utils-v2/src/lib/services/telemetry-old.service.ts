import { Inject, Injectable } from '@angular/core'
import { filter } from 'rxjs/operators'
// import { AuthKeycloakService } from './auth-keycloak.service'
import { NsInstanceConfig } from './configurations.model'
import { ConfigurationsService } from './configurations.service'
import { WsEventsOld } from './event-old.model'
import { EventOldService } from './event-old.service'
import { LoggerService } from './logger.service'
import { NsContent } from './widget-content.model'

declare var $t: any

@Injectable({
  providedIn: 'root',
})
export class TelemetryOldService {
  previousUrl: string | null = null
  telemetryConfig: NsInstanceConfig.ITelemetryConfig | null = null
  pData: any = null
  externalApps: any = {
    RBCP: 'rbcp-web-ui',
  }
  environment: any
  constructor(
    @Inject('environment') environment: any,
    private configSvc: ConfigurationsService,
    private eventsSvc: EventOldService,
    // private authSvc: AuthKeycloakService,
    private logger: LoggerService,
  ) {
    this.environment = environment
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.telemetryConfig = instanceConfig.telemetryConfig
      this.telemetryConfig = {
        ...this.telemetryConfig,
        pdata: {
          ...this.telemetryConfig.pdata,
          // pid: navigator.userAgent,
          id: `${environment.name}.${this.telemetryConfig.pdata.id}`,
        },
        uid: (this.configSvc.userProfile && this.configSvc.userProfile.userId) ?
          this.configSvc.userProfile.userId : '',
        channel: this.rootOrgId || this.telemetryConfig.channel,
        // authtoken: this.authSvc.token,
      }
      this.pData = this.telemetryConfig.pdata
      this.addPlayerListener()
      this.addInteractListener()
      this.addTimeSpentListener()
      this.addSearchListener()
      this.addHearbeatListener()
    }
  }

  get rootOrgId(): string {
    if (this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) {
      return this.configSvc.userProfile.rootOrgId
    }
    return ''
  }

  start(type: string, mode: string, id: string) {
    if (this.telemetryConfig) {
      $t.start(this.telemetryConfig, id, '1.0', {
        id,
        type,
        mode,
        stageid: '',
      })
    } else {
      this.logger.error('Error Initializing Telemetry. Config missing.')
    }
  }

  end(type: string, mode: string, id: string) {
    $t.end(
      {
        type,
        mode,
        contentId: id,
      },
      {
        context: {
          pdata: {
            ...this.pData,
            id: this.pData.id,
          },
        },
      },
    )
  }

  audit(type: string, props: string, data: any) {
    $t.audit(
      {
        type,
        props,
        data,
      },
      {
        context: {
          pdata: {
            ...this.pData,
            id: this.pData.id,
          },
        },
      },
    )
  }

  heartbeat(type: string, mode: string, id: string) {
    $t.heartbeat({
      id,
      mode,
      type,
    })
  }

  impression(data?: any, objectType?: any) {
    const page = this.getPageDetails()
    if (data && data.pageContext) {
      page.pageid = data.pageContext.pageId
      page.module = data.pageContext.module
    }
    const edata = {
      pageid: page.pageid, // Required. Unique page id
      type: page.pageUrlParts[0], // Required. Impression type (list, detail, view, edit, workflow, search)
      uri: page.pageUrl,
    }
    if (page.objectId) {
      const config = {
        context: {
          pdata: {
            ...this.pData,
            id: this.pData.id,
          },
          env: page.module || (this.telemetryConfig && this.telemetryConfig.env),
        },
        object: {
          id: page.objectId,
          type: objectType,
          ...(data && data.object),
        },
      }
      if (!page.objectId || !objectType) {
        config.object = {}
      }

      $t.impression(edata, config)
    } else {
      $t.impression(edata, {
        context: {
          pdata: {
            ...this.pData,
            id: this.pData.id,
          },
          env: page.module || (this.telemetryConfig && this.telemetryConfig.env) || '',
        },
        object: {
          ...(data && data.object),
        },
      })
    }
    this.previousUrl = page.pageUrl
  }

  externalImpression(impressionData: any) {
    const page = this.getPageDetails()
    if (this.externalApps[impressionData.subApplicationName]) {
      const externalConfig = page.objectId ? {
        context: {
          pdata: {
            ...this.pData,
            id: this.externalApps[impressionData.subApplicationName],
          },
        },
        object: {
          id: page.objectId,
        },
      } : {
        context: {
          pdata: {
            ...this.pData,
            id: this.externalApps[impressionData.subApplicationName],
          },
        },
      }
      $t.impression(impressionData.data, externalConfig)
    }
  }

  addTimeSpentListener() {
    this.eventsSvc.events$
      .pipe(
        filter(
          event =>
            event &&
            event.eventType === WsEventsOld.WsEventType.Telemetry &&
            event.data.type === WsEventsOld.WsTimeSpentType.Page &&
            event.data.mode &&
            event.data,
        ),
      )
      .subscribe(event => {
        if (event.data.state === WsEventsOld.EnumTelemetrySubType.Loaded) {
          this.start(
            event.data.type || WsEventsOld.WsTimeSpentType.Page,
            event.data.mode || WsEventsOld.WsTimeSpentMode.View,
            event.data.pageId,
          )
        }
        if (event.data.state === WsEventsOld.EnumTelemetrySubType.Unloaded) {
          this.end(
            event.data.type || WsEventsOld.WsTimeSpentType.Page,
            event.data.mode || WsEventsOld.WsTimeSpentMode.View,
            event.data.pageId,
          )
        }
      })
  }
  addPlayerListener() {
    this.eventsSvc.events$
      .pipe(
        filter(
          event =>
            event &&
            event.eventType === WsEventsOld.WsEventType.Telemetry &&
            event.data.type === WsEventsOld.WsTimeSpentType.Player &&
            event.data.mode &&
            event.data,
        ),
      )
      .subscribe(event => {
        const content: NsContent.IContent | null = event.data.content
        if (
          event.data.state === WsEventsOld.EnumTelemetrySubType.Loaded &&
          (!content ||
            content.isIframeSupported && (content.isIframeSupported.toLowerCase() === 'maybe' ||
              content.isIframeSupported.toLowerCase() === 'yes'))
        ) {
          this.start(
            event.data.type || WsEventsOld.WsTimeSpentType.Player,
            event.data.mode || WsEventsOld.WsTimeSpentMode.Play,
            event.data.identifier,
          )
        }
        if (
          event.data.state === WsEventsOld.EnumTelemetrySubType.Unloaded &&
          (!content ||
            content.isIframeSupported.toLowerCase() === 'maybe' ||
            content.isIframeSupported.toLowerCase() === 'yes')
        ) {
          this.end(
            event.data.type || WsEventsOld.WsTimeSpentType.Player,
            event.data.mode || WsEventsOld.WsTimeSpentMode.Play,
            event.data.identifier,
          )
        }
      })
  }

  addInteractListener() {
    this.eventsSvc.events$
      .pipe(
        filter(
          (event: WsEventsOld.WsEventTelemetryInteract) =>
            event &&
            event.data &&
            event.eventType === WsEventsOld.WsEventType.Telemetry &&
            event.data.eventSubType === WsEventsOld.EnumTelemetrySubType.Interact,
        ),
      )
      .subscribe(event => {
        const page = this.getPageDetails()
        if (typeof event.from === 'string' && this.externalApps[event.from]) {
          const externalConfig = {
            context: {
              pdata: {
                ...this.pData,
                id: this.externalApps[event.from],
              },
            },
          }
          $t.interact(event.data, externalConfig)
        } else {
          $t.interact(
            {
              type: event.data.type,
              subtype: event.data.subType,
              object: event.data.object,
              pageid: page.pageid,
              target: { page },
            },
            {
              context: {
                pdata: {
                  ...this.pData,
                  id: this.pData.id,
                },
              },
            })
        }
      })
  }
  addHearbeatListener() {
    this.eventsSvc.events$
      .pipe(
        filter(
          (event: WsEventsOld.WsEventTelemetryHeartBeat) =>
            event &&
            event.data &&
            event.eventType === WsEventsOld.WsEventType.Telemetry &&
            event.data.eventSubType === WsEventsOld.EnumTelemetrySubType.HeartBeat,
        ),
      )
      .subscribe(event => {
        if (typeof event.from === 'string' && this.externalApps[event.from]) {
          const externalConfig = {
            context: {
              pdata: {
                ...this.pData,
                id: this.externalApps[event.from],
              },
            },
          }
          $t.heartbeat(event.data, externalConfig)
        } else {
          $t.heartbeat(
            {
              type: event.data.type,
              subtype: event.data.eventSubType,
              identifier: event.data.identifier,
              mimeType: event.data.mimeType,
              mode: event.data.mode,
            },
            {
              context: {
                pdata: {
                  ...this.pData,
                  id: this.pData.id,
                },
              },
            })
        }
      })
  }

  addSearchListener() {
    this.eventsSvc.events$
      .pipe(
        filter(
          (event: WsEventsOld.WsEventTelemetrySearch) =>
            event &&
            event.data &&
            event.eventType === WsEventsOld.WsEventType.Telemetry &&
            event.data.eventSubType === WsEventsOld.EnumTelemetrySubType.Search,
        ),
      )
      .subscribe(event => {
        $t.search(
          {
            query: event.data.query,
            filters: event.data.filters,
            size: event.data.size,
          },
          {
            context: {
              pdata: {
                ...this.pData,
                id: this.pData.id,
              },
            },
          },
        )
      })
  }

  getPageDetails() {
    const path = window.location.pathname.replace('/', '')
    const url = path + window.location.search
    return {
      pageid: path,
      pageUrl: url,
      pageUrlParts: path.split('/'),
      refferUrl: this.previousUrl,
      objectId: this.extractContentIdFromUrlParts(path.split('/')),
      module: '',
    }
  }

  extractContentIdFromUrlParts(urlParts: string[]) {
    // TODO: pick toc and viewer url from some configuration
    const tocIdx = urlParts.indexOf('toc')
    const viewerIdx = urlParts.indexOf('viewer')

    if (tocIdx === -1 && viewerIdx === -1) {
      return null
    }

    if (tocIdx !== -1 && tocIdx < urlParts.length - 1) {
      return urlParts[tocIdx + 1] // e.g. url /app/toc/<content_id>
    }

    if (viewerIdx !== -1 && viewerIdx < urlParts.length - 2) {
      return urlParts[viewerIdx + 2] // e.g. url /app/viewer/<content_type>/<content_id>
    }

    return null
  }
}
