import { ProfileInfrastructure, ProfileProject, ProfilePublications, ProfileResearchFocus } from 'src/app/profile/model/profileES.model';

export interface Tracking {
    objectId?: string;
    createdAt?: string;
    updatedAt?: string;

    // User Data
    uid: string;
    org_plz: string;
    favorites: Array<string>;
    profile_id: string;

    // Card Data
    user_cards: Array<TrackingCard>;

    // Profile Data
    user_profile: UserProfile;

    // User Behaviour Data
    profile_searches: Array<ProfileSearch>;
    card_searches: Array<CardSearch>;
    profile_filters: Array<ProfileFilter>;
    card_filters: Array<CardFilter>;
    clicked_profiles: Array<TrackingProfile>;
    clicked_cards: Array<TrackingCard>;
    messaged_profiles: Array<TrackingProfile>;
    messaged_cards: Array<TrackingCard>;
}

export interface ProfileSearch {
    keyword: string;
}

export interface CardSearch {
    keyword: string;
}

export interface ProfileFilter {
    subject_area?: string;
    city?: string;
    public?: boolean;
}

export interface CardFilter {
    subject_areas: Array<string>;
}

export interface TrackingCard {
    id?: string;
    title: string;
    description: string;
    category: Array<string>;
    subject_areas: Array<string>;
    zip_code?: string;
    tags?: Array<string>;
    org_size?: string;
}

export interface TrackingProfile {
    // Stammdaten
    profileId?: string;
    title: string;
    description: string;
    subject_areas: Array<string>;
    public?: boolean | string;
    plz?: string;
    tags?: Array<string>;

    // Forschung
    projects: Array<ProfileProject>;
    publications: Array<ProfilePublications>;
    infrastructure: Array<ProfileInfrastructure>;
    research_focus: Array<ProfileResearchFocus>;

    org_size?: string;
}

export interface Project {
    title: string;
    description: string;
    tags?: Array<string>;
}

export interface Publication {
    title: string;
    description: string;
    tags?: Array<string>;
}

export interface Infrastructure {
    title: string;
    description: string;
}

export interface ResearchFocus {
    title: string;
    description: string;
    tags?: Array<string>;
}

export interface UserProfile {
    // Stammdaten
    profileId?: string;
    title: string;
    description: string;
    subject_areas: Array<string>;
    public?: boolean | string;
    plz?: string;
    tags?: Array<string>;

    // Forschung
    projects: Array<Project>;
    publications: Array<Publication>;
    infrastructure: Array<Infrastructure>;
    research_focus: Array<ResearchFocus>;

    org_size: string;
}

export interface TrackingStateModel {
    session?: Tracking;
    loading: boolean;
    loaded: boolean;
}
