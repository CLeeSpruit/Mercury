export interface BuildIssueData {
    type: string;
    sourcePath: string;
    linenumber: string; // Yes number is lowercase
    columnnumber: string; // Yes number is also lowercase
    code: string;
    repo: string;
}
