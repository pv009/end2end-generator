import { ProfileQuery } from './query.model';

export interface ProfileResponse {
    status: string;
    data: {
        query: ProfileQuery;
        items: Array<ProfileES>;
    };
}

export interface ProfileES {
    _index: string;
    _type: string;
    _id: string;
    _score: string;
    _source: {
        source_id: string;
        source: string;
        address: string;
        country: string;
        city: string;
        zip_code: string;
        phone: string;
        fax: string;
        email: string;
        website: string;
        projects: Array<ProfileProject>;
        publications: Array<ProfilePublications>;
        infrastructure: Array<ProfileInfrastructure>;
        tags: Array<string>;
        institute_name: string;
        organization: string;
        research_focus: Array<ProfileResearchFocus>;
        status: string;
        description: string;
        logo_url: string;
        public: string | boolean; // ??
        organization_id: string;
        _created_at: string;
        _updated_at: string;
        subject_areas?: Array<string>;
        loginRequired?: boolean | string;
        orgSize?: string;
        company_type?: string;
        institute_type?: string,
        interest?: Array<string>;
        project_leadership_possible?: boolean | string;
        uid?: Array<string>;
    };
}

export interface ProfileProject {
    project_id?: string;
    project_name?: string;
    project_description?: string;
    subject_area?: string;
    title?: string;
    description?: string;
}

export interface ProfilePublications {
    publication_name?: string;
    title?: string;
    description?: string;
}

export interface ProfileInfrastructure {
    infrastructure_name?: string;
    title?: string;
    description?: string;
}

export interface ProfileResearchFocus {
    focus_name?: string;
    title?: string;
    description?: string;
}
