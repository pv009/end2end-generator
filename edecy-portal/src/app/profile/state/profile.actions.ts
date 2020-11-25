import { Profile } from '../model/profile.model';
import { ProfileES } from '../model/profileES.model';

export class LoadProfile {
    static readonly type = '[PROFILE] Loading Profile';
    constructor(public readonly id: string) {}
}

export class LoadProfileSuccessfull {
    static readonly type = '[PROFILE] Loaded Profile Successfull';
    constructor(public readonly payload: Profile) {}
}

export class LoadProfileFailed {
    static readonly type = '[PROFILE] Loading Profile Failed';
    constructor(public readonly payload?: any) {}
}

export class CreateProfile {
    static readonly type = '[PROFILE] Creating Profile';
    constructor(public readonly payload: Profile) {}
}

export class SaveProfile {
    static readonly type = '[PROFILE] Saving Profile';
    constructor(public readonly payload: Profile) {}
}

export class DeleteProfile {
    static readonly type = '[PROFILE] Deleting Profile';
    constructor(public readonly profileID: string) {}
}

export class LoadUserProfile {
    static readonly type = '[PROFILE] Loading User\'s Profile';
    constructor(public readonly profileId: string) {}
}

export class LoadUserProfileSuccessfull {
    static readonly type = '[PROFILE] Loaded User Profile successfully';
    constructor(public readonly userProfile: Profile) {}
}

export class LoadUserProfileFailed {
    static readonly type = '[PROFILE] Loading User Profile failed';
}

export class ClearSelectedProfile {
    static readonly type = '[PROFILE] Clearing selected Profile';
}

export class AddKeywords {
    static readonly type = '[PROFILE] Adding Keywords';
    constructor(public readonly payload: Array<string>) {}
}

export class ClearKeywords {
    static readonly type = '[PROFILE] Clearing Keywords';
}

export class GetProfileByUser {
    static readonly type = '[PROFILE] Fetching Profile by User';
    constructor(public readonly uid: string) {}
}

export class ResetCompleteState {
    static readonly type = '[PROFILE] Resetting complete state';
}

export class LoadProfilesES {
    static readonly type = '[PROFILE] Loading Profiles from ES';
    constructor(public readonly type?: string) {}
}

export class LoadProfilesESSuccessfull {
    static readonly type = '[PROFILE] Loaded Profiles from ES successfully';
    constructor(public readonly payload: Array<ProfileES>) {}
}

export class LoadProfilesESFailed {
    static readonly type = '[PROFILE] Loading Profiles from ES failed';
}

export class SearchProfilesES {
    static readonly type = '[PROFILE] Searching Profiles on ES';
    constructor(public readonly query?: string) {}
}

export class LoadProfileES {
    static readonly type = '[PROFILE] Loading Profile from ES';
    constructor(public readonly id: string) {}
}

export class LoadProfileESSuccessfull {
    static readonly type = '[PROFILE] Loaded Profile from ES successfully';
    constructor(public readonly payload: ProfileES) {}
}

export class LoadProfileESFailed {
    static readonly type = '[PROFILE] Loading Profiled from ES failed';
}

export class ClearESProfile {
    static readonly type = '[PROFILE] Clearing ES Profile';
}

export class SetProfileOwner {
    static readonly type = '[PROFILE] Setting Profile owner';
    constructor(public readonly ownerID: string) {}
}

export class ChangeProfilesSize {
    static readonly type = '[PROFILE] Changing size of shown Profiles';
    constructor(public readonly size: number) {}
}

export class ChangePage {
    static readonly type = '[PROFILE] Changing the page';
    constructor(public readonly page: number) {}
}

export class SetCategory {
    static readonly type = '[PROFILE] Setting Category';
    constructor(public readonly category: string) {}
}

export class ClearCategory {
    static readonly type = '[PROFILE] Clearing Category';
}

export class PreviousPage {
    static readonly type = '[PROFILE] Going to Previous Page';
}

export class NextPage {
    static readonly type = '[PROFILE] Going to Next Page';
}

export class GoToPage {
    static readonly type = '[PROFILE] Going to Specified Page';
    constructor(public readonly pageNo: number) {}
}

export class ChangeToPage {
    static readonly type = '[PROFILE] Changing Page';
    constructor(public readonly change: number) {}
}

export class SetSize {
    static readonly type = '[PROFILE] Setting Profile Results Size';
    constructor(public readonly size: number) {}
}

export class ResetPage {
    static readonly type = '[PROFILE] Setting Page to One';
}

export class SetCity {
    static readonly type = '[PROFILE] Setting City';
    constructor(public readonly city: string) {}
}

export class ClearCity {
    static readonly type = '[PROFILE] Clearing City';
}

export class ToggleFilter {
    static readonly type = '[PROFILE] Toggling Filter';
}

export class FilterPublicES {
    static readonly type = '[PROFILE] Filtering Profiles by public';
    constructor(public readonly type: string) {}
}

export class ChangeView {
    static readonly type = '[PROFILE] Changing view type';
    constructor(public readonly listView: boolean) {}
}


export type ProfileActions =
| LoadUserProfile
| LoadUserProfileSuccessfull
| LoadUserProfileFailed
| CreateProfile
| SaveProfile
| DeleteProfile
| LoadProfile
| LoadProfileSuccessfull
| ClearSelectedProfile
| AddKeywords
| ClearKeywords
| GetProfileByUser
| ResetCompleteState
| LoadProfilesES
| LoadProfilesESFailed
| LoadProfilesESSuccessfull
| SearchProfilesES
| LoadProfileES
| LoadProfileESFailed
| LoadProfileESSuccessfull
| ClearESProfile
| SetProfileOwner
| ChangePage
| ChangeProfilesSize
| SetCategory
| ClearCategory
| PreviousPage
| NextPage
| ChangeToPage
| GoToPage
| SetSize
| ResetPage
| SetCity
| ClearCity
| FilterPublicES
| ToggleFilter
| ChangeView;
