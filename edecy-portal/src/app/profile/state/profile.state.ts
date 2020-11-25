import { Injectable } from '@angular/core';
import { Action, Select, Selector, State, StateContext, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserModel } from 'src/app/auth/model/user.model';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthState } from 'src/app/auth/state/auth.state';
import { ProfileFilter, Tracking } from 'src/app/shared/model/tracking.model';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { TrackingState } from 'src/app/shared/state/tracking.state';
import * as fromCards from '../../cards/state/cards.actions';
import { Profile, ProfileStateModel } from '../model/profile.model';
import { ProfileES, ProfileResponse } from '../model/profileES.model';
import { ProfileQuery } from '../model/query.model';
import { ProfileEsService } from '../service/profile-es.service';
import { ProfileService } from '../service/profile.service';
import * as profileActions from './profile.actions';

const profileStateDefaults: ProfileStateModel = {
    userProfile: null,
    loadedProfile: null,
    loaded: false,
    loading: false,
    loadedProfiles: [],
    profilesFiltered: false,
    filteredProfiles: null,
    searchKeywords: [],
    profileFilter: null,
    profilesES: [],
    page: 1,
    profilesPerPage: 50,
    loadedProfileES: null,
    loadedProfileOwner: null,
    categoryFilter: null,
    cityFilter: null,
    showFilter: false,
    isPublicFilter: null,
    listView: false
};
@Injectable({
    providedIn: 'root'
})
@State<ProfileStateModel>({
    name: 'profileState',
    defaults: profileStateDefaults
})
export class ProfileState {
    @Select(AuthState.getUser) currentUser$: Observable<User>;
    @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;

    constructor(
        private profileService: ProfileService,
        private authService: AuthService,
        private profileESService: ProfileEsService,
        private store: Store,
        private tracking: TrackingService
    ) { }

    @Selector()
    static getSelectedProfile(state: ProfileStateModel) {
        return state.loadedProfile;
    }

    @Selector()
    static getProfiles(state: ProfileStateModel) {
        return state.loadedProfiles;
    }

    @Selector()
    static getUserProfile(state: ProfileStateModel) {
        return state.userProfile;
    }

    @Selector()
    static isLoading(state: ProfileStateModel) {
        return state.loading;
    }

    @Selector()
    static isLoaded(state: ProfileStateModel) {
        return state.loaded;
    }

    @Selector()
    static keywords(state: ProfileStateModel) {
        return state.searchKeywords;
    }

    @Selector()
    static profilesES(state: ProfileStateModel) {
        return state.profilesES;
    }

    @Selector()
    static loadedProfileES(state: ProfileStateModel) {
        return state.loadedProfileES;
    }

    @Selector()
    static profileOwner(state: ProfileStateModel) {
        return state.loadedProfileOwner;
    }

    @Selector()
    static profilesPerPage(state: ProfileStateModel) {
        return state.profilesPerPage;
    }

    @Selector()
    static page(state: ProfileStateModel) {
        return state.page;
    }

    @Selector()
    static categoryFilter(state: ProfileStateModel) {
        return state.categoryFilter;
    }

    @Selector()
    static cityFilter(state: ProfileStateModel) {
        return state.cityFilter;
    }

    @Selector()
    static showFilter(state: ProfileStateModel) {
        return state.showFilter;
    }

    @Selector()
    static listView(state: ProfileStateModel) {
        return state.listView;
    }

    @Action(profileActions.LoadProfile)
    loadProfile(
        ctx: StateContext<ProfileStateModel>,
        { id }: profileActions.LoadProfile
    ) {
        ctx.patchState({
            loading: true
        });

        this.profileService.loadProfile(id)
            .then((result: any) => {
                ctx.dispatch(new profileActions.LoadProfileSuccessfull(result.toJSON()));
            })
            .catch(error => {
                console.error('Error loading Profile: ', error);
                ctx.dispatch(new profileActions.LoadProfileFailed());
            });
    }

