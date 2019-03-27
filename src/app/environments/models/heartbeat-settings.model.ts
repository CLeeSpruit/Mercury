
export interface HeartbeatSettings {
    releaseName: string;
    associatedBuildName: string;
    priority: number;
    favorite: boolean;
    alertBuilds: boolean;
    alertReleases: boolean;
}
