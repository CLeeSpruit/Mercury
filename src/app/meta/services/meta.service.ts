import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Change } from '../models/change.class';

@Injectable()
export class MetaService {
    private location = './assets/changelog/changelog.json';
    constructor(private http: HttpClient) { }

    getChangelog(): Observable<Array<Change>> {
        return this.http.get<Array<Change>>(this.location);
    }
}
