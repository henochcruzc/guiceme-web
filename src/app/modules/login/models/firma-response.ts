export class FirmaResponse {

    
    public constructor(init?: Partial<FirmaResponse>) {
        Object.assign(this, init);
    }

    curp?: string;
    resultado?: number;
    rfc?: string;
    texto?: string;
    token?: string;
    vigFin?: string;
    vigIni?: string;
    nombre?: string;
    razonSocial?: string;

}


export interface Contenedores {
  cadori: string;
  cms: string;
}

export class FirmaCmsResponse {

  constructor(
    public serie_cert?: string,
    public vigIni?: string,
    public vigFin?: string,
    public resultado?: number,
    public texto?: string,
    public folio?: string,
    public acuse?: string,
    public cadori?: string,
    public certificado?: string,
    public firma?: string,
    public rfc?: string,
    public curp?: string,
    public contenedores?: Contenedores[],
    public nombreRazonSocial?: string,
    public firmas?: string[],
    public rfc_rl?: string,
    public curp_rl?: string,
    public archivosFirmados?: any
  ) {
  }

}
