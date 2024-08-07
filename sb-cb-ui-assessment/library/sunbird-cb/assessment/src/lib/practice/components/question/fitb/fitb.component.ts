import {
    AfterViewInit, Component,
    ElementRef,
    EventEmitter,
    // HostListener,
    Input,
    OnChanges, OnInit,
    Output,
    SimpleChanges, ViewEncapsulation, OnDestroy,
} from '@angular/core'
import { SafeHtml, DomSanitizer } from '@angular/platform-browser'
import { NSPractice } from '../../../practice.model'
import { PracticeService } from '../../../practice.service'
import { Subscription } from 'rxjs'
import { NsContent } from '../../../../services/widget-content.model'

@Component({
    selector: 'viewer-fitb-question',
    templateUrl: './fitb.component.html',
    styleUrls: ['./fitb.component.scss'],
    // tslint:disable-next-line
    encapsulation: ViewEncapsulation.None
})
export class FillInTheBlankComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() question: NSPractice.IQuestion = {
        multiSelection: false,
        section: '',
        question: '',
        instructions: '',
        questionId: '',
        questionLevel: '',
        timeTaken: '',
        editorState: undefined,
        options: [
            {
                optionId: '',
                text: '',
                isCorrect: false,
            },
        ],
    }
    @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
    localQuestion: string = this.question.question
    safeQuestion: SafeHtml = ''
    @Output() update = new EventEmitter<string | Object>()
    shCorrectAnsSubscription: Subscription | null = null
    showAns = false
    correctOption: boolean[] = []
    unTouchedBlank: boolean[] = []
    // tslint:disable-next-line
    constructor(
        private domSanitizer: DomSanitizer,
        private elementRef: ElementRef,
        private practiceSvc: PracticeService,
    ) {

    }
    ngOnInit() {

        this.practiceSvc.clearResponse.subscribe((questionId: any) => {
            for (let i = 0; i < (this.localQuestion.match(/matInput/g) || []).length; i += 1) {
                if (questionId === this.question.questionId) {
                    const blank: HTMLInputElement = this.elementRef.nativeElement.querySelector(`#${this.question.questionId}${i}`)
                    blank.value = ''
                }
            }
        })
        if (this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
            if (this.shCorrectAnsSubscription) {
                this.shCorrectAnsSubscription.unsubscribe()
            }
            this.shCorrectAnsSubscription = this.practiceSvc.displayCorrectAnswer.subscribe(displayAns => {
                this.showAns = displayAns
                if (this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
                    this.functionChangeBlankBorder()
                }
            })
        }
        this.localQuestion = this.question.question
        this.init()
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {

        }
    }
    onEntryInBlank(id: any) {
        const arr: any = []
        for (let i = 0; i < (this.localQuestion.match(/matInput/g) || []).length; i += 1) {
            const blank: HTMLInputElement = this.elementRef.nativeElement.querySelector(`#${this.question.questionId}${i}`)
            if (blank && blank.value) {
                const blankValue: any = blank.value
                const trimmedValue: any = blankValue.trim()
                arr.push(trimmedValue)
            }

        }
        this.update.emit(arr.join())
        if (this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
            this.ifFillInTheBlankCorrect(id)
        }
    }
    ifFillInTheBlankCorrect(id: string) {
        if (this.question.editorState && this.question.editorState.options) {
            const blankPosition: number = id.slice(-1) as unknown as number
            const text = this.question.editorState.options[blankPosition].value.body
            const valueOfBlank = document.getElementById(id) as HTMLInputElement
            if (text.trim().toLowerCase() === valueOfBlank.value.trim().toLowerCase()) {
                this.correctOption[blankPosition] = true
            } else {
                this.correctOption[blankPosition] = false
            }
            if (valueOfBlank.value.length < 1) {
                this.unTouchedBlank[blankPosition] = true
            } else {
                this.unTouchedBlank[blankPosition] = false
            }
        }
    }
    onChange(id: any, _event: any) {
        this.onEntryInBlank(id)
    }
    ngAfterViewInit(): void {
        if (this.question.questionType === 'ftb') {
            for (let i = 0; i < (this.localQuestion.match(/matInput/g) || []).length; i += 1) {
                this.elementRef.nativeElement
                    .querySelector(`#${this.question.questionId}${i}`)
                    .addEventListener('change', this.onChange.bind(this, this.question.questionId + i))
            }
        }
    }

    init() {
        if (this.question.questionType === 'ftb') {
            // if (this.practiceSvc.questionAnswerHash.value && this.practiceSvc.questionAnswerHash.value[this.question.questionId]) {
            //     needToModify = false
            //     let value = this.practiceSvc.questionAnswerHash.value[this.question.questionId]
            //     console.log(value)
            // }
            // if (needToModify) {
            let value = (this.practiceSvc.questionAnswerHash.value[this.question.questionId] || '')
            value = value.toString().split(',')
            // tslint:disable-next-line
            let iterationNumber = (this.localQuestion.match(/_______________/g) || []).length
            let fromRichTextEditor = false
            for (let i = 0; i < iterationNumber; i += 1) {
                // tslint:disable-next-line
                if(this.localQuestion.includes('_______________') ) {
                    this.localQuestion = this.localQuestion.replace('_______________', 'idMarkerForReplacement')
                } else if (this.localQuestion.includes('input style="border-style:none none solid none"')) {
                    // tslint:disable-next-line
                    this.localQuestion = this.localQuestion.replace('<input style="border-style:none none solid none" />', 'idMarkerForReplacement')
                }

            }
            if (iterationNumber === 0) {
                // replacing input tag forom richtext. new courses
                this.localQuestion = this.localQuestion.split('<input style="border-style:none none solid none" />')
                    .join('idMarkerForReplacement')
                iterationNumber = (this.localQuestion.match(/idMarkerForReplacement/g) || []).length
                fromRichTextEditor = true
            }

            // only if practice assessment
            if (this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE
                && this.question.editorState && this.question.editorState.options) {
                for (let opo = 0; opo < this.question.editorState.options.length; opo += 1) {
                    this.correctOption.push(false)
                    this.unTouchedBlank.push(true)
                }
            }
            for (let i = 0; i < iterationNumber; i += 1) {
                if (this.question.options.length > 0 || (fromRichTextEditor && iterationNumber > 0)) {
                    // console.log('============>', i, this.question.options[i].text)
                    if (value[i]) {
                        this.localQuestion = this.localQuestion.replace(
                            'idMarkerForReplacement',
                            `<input matInput autocomplete="off" style="border-style: none none solid none;
                   padding: 8px 12px;" type="text" id="${this.question.questionId}${i}"
                  value="${value[i]}" />`,
                        )
                        setTimeout(() => { this.ifFillInTheBlankCorrect(`${this.question.questionId}${i}`) }, 200)

                    } else {
                        this.localQuestion = this.localQuestion.replace(
                            'idMarkerForReplacement',
                            `<input matInput autocomplete="off" style="border-style: none none solid none;
                   padding: 8px 12px;" type="text" id="${this.question.questionId}${i}"
                   />`,
                        )
                    }
                } else {
                    if (value[i]) {
                        this.localQuestion = this.localQuestion.replace(
                            'idMarkerForReplacement',
                            `<input matInput autocomplete="off" style="border-style: none none solid none;
                   padding: 8px 12px;" type="text" id="${this.question.questionId}${i}"
                  value="${value[i]}" />`,
                        )
                        setTimeout(() => { this.ifFillInTheBlankCorrect(`${this.question.questionId}${i}`) }, 200)

                    } else {
                        this.localQuestion = this.localQuestion.replace(
                            'idMarkerForReplacement',
                            `<input matInput autocomplete="off" style="border-style: none none solid none;
                   padding: 8px 12px;" type="text" id="${this.question.questionId}${i}"
                   />`,
                        )
                    }
                }
            }
        } else {
            for (let i = 0; i < (this.localQuestion.match(/matInput/g) ||
                this.localQuestion.match(/matInput/g) || []).length; i += 1) {
                // console.log(this.elementRef.nativeElement.querySelector(`#${this.question.questionId}${i}`))
            }
        }
        this.safeQuestion = this.domSanitizer.bypassSecurityTrustHtml(this.localQuestion)
        // }
    }
    functionChangeBlankBorder() {
        if (this.question.questionType === 'ftb' && this.showAns) {
            let iterationNumber: any = 0
            if (this.localQuestion.includes('_______________')) {
                iterationNumber = ((this.localQuestion.match(/_______________/g) || []).length)
            } else if (this.localQuestion.includes('input style="border-style:none none solid none"')) {
                iterationNumber = ((this.localQuestion.match(/input style="border-style:none none solid none"/g) || []).length)
            }

            for (let i = 0; i < iterationNumber; i += 1) {
                if (this.correctOption[i] && !this.unTouchedBlank[i]) {
                    this.elementRef.nativeElement
                        .querySelector(`#${this.question.questionId}${i}`)
                        // tslint:disable-next-line: max-line-length
                        .setAttribute('style', 'border-style: solid !important; border-width: 1px !important; padding: 8px 12px !important; border-color: #357a38 !important')
                } else if (!this.correctOption[i] && !this.unTouchedBlank[i]) {
                    this.elementRef.nativeElement
                        .querySelector(`#${this.question.questionId}${i}`)
                        // tslint:disable-next-line: max-line-length
                        .setAttribute('style', 'border-style: solid !important; border-width: 1px !important; padding: 8px 12px !important; border-color: #f44336 !important;')
                } else if (this.unTouchedBlank[i]) {
                    this.elementRef.nativeElement
                        .querySelector(`#${this.question.questionId}${i}`)
                        // tslint:disable-next-line: max-line-length
                        .setAttribute('style', 'border-style: solid !important; border-width: 1px !important; padding: 8px 12px !important; ')
                }
            }
        }
    }
    get correctAns(): string {
        if (this.question.editorState && this.question.editorState.options) {
            return this.question.editorState.options.map(o => o.value.body).join(',')
        }
        return ''

    }
    getSanitizeString(res: any) {
        if (res && (typeof res === 'string')) {
            const response = res.replace(/\&lt;/g, '&lt;').replace('&gt;', '>')
            return response
        }
        return res
    }
    ngOnDestroy(): void {
        this.practiceSvc.shCorrectAnswer(false)
        if (this.shCorrectAnsSubscription) {
            this.shCorrectAnsSubscription.unsubscribe()
        }
    }
}
