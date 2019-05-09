import { QueryColumn } from 'analyitics/models/query-column';

export interface TfsQueryOrFolder {
    id: string;
    name: string;
    path: string;
    createdBy: any; // TODO: User
    createdDate: Date;
    lastModifiedBy: any; // TODO: User
    isFolder: boolean;
    hasChildren: boolean;
    children: Array<TfsQueryOrFolder>;

    // Query only
    queryType: string; // Opt: 'oneHop', 'flat'
    columns: Array<QueryColumn>;
    wiql: string;

    // Mercury only
    isExpanded: boolean;
}
