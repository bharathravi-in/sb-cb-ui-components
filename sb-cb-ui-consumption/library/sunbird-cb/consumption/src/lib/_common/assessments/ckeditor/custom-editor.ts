import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  List,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageUpload,
  Subscript,
  Superscript,
  GeneralHtmlSupport,
  PasteFromOffice,
} from 'ckeditor5'

import SimpleAudioUpload from './plugins/simple-audio-upload/simple-audio-upload-plugin'
import SimpleVideoUpload from './plugins/simple-video-upload/simple-video-upload.plugin'
import SimpleImageUpload from './plugins/simple-image-upload/simple-image-upload.plugin'
import AddBlankPlugin from './plugins/add-blank/add-blank-plugin'
import PastePlugin from './plugins/paste-content/paste-content.plugin'

export const editorConfig = {
  licenseKey: 'GPL',
  plugins: [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    List,
    Table,
    TableToolbar,
    Image,
    ImageToolbar,
    ImageUpload,
    Subscript,
    Superscript,
    // Rewrites Word / Google Docs list markup into real lists before PastePlugin cleans it.
    PasteFromOffice,
    SimpleAudioUpload,
    SimpleVideoUpload,
    SimpleImageUpload,
    AddBlankPlugin,
    PastePlugin,
    GeneralHtmlSupport,
  ],
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  htmlSupport: {
    allow: [
      { name: 'audio', attributes: ['controls', 'controlslist', 'src'] },
      { name: 'video', attributes: ['controls', 'controlslist', 'src', 'width', 'height'] },
      { name: 'input', attributes: true, classes: true, styles: true },
    ],
  },
}

export { ClassicEditor }
