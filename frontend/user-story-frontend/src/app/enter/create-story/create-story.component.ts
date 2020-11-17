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
  criteriaForm: FormGroup;

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

  recommendedCriteria: Array<string> = [];
  selectedCriteria: Array<string> = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private storyService: SaveService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.buildCriteriaForm();
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
      acceptanceCriteria: [this.selectedCriteria,
        // Validators.minLength(1)
      ]
    });
  }

  private buildCriteriaForm(): void {
    this.criteriaForm = this.fb.group({
      criteria1: '',
      criteria2: '',
      criteria3: '',
      criteria4: '',
      criteria5: '',
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
      if (story) {
        this.filterSubContexts(story.mainContext);
        this.filterUserRoles({
          mainContext: story.mainContext,
          subContext: story.subContext
        });
        this.storyForm.patchValue({
          mainContext: story.mainContext,
          subContext: story.subContext,
          userRole: story.userRole,
          goal: story.goal,
          reason: story.reason,
          acceptanceCriteria: story.acceptenceCriteria
        });
        this.selectedCriteria = story.acceptenceCriteria;
      }

    });
  }

  submitStoryForm(): void {
    this.addAcceptenceCriteria();
    this.newStory = this.storyForm.value;
    if (this.editMode) {
      this.newStory = {
        ...this.newStory,
        _id: {
          $oid: this.storyId
        }
      };
      this.updateStory();
    } else {
      this.createStory();
    }
  }

  addAcceptenceCriteria(): void {
    if (this.criteriaForm.value.criteria1 !== '') {
      this.selectedCriteria.push(this.criteriaForm.value.criteria1);
    }
    if (this.criteriaForm.value.criteri2 !== '') {
      this.selectedCriteria.push(this.criteriaForm.value.criteria2);
    }
    if (this.criteriaForm.value.criteria3 !== '') {
      this.selectedCriteria.push(this.criteriaForm.value.criteria3);
    }
    if (this.criteriaForm.value.criteria4 !== '') {
      this.selectedCriteria.push(this.criteriaForm.value.criteria4);
    }
    if (this.criteriaForm.value.criteria5 !== '') {
      this.selectedCriteria.push(this.criteriaForm.value.criteria5);
    }
  }

  private updateStory(): void {
    this.store.dispatch(new storeActions.UpdateStory(this.newStory));
    this.router.navigate(['/all-stories']);
  }

  private createStory(): void {
    this.store.dispatch(new storeActions.CreateStory(this.newStory));
    this.router.navigate(['/create-story']);
    this.clearForm();
  }

  private clearForm(): void {
    this.storyForm.patchValue({
      mainContext: '',
      subContext: '',
      userRole: '',
      goal: '',
      reason: '',
      acceptenceCriteria: []
    });
    this.selectedCriteria = [];
    this.recommendedCriteria = [];
  }

  filterSubContexts(storyMainContext?: string): void {
    const filteredSubContexts: Array<string> = [];
    let selectedMainContext: string;
    if (storyMainContext) {
      selectedMainContext = storyMainContext;
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

  filterUserRoles(storyContext?: Context): void {
    let selectedContext: Context;
    if (storyContext) {
      selectedContext = this.allContexts.filter(context =>
        context.mainContext === storyContext.mainContext && context.subContext === storyContext.subContext)[0];
    } else {
      selectedContext = this.allContexts.filter(context =>
        context.mainContext === this.storyForm.value.mainContext && context.subContext === this.storyForm.value.subContext)[0];
    }
    this.filterAcceptanceCriteria(selectedContext);
    const filteredUserRoles = this.alluserRoles.filter(role =>
      role.correspondingContexts.indexOf(selectedContext) > -1
    );
    this.filteredUserRoles = filteredUserRoles;
  }

  private filterAcceptanceCriteria(context: Context): void {
    this.recommendedCriteria = context.acceptanceCriteria;
  }

  selectCheckbox(event): void {
    if (event.checked) {
      this.selectedCriteria.push(event.source.value);
    } else {
      this.selectedCriteria.forEach((item, index) => {
        if (item === event.source.value) {
          this.selectedCriteria.splice(index, 1);
        }
      });
    }
  }

}
