import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'sb-uic-toc-multi-lingual-dialog',
  templateUrl: './toc-multi-lingual-dialog.component.html',
  styleUrls: ['./toc-multi-lingual-dialog.component.scss']
})

export class TOCMultiLingualDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<TOCMultiLingualDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
}
