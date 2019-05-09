import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryService } from '@shared/services/query.service';
import { ConfigService } from 'config/services/config.service';
import { AsyncSubject, Observable } from 'rxjs';
import { Query } from '@shared/models/query';
import { map } from 'rxjs/operators';
import { TfsQueryOrFolder } from 'analyitics/models/tfs-query';
import { QueryColumn } from 'analyitics/models/query-column';

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

    getQueries(id?: string): Observable<Array<TfsQueryOrFolder>> {
        if (id) { id = '/' + id; }
        return this.http.get(`${this.baseProjectLocation}/wit/queries${id || ''}?$depth=1&$expand=1`, this.options).pipe(map(val => {
            const newVal = val['value'].map(this.queryOrFolderMap.bind(this));
            return newVal;
        }));
    }

    private queryOrFolderMap(tfsQuery: TfsQueryOrFolder) {
        return <TfsQueryOrFolder>{
            ...tfsQuery,
            createdDate: new Date(tfsQuery.createdDate),
            children: tfsQuery.children ? tfsQuery.children.map(this.queryOrFolderMap.bind(this)) : null,
            columns: tfsQuery.columns ? tfsQuery.columns.map(col => this.columnMap(col, tfsQuery)) : null
        };
    }

    private columnMap(column: QueryColumn, query: TfsQueryOrFolder) {
        return <QueryColumn>{
            ...column,
            queryId: query.id,
            displayName: column.name,
            propName: column.referenceName,
            isWide: false,
            isTitle: false
        };
    }
}
