import { Build } from './build.model';
import { Release } from './release.model';
import { HeartbeatSettings } from '@environments/models/heartbeat-settings.model';
import { ReleaseDefinition } from '@environments/models/release-definition.model';

export interface Deployment {
    name: string;
    build: Build;
    release: Release;
    releaseDefinition: ReleaseDefinition;
    applicableBuilds: Array<Build>;
    settings: HeartbeatSettings;
}
