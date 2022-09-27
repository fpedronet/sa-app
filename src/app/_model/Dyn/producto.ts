import { pagination } from "../pagination";

export class Producto {
    cod1?: string;
    cod2?: string;
    descripcion?: string;
    unidadMed?: string;
    uniNeg?: string;

    linNeg?: string;
    unidadMedComp?: string;
    registro?: string;
    temperatura?: string;
    codEqv?: string;
    cateCmd?: string;
    subCateCmd?: string;
    observaciones?: string;
    estado?: string;
    factConver?: string;
    fecExpiraObligado?: string;

    codigo?: string;
    columna?: string;
    valor?: string;
}


export class ProductoRequest extends pagination {
    linea?: string;
    division?: string;
    producto?: string;
    estado?: string;;
}