export interface Sprint {
    id: string;
    name: string;
    path: string;
    attributes: {
        startDate: Date,
        finishDate: Date
    };
}
