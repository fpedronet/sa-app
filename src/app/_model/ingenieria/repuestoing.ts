import { pagination } from "../pagination";

export class RepuestoIng {
    codProd?: string;
    codEqv?: string;
    repuesto?: string;
    rEF1?: string;
    rEF4?: string;
    ultEnvio?: Date;
    vUltEnvio?: string;
    codIng?: string;
    ingeniero?: string;
    prestamo?: string;
    devolucion?: string;
    saldo?: string;
}


export class RepuestoIngRequest extends pagination {

}