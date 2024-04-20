

export class PaginationDto {

    private constructor(
        public readonly page: number,
        public readonly pagesize: number,
    ){}

    static createPagination(page:number = 1, pageSize:number = 10): [string?, PaginationDto?]{
        if(isNaN(page) || isNaN(pageSize)) return ["Request invalid"];
        if(page <= 0 ) return ["Pagina debe ser superior a 0"];
        if(pageSize <= 0 ) return ["Tamaño de la pagina debe ser mayor a 0"];

        return [undefined, new PaginationDto(page, pageSize)]
    }

}