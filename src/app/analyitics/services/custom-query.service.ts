import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryService } from '@shared/services/query.service';
import { ConfigService } from 'config/services/config.service';
import { AsyncSubject, Observable } from 'rxjs';
import { Query } from '@shared/models/query';

@Injectable()
export class CustomQueryService extends QueryService {
    private subFolder = 'Custom Queries';

    constructor(
        protected http: HttpClient,
        protected configService: ConfigService
    ) {
        super(http, configService);
    }

    // Mirrored from super.createQuery
    createCustomQuery(queryName: string, queryString: string): AsyncSubject<string> {
        const isSuccessful: AsyncSubject<string> = new AsyncSubject<string>();
        this.fetchSubFolder(this.subFolder).subscribe(id => {
            const query: Query = <Query>{
                'api-version': '1.0',
                name: queryName,
                isFolder: false,
                wiql: queryString
            };

            // Create New Mercury query
            this.http.post(`${this.baseProjectLocation}wit/queries/${id}?api-version=1.0`, query, this.options).subscribe(
                (data: any) => {
                    isSuccessful.next(data.id);
                    isSuccessful.complete();
                }, () => {
                    isSuccessful.next(null);
                    isSuccessful.complete();
                });
        });

        return isSuccessful;
    }

    runCustomQuery(queryId: string): Observable<Array<any>> {
        return super.runQuery(queryId);
    }
}
