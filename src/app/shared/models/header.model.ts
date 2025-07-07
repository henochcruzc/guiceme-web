export class Header {
    uno: Array<ElementoHeader>;
    dosis: ElementoInformacionHeader;
    dos: string;


}


export class ElementoHeader{
    class: string;
    titulo: string;
    texto: string;
}

export class ElementoInformacionHeader{
    class: string;
    colorClass: string;
    iconName: string;
    informacion:Array<Separador>;
}

export class Separador{
    separador: boolean;
    titulo: string;
    texto: string;
   

}