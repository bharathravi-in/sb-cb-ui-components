import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DiscussionForumComponent } from './components/discussion-forum/discussion-forum.component'
import { DiscussionPostComponent } from './components/discussion-post/discussion-post.component'
import { DiscussionReplyComponent } from './components/discussion-reply/discussion-reply.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { EditorQuillModule } from './editor-quill/editor-quill.module'
import { UserImageModule } from '../_common/user-image/user-image.module'
import { BtnSocialVoteModule } from './actionBtn/btn-social-vote/btn-social-vote.module'
import { BtnSocialLikeModule } from './actionBtn/btn-social-like/btn-social-like.module'
import { DialogSocialActivityUserModule } from './dialog/dialog-social-activity-user/dialog-social-activity-user.module'
import { DialogSocialDeletePostModule } from './dialog/dialog-social-delete-post/dialog-social-delete-post.module'

@NgModule({
    declarations: [DiscussionForumComponent, DiscussionPostComponent, DiscussionReplyComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatTooltipModule,
        MatMenuModule,
        MatChipsModule,
        MatCardModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        BtnSocialVoteModule,
        BtnSocialLikeModule,
        EditorQuillModule,
        UserImageModule,
        DialogSocialActivityUserModule,
        DialogSocialDeletePostModule,
    ],
    exports: [DiscussionForumComponent]
})
export class DiscussionForumModule { }
