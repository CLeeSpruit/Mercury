import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { TfsQueryOrFolder } from 'analyitics/models/tfs-query';

@Injectable()
export class AnalyticsCommService {
    private queryResultsSubject: Subject<Array<any>> = new Subject<Array<any>>();
    private queryEditSubject: Subject<TfsQueryOrFolder> = new Subject<TfsQueryOrFolder>();

    getQueryResults(): Observable<Array<any>> {
        return this.queryResultsSubject.asObservable();
    }

    setQueryResults(results: Array<any>) {
        this.queryResultsSubject.next(results);
    }

    getQueryEdit(): Observable<TfsQueryOrFolder> {
        return this.queryEditSubject.asObservable();
    }

    setQueryEdit(query: TfsQueryOrFolder) {
        this.queryEditSubject.next(query);
    }
}
