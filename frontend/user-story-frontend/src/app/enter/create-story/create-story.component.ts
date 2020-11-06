import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { StoryState } from 'src/app/display/state/story.state';
import { Context } from 'src/app/shared/model/context.model';
import { UserRole } from 'src/app/shared/model/user-roles.model';
import { UserStory } from 'src/app/shared/model/user-story.model';
import * as storeActions from '../../display/state/story.actions';
import { contexts, userRoles } from '../../shared/text/constants';
import { SaveService } from '../service/save.service';

@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.component.html',
  styleUrls: ['./create-story.component.scss']
})
export class CreateStoryComponent implements OnInit, OnDestroy {
  @Select(StoryState.selectedStory) selectedStory$: Observable<UserStory>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  editMode = false;
  storyId: '';

  storyForm: FormGroup;

  storyToEdit: UserStory;

  // Variables needed for form-preselection
  newStory: UserStory = {
    mainContext: '',
    subContext: '',
    userRole: '',
    goal: '',
    reason: '',
    acceptenceCriteria: []
  };

  allContexts = contexts;
  alluserRoles = userRoles;

  mainContexts: Array<string> = [];
  subContexts: Array<string> = [];
  filteredUserRoles: Array<UserRole>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private storyService: SaveService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getMainContexts();
    this.checkIfEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private buildForm(): void {
    this.storyForm = this.fb.group({
      mainContext: ['', Validators.required],
      subContext: ['', Validators.required],
      userRole: ['', Validators.required],
      goal: ['', Validators.required],
      reason: ['', Validators.required],
      acceptanceCriteria: [[],
      // Validators.minLength(1)
      ],
    });
  }

  private getMainContexts(): void {
    this.allContexts.forEach(context => {
      if (!this.mainContexts.includes(context.mainContext)) {
        this.mainContexts.push(context.mainContext);
      }
    });
  }

  private checkIfEditMode(): void {
    this.route.params.pipe(take(1)).subscribe((params: Params) => {
      if (params.id && params.id !== '') {
        this.storyId = params.id;
        this.editMode = true;
        this.store.dispatch(new storeActions.LoadStory(params.id));
        this.loadStory();
      }
    });
  }

  private loadStory(): void {
    this.selectedStory$.pipe(takeUntil(this.destroy$)).subscribe(story => {
      this.storyForm.patchValue({
        mainContext: story.mainContext,
        subContext: story.subContext,
        userRole: story.userRole,
        goal: story.goal,
        reason: story.reason,
        acceptanceCriteria: story.acceptenceCriteria
      });
    });
  }

  submitStoryForm(): void {
    this.newStory = this.storyForm.value;
    if (this.editMode) {
      this.updateStory();
    } else {
      this.createStory();
    }
  }

  private updateStory(): void {
    this.store.dispatch(new storeActions.UpdateStory(this.newStory));
    this.router.navigate(['/all-stories']);
  }

  private createStory(): void {
    this.store.dispatch(new storeActions.CreateStory(this.newStory));
    this.router.navigate(['/create-story']);
  }

  filterSubContexts(): void {
    const filteredSubContexts: Array<string> = [];
    let selectedMainContext: string;
    if (this.editMode) {
      selectedMainContext = this.storyToEdit.mainContext;
    } else {
      selectedMainContext = this.storyForm.value.mainContext;
    }
    const correspondingContexts = this.allContexts.filter(context =>
      context.mainContext === selectedMainContext
    );
    correspondingContexts.forEach(context => {
      filteredSubContexts.push(context.subContext);
    });
    this.subContexts = filteredSubContexts;
  }

  filterUserRoles(): void {
    const selectedContext: Context = this.allContexts.filter(context =>
      context.mainContext === this.storyForm.value.mainContext && context.subContext === this.storyForm.value.subContext)[0];
    const filteredUserRoles = this.alluserRoles.filter(role =>
      role.correspondingContexts.indexOf(selectedContext) > -1
    );
    this.filteredUserRoles = filteredUserRoles;
  }

}