    @Action(profileActions.LoadProfileSuccessfull)
    loadProfileSuccessfull(
        ctx: StateContext<ProfileStateModel>,
        { payload }: profileActions.LoadProfileSuccessfull
    ) {
        ctx.patchState({
            loading: false,
            loaded: true,
            loadedProfile: payload,
        });

        this.profileService.loadProfileOwner(payload.objectId)
            .then(foundUser => {
                const uid = foundUser[0].toJSON().objectId;
                ctx.dispatch(new profileActions.SetProfileOwner(uid));
            })
            .catch(error => {
                console.error('There was an error finding the corresponding user', error);
            });
    }

    @Action(profileActions.LoadProfileFailed)
    loadProfileFailed(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            loading: false,
            loaded: false,
            loadedProfile: null
        });
    }

    @Action(profileActions.LoadProfileESSuccessfull)
    loadProfileESSuccessfull(
        ctx: StateContext<ProfileStateModel>,
        { payload }: profileActions.LoadProfileESSuccessfull
    ) {
        ctx.patchState({
            loading: false,
            loaded: true,
            loadedProfileES: payload
        });

        if (payload._source.source === 'edecy_mongodb') {
            this.profileService.loadProfileOwner(payload._source.source_id)
                .then(foundUser => {
                    const uid = foundUser[0].toJSON().objectId;
                    ctx.dispatch(new profileActions.SetProfileOwner(uid));
                })
                .catch(error => {
                    console.error('There was an error finding the corresponding user', error);
                    this.store.dispatch(new fromCards.ClearLoadedCards());
                });
        }

    }

    @Action(profileActions.LoadProfileESFailed)
    loadProfileESFailed(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            loaded: false,
            loading: false,
            loadedProfileES: null
        });
    }

    @Action(profileActions.LoadProfileES)
    loadProfileES(
        ctx: StateContext<ProfileStateModel>,
        { id }: profileActions.LoadProfileES
    ) {
        ctx.patchState({
            loading: true,
            loaded: false
        });

        this.profileESService.loadProfile(id).pipe(take(1)).subscribe((result: ProfileResponse) => {
            console.log('Found Profile: ', result);
            ctx.dispatch(new profileActions.LoadProfileESSuccessfull(result.data.items[0]));
        }, (error: any) => {
            console.error('Error loading profile: ', error);
            ctx.dispatch(new profileActions.LoadProfileESFailed());
        });
    }

    @Action(profileActions.ClearESProfile)
    clearESProfile(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            loadedProfileES: null
        });
    }

    @Action(profileActions.SetProfileOwner)
    setProfileOwner(
        ctx: StateContext<ProfileStateModel>,
        { ownerID }: profileActions.SetProfileOwner
    ) {
        ctx.patchState({
            loadedProfileOwner: ownerID
        });
    }

    @Action(profileActions.CreateProfile)
    createProfile(
        ctx: StateContext<ProfileStateModel>,
        { payload }: profileActions.CreateProfile
    ) {
        ctx.patchState({
            loading: true
        });
        this.profileService.createProfile(payload)
            .then((result: any) => {
                const createdProfile: Profile = {
                    ...result.toJSON()
                };
                this.currentUser$.pipe(take(1)).subscribe((user: any) => {
                    const updatedUser: UserModel = user.toJSON();
                    updatedUser.profileId = createdProfile.objectId;
                    this.authService.setProfile(updatedUser);
                });
                ctx.dispatch(new profileActions.LoadUserProfileSuccessfull(createdProfile));
            })
            .catch(error => {
                console.error('Store: Error creating Profile: ', error);
                ctx.dispatch(new profileActions.LoadUserProfileFailed());
            });
    }

    @Action(profileActions.SaveProfile)
    saveProfile(
        ctx: StateContext<ProfileStateModel>,
        { payload }: profileActions.CreateProfile
    ) {
        ctx.patchState({ loading: true });
        this.profileService.saveProfile(payload)
            .then(result => {
                ctx.dispatch(new profileActions.LoadUserProfileSuccessfull(payload));
            })
            .catch(error => {
                console.error('Updating profile not successfull: ', error);
            });
    }

    @Action(profileActions.DeleteProfile)
    deleteProfile(
        ctx: StateContext<ProfileStateModel>,
        { profileID }: profileActions.DeleteProfile
    ) {
        this.profileService.deleteProfile(profileID)
            .then(result => {
                ctx.patchState({
                    loading: false,
                    loaded: true,
                    loadedProfile: null
                });
            })
            .catch(error => {
                console.error('Error deleting profile: ', error);
            });
    }

    @Action(profileActions.SearchProfilesES)
    searchProfilesES(
        ctx: StateContext<ProfileStateModel>,
        { query }: profileActions.SearchProfilesES
    ) {
        ctx.patchState({
            loaded: false,
            loading: true
        });

        const type = ctx.getState().isPublicFilter;

        if (query) {
            console.log('QUERY KEYWORD', query);
            if (type) {
                this.searchWithTerm(query, ctx, type);
            } else {
                this.searchWithTerm(query, ctx);
            }
        } else if (ctx.getState().searchKeywords.length > 0) {
            console.log('GIVEN QUERY: ', query);
            console.log('Entered Second IF');
            const keywords = this.generateSearchterm(ctx.getState().searchKeywords);

            if (type) {
                this.searchWithTerm(keywords, ctx, type);
            } else {
                this.searchWithTerm(keywords, ctx);
            }
        } else {
            ctx.dispatch(new profileActions.LoadProfilesES(type));
        }
    }

    private generateSearchterm(input: Array<string>): string {
        return input.join(' ');
    }

    private searchWithTerm(query: string, ctx: StateContext<ProfileStateModel>, type?: string) {
        const keywords = query.split(' ');
        console.log('Search term gen: ', keywords);
        ctx.dispatch(new profileActions.AddKeywords(keywords));

        const searchQuery: ProfileQuery = {
            size: ctx.getState().profilesPerPage,
            page: ctx.getState().page,
            q: query
        };
        const completeFilter: ProfileFilter = {
            subject_area: '',
            city: ''
        };

        if (ctx.getState().categoryFilter) {
            searchQuery.category = ctx.getState().categoryFilter;
            completeFilter.subject_area = ctx.getState().categoryFilter;
        }
        if (ctx.getState().cityFilter) {
            searchQuery.city = ctx.getState().cityFilter;
            completeFilter.city = ctx.getState().cityFilter;
        }
        if (type) {
            if (type === 'public') {
                completeFilter.public = true;
            } else {
                completeFilter.public = false;
            }
        }
        this.currentSession$.pipe(take(1)).subscribe(session => {
            if (session) {
                this.tracking.trackProfileFilter(completeFilter, session.objectId);
            }
        });

        this.profileESService.searchProfiles(searchQuery).pipe(take(1)).subscribe((result: ProfileResponse) => {
            console.log('result: ', result);
            const loadedProfiles: Array<ProfileES> = [];

            result.data.items.forEach(profile => {
                if (type) {
                    if (type === 'public') {
                        if (profile._source.status !== 'saved' &&
                            (profile._source.public === true || profile._source.status === 'external')) {
                            loadedProfiles.push(profile);
                        }
                    } else {
                        if (profile._source.status !== 'saved' && profile._source.public === false) {
                            loadedProfiles.push(profile);
                        }
                    }
                } else {
                    if (profile._source.status !== 'saved') {
                        loadedProfiles.push(profile);
                    }
                }

            });

            ctx.dispatch(new profileActions.LoadProfilesESSuccessfull(loadedProfiles));
        }, (error: any) => {
            console.error('Error searching profiles', error);
            ctx.dispatch(new profileActions.LoadProfilesESFailed());
        });
    }

    @Action(profileActions.LoadProfilesES)
    loadProfilesES(
        ctx: StateContext<ProfileStateModel>,
        { type }: profileActions.LoadProfilesES
    ) {
        ctx.patchState({
            loaded: false,
            loading: true
        });

        const searchQuery: ProfileQuery = {
            size: ctx.getState().profilesPerPage,
            page: ctx.getState().page,
        };
        const completeFilter: ProfileFilter = {
            subject_area: '',
            city: ''
        };
        if (ctx.getState().categoryFilter !== null) {
            searchQuery.category = ctx.getState().categoryFilter;
            completeFilter.subject_area = ctx.getState().categoryFilter;
        }
        if (ctx.getState().cityFilter !== null) {
            searchQuery.city = ctx.getState().cityFilter;
            completeFilter.city = ctx.getState().cityFilter;
        }
        if (type) {
            if (type === 'public') {
                completeFilter.public = true;
            } else {
                completeFilter.public = false;
            }
        }
        this.currentSession$.pipe(take(1)).subscribe(session => {
            if (session) {
                this.tracking.trackProfileFilter(completeFilter, session.objectId);
            }
        });

        this.profileESService.searchProfiles(searchQuery).pipe(take(1)).subscribe((result: ProfileResponse) => {
            console.log('Result: ', result);
            const loadedProfiles: Array<ProfileES> = [];

            result.data.items.forEach(profile => {
                if (type) {
                    if (type === 'public') {
                        if (profile._source.status !== 'saved' &&
                            (profile._source.public === true || profile._source.status === 'external')) {
                            loadedProfiles.push(profile);
                        }
                    } else {
                        if (profile._source.status !== 'saved' && profile._source.public === false) {
                            loadedProfiles.push(profile);
                        }
                    }
                } else {
                    if (profile._source.status !== 'saved') {
                        loadedProfiles.push(profile);
                    }
                }
            }, (error: any) => {
                console.error('Error searching profiles', error);
                ctx.dispatch(new profileActions.LoadProfilesESFailed());
            });

            ctx.dispatch(new profileActions.LoadProfilesESSuccessfull(loadedProfiles));
        });
    }

    @Action(profileActions.LoadProfilesESSuccessfull)
    loadProfilesESSuccessfull(
        ctx: StateContext<ProfileStateModel>,
        { payload }: profileActions.LoadProfilesESSuccessfull
    ) {
        ctx.patchState({
            loaded: true,
            loading: false,
            profilesES: payload
        });
    }

    @Action(profileActions.LoadProfilesESFailed)
    loadProfilesESFailed(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            loading: false,
            loaded: false
        });
    }

    @Action(profileActions.FilterPublicES)
    filterPublicES(
        ctx: StateContext<ProfileStateModel>,
        { type }: profileActions.FilterPublicES
    ) {
        ctx.patchState({
            isPublicFilter: type
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.LoadUserProfile)
    loadUserProfile(
        ctx: StateContext<ProfileStateModel>,
        { profileId }: profileActions.LoadUserProfile
    ) {
        ctx.patchState({
            loading: true,
            loaded: false,
        });

        this.profileService.loadProfile(profileId)
            .then((result: any) => {
                ctx.dispatch(new profileActions.LoadUserProfileSuccessfull(result.toJSON()));

            })
            .catch(error => {
                console.error('Error loading user profile: ', error.message);
                ctx.dispatch(new profileActions.LoadUserProfileFailed());
            });
    }

    @Action(profileActions.LoadUserProfileSuccessfull)
    loadUserProfileSuccessfull(
        ctx: StateContext<ProfileStateModel>,
        { userProfile }: profileActions.LoadUserProfileSuccessfull
    ) {
        ctx.patchState({
            userProfile,
            loading: false,
            loaded: true
        });
    }

    @Action(profileActions.LoadUserProfileFailed)
    loadUserProfileFailed(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.dispatch({
            userProfile: null,
            loading: false,
            loaded: false
        });
    }

    @Action(profileActions.ClearSelectedProfile)
    clearSelectedProfile(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            loadedProfile: null
        });
    }

    @Action(profileActions.AddKeywords)
    addKeywords(
        ctx: StateContext<ProfileStateModel>,
        { payload }: profileActions.AddKeywords
    ) {
        ctx.patchState({
            searchKeywords: payload
        });
    }

    @Action(profileActions.ClearKeywords)
    clearKeywords(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            searchKeywords: []
        });

        ctx.dispatch(new profileActions.GoToPage(1));
    }

    @Action(profileActions.GetProfileByUser)
    getProfileByUser(
        ctx: StateContext<ProfileStateModel>,
        { uid }: profileActions.GetProfileByUser
    ) {
        this.authService.loadUser(uid)
            .then((user: User) => {
                if (user.attributes.profileId !== '') {
                    ctx.dispatch(new profileActions.LoadProfile(user.attributes.profileId));
                } else {
                    ctx.dispatch(new profileActions.LoadProfileFailed());
                }
            })
            .catch(error => {
                console.error('Error loading user: ', error);
                ctx.dispatch(new profileActions.LoadProfileFailed());
            });
    }

    @Action(profileActions.ResetCompleteState)
    resetCompleteState(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState(
            profileStateDefaults
        );
    }

    @Action(profileActions.ChangePage)
    changePage(
        ctx: StateContext<ProfileStateModel>,
        { page }: profileActions.ChangePage
    ) {
        ctx.patchState({
            page
        });
    }

    @Action(profileActions.ChangeProfilesSize)
    changeProfilesSize(
        ctx: StateContext<ProfileStateModel>,
        { size }: profileActions.ChangeProfilesSize
    ) {
        ctx.patchState({
            profilesPerPage: size
        });
    }

    @Action(profileActions.SetCategory)
    setCategory(
        ctx: StateContext<ProfileStateModel>,
        { category }: profileActions.SetCategory
    ) {
        ctx.patchState({
            categoryFilter: category
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.ClearCategory)
    clearCategory(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            categoryFilter: null
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.SetCity)
    setCity(
        ctx: StateContext<ProfileStateModel>,
        { city }: profileActions.SetCity
    ) {
        ctx.patchState({
            cityFilter: city
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.ClearCity)
    clearCity(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            cityFilter: null
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.PreviousPage)
    previousPage(
        ctx: StateContext<ProfileStateModel>,
    ) {
        const currentPage = ctx.getState().page;
        ctx.patchState({
            page: currentPage - 1
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.NextPage)
    nextPage(
        ctx: StateContext<ProfileStateModel>,
    ) {
        const currentPage = ctx.getState().page;
        ctx.patchState({
            page: currentPage + 1
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.GoToPage)
    goToPage(
        ctx: StateContext<ProfileStateModel>,
        { pageNo }: profileActions.GoToPage
    ) {
        ctx.patchState({
            page: pageNo
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.ChangeToPage)
    changeToPage(
        ctx: StateContext<ProfileStateModel>,
        { change }: profileActions.ChangeToPage
    ) {
        const currentPage = ctx.getState().page;

        ctx.patchState({
            page: currentPage + change
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.SetSize)
    setSize(
        ctx: StateContext<ProfileStateModel>,
        { size }: profileActions.SetSize
    ) {
        ctx.patchState({
            profilesPerPage: size
        });

        ctx.dispatch(new profileActions.SearchProfilesES());
    }

    @Action(profileActions.ResetPage)
    resetPage(
        ctx: StateContext<ProfileStateModel>,
    ) {
        ctx.patchState({
            page: 1
        });
    }

    @Action(profileActions.ToggleFilter)
    toggleFilter(
        ctx: StateContext<ProfileStateModel>
    ) {
        const newShowFilter = !ctx.getState().showFilter;

        ctx.patchState({
            showFilter: newShowFilter
        });
    }

    @Action(profileActions.ChangeView)
    changeView(
        ctx: StateContext<ProfileStateModel>,
        { listView }: profileActions.ChangeView
    ) {
        ctx.patchState({
            listView
        });
    }


}
