export interface QueryColumn {
    queryId: string;
    displayName: string;
    propName: string;
    isWide: boolean;
    isTitle: boolean;

    // TFS Column Props
    referenceName: string;
    name: string;
}
