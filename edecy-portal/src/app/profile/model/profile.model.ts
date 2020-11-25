import { Filter } from './filter.model';
import { ProfileES } from './profileES.model';

export interface ResearchFocus {
    title: string;
    description: string;
    tags?: Array<string>;
}

export interface Project {
    title: string;
    description: string;
    tags?: Array<string>;
    logoURL?: string;
}

export interface Publication {
    title: string;
    description: string;
    tags?: Array<string>;
    publicationURL?: string;
}

export interface Infrastructure {
    title: string;
    description: string;
    imageUrl?: string;
}

export interface Profile {
    // Stammdaten
    objectId?: string;
    title: string;
    status: string;
    description: string;
    logoURL?: string;
    category: Array<string>;
    specialty1: string;
    specialty2: string;
    specialty3: string;
    specialties3: Array<string>;
    organisation?: string;
    public?: boolean;
    streetNo?: string;
    plz?: string;
    city?: string;
    uid?: Array<string>;
    tags?: Array<string>;
    loginRequired?: boolean;

    // Forschung
    researchFocus?: Array<ResearchFocus>;

    // Projekte
    projects?: Array<Project>;

    // Publikationen
    publications?: Array<Publication>;

    // Infrastruktur
    infrastructure: Array<Infrastructure>;

    orgSize?: string;
    companyType?: string;
    instituteType?: string;
    interest?: Array<string>;
    projectLeadershipPossible?: boolean;
}

export interface ProfileStateModel {
    userProfile: Profile;
    loadedProfile: Profile;
    loaded: boolean;
    loading: boolean;
    loadedProfiles: Array<Profile>;
    profilesFiltered: boolean;
    filteredProfiles: Array<Profile>;
    searchKeywords: Array<string>;
    profileFilter: Filter;
    profilesES: Array<ProfileES>;
    loadedProfileES: ProfileES;
    page: number;
    profilesPerPage: number;
    loadedProfileOwner: string;
    categoryFilter: string;
    cityFilter: string;
    showFilter: boolean;
    isPublicFilter: string;
    listView: boolean;
}
