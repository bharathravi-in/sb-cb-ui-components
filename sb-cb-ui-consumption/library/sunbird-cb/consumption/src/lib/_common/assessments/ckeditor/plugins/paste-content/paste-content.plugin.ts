import { ClipboardPipeline, Plugin } from 'ckeditor5'

/* Tags that only carry the source's own styling, plus the blanks that belong to the
   FTB toolbar rather than the clipboard. The lookahead pins the match to a whole tag
   name, so <br>, <ul> and <img> are left alone. */
const TAGS_TO_UNWRAP = /<\/?(?:strong|span|input|font|em|b|i|u)(?=[\s/>])[^>]*>/gi
const STYLE_BLOCKS = /<style[^>]*>[\s\S]*?<\/style>/gi
const STYLE_ATTRIBUTES = /\sstyle="[^"]*"/gi

/**
 * Drops the source styling from pasted content while keeping its structure, so
 * paragraphs and numbered / bulleted lists survive the paste instead of collapsing
 * into a single run of text.
 */
export default class PastePlugin extends Plugin {
  static get requires() {
    return [ClipboardPipeline]
  }

  init() {
    const editor: any = this.editor

    // Default priority, so the Paste from Office normalizers - registered at 'high' -
    // have already turned Word / Google Docs list markup into real lists by now.
    editor.plugins.get('ClipboardPipeline').on('inputTransformation', (_evt: any, data: any) => {
      const html = editor.data.htmlProcessor.toData(data.content)
      if (!html) {
        return
      }

      const cleaned = html
        .replace(STYLE_BLOCKS, '')
        .replace(TAGS_TO_UNWRAP, '')
        .replace(STYLE_ATTRIBUTES, '')

      if (cleaned !== html) {
        data.content = editor.data.htmlProcessor.toView(cleaned)
      }
    })
  }
}
