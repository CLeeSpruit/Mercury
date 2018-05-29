export interface BuildDefinition {
    id: number;
    name: string;
    path: string;
    project: any; // TODO: Create project model
    revision: number;
    type: string;
    url: string;
}
