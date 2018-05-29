import { Build } from './build.model';
import { Release } from './release.model';

export interface Deployment {
    name: string;
    build: Build;
    release: Release;
    applicableBuilds: Array<Build>;
}
