import 'jest-preset-angular';

// common rxjs imports
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';

import 'rxjs/add/operator/take';
// import 'rxjs/add/operator/on';
// import 'rxjs/add/operator/me';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';

/******
    If you really can't figure out why rxjs is not running correctly,
    try using the next line. If it doesn't work with that, the problem is the test.
*******/
// import 'rxjs/Rx';

import './jest-global-mocks';
