import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core'
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive'

@Component({
    selector: 'sb-uic-key-highlights',
    templateUrl: './key-highlights.component.html',
    styleUrls: ['./key-highlights.component.scss'],
    standalone: false
})
export class KeyHighlightsComponent implements OnInit {
  currentIndex: any = 0
  @Input() providerId: any = ''
  @Input() formData: any = ''
  @Input() mode: any
  @Input() isEdit: boolean = false;
  @Output() emptyResponse = new EventEmitter<any>()
  titleMaxLength = 100

  styleData: any = {}
  contentdata: any = []
  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>
  constructor() { }

  ngOnInit() {
    this.styleData = this.formData && this.formData.sliderData && this.formData.sliderData.styleData
    const content = this.formData && this.formData.content ? this.formData.content : []
    this.titleMaxLength = this.formData && this.formData.titleMaxLength ? this.formData.titleMaxLength : 100
    this.contentdata = content.map((item: any) => ({
      ...item,
      truncatedInnerHTMLTitle: this.getTruncatedInnerHtml(item && item.innerHTMLTitle),
    }))
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }

  getTruncatedInnerHtml(html: string): string {
    if (!html) {
      return ''
    }
    if (typeof document === 'undefined') {
      return html
    }

    const container = document.createElement('div')
    container.innerHTML = html

    const plainTextLength = (container.textContent || '').length
    if (plainTextLength <= this.titleMaxLength) {
      return html
    }

    let remaining = this.titleMaxLength
    let truncated = false

    const walk = (node: Node) => {
      if (truncated) {
        return
      }
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ''
        if (text.length <= remaining) {
          remaining -= text.length
        } else {
          node.textContent = text.slice(0, remaining) + '...'
          remaining = 0
          truncated = true
        }
        return
      }
      const children = Array.from(node.childNodes)
      for (const child of children) {
        walk(child)
        if (truncated) {
          let sibling = child.nextSibling
          while (sibling) {
            const next = sibling.nextSibling
            sibling.parentNode?.removeChild(sibling)
            sibling = next
          }
          break
        }
      }
    }

    walk(container)
    return container.innerHTML
  }
}
