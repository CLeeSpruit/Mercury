import { BuildIssueData } from './build-issue-data.model';

export interface BuildIssue {
    type: string;
    category: string;
    message: string;
    data: BuildIssueData;
}

// TODO: Const for issue type
// TODO: Const for issue category
