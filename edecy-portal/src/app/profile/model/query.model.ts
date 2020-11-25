export interface ProfileQuery {
    q?: string;
    id?: string;
    city?: string;
    country?: string;
    name?: string;
    size?: number; // default: 10, max: 50
    page?: number;
    status?: string; // possible values: published, saved, external,
    category?: string;
}
