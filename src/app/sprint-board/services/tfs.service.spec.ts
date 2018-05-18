import { TestBed } from '@angular/core/testing';
import { Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { TfsService } from './tfs.service';

describe('TfsService', () => {
    let service: TfsService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TfsService,
                { provide: Http, useClass: MockBackend }
            ]
        });

        service = TestBed.get(TfsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
