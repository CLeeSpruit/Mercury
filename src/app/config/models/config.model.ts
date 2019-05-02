import { ProjectSettings } from 'config/models/project-config.model';

export interface ConfigSettings {
    currentProject: string;
    isDarkMode: boolean;
    titlebarColor: string;
    projectSettings: Map<string, ProjectSettings>;
}
