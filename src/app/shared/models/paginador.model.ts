export class Paginador {


    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: [];
    totalElements: number;
    totalPages: number;

}


export class Pageable {



    pageNumber: number;
     pageSize: number;
      sort: any; offset: number; paged: boolean;


}