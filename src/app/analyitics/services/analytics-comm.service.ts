import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class AnalyticsCommService {
    private queryResultsSubject: Subject<Array<any>> = new Subject<Array<any>>();

    getQueryResults(): Observable<Array<any>> {
        return this.queryResultsSubject.asObservable();
    }

    setQueryResults(results: Array<any>) {
        this.queryResultsSubject.next(results);
    }
}
