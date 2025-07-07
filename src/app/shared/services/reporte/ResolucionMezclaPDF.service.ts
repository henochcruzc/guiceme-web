import { Injectable } from "@angular/core";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { RESOURCES } from "./resources";
import { reporteMezclasAprobadasModel } from "../../models/reporte.mezclas.aprobadas.model"; 
import { BehaviorSubject } from "rxjs";
import { ReporteMezclasAprobadasDataService } from "./ReporteMezclasAprobadasDataService";
import { NgxSpinnerService } from 'ngx-spinner';
import { formatDate } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class resolucionPDF {

    constructor(private reporteMezclasAService: ReporteMezclasAprobadasDataService, private spinner : NgxSpinnerService) {
        this._memoriaDataSubject = new BehaviorSubject(null);
        this._memoriaDataSubject.subscribe(val => {
            this.memoriaData = val;
        })
    }

    FONT_SIZE_BODY_PDF = 9;
    FONT_SIZE_LIST_MEZCLAS=12;

    mapColumnStyles = new Map<string, {}>([
        ["Sinopsis", { 0: { cellWidth: 80 }, 1: { cellWidth: 300 } }],
        ["key1", { 0: { cellWidth: 190 }, 1: { cellWidth: 120 }, 2: { cellWidth: 120 }, 3: { cellWidth: 145 } }],
    ]);

    _memoriaDataSubject: BehaviorSubject<any>;
    doc;

    public memoriaData: reporteMezclasAprobadasModel = null;

    margins = {
        top: 18.75,
        bottom: 18.75,
        left: 18.75
    };

    async prepareData() {
     
            (await this.reporteMezclasAService.getData()).toPromise().then(
                data => {
                    this.memoriaData = data;
                    
                }
            );
        
    }

    async prepareDataRE(data) {	
                this.memoriaData = data;

	}


    async preparePdf() {
        this.doc = new jsPDF('l', 'pt', 'letter')

        this.doc.addFileToVFS("Montserrat-Regular-normal.ttf", RESOURCES.montserratRegular);
        this.doc.addFileToVFS("Montserrat-SemiBold-normal.ttf", RESOURCES.monserratSemiBold);
        this.doc.addFont("Montserrat-Regular-normal.ttf", "Montserrat-Regular", "normal");
        this.doc.addFont("Montserrat-SemiBold-normal.ttf", "Montserrat-SemiBold", "normal");

    }

    async 	createResolucion(model): Promise<any> {
       
        await this.prepareDataRE(model).then(async r => {
             this.preparePdf().then(async re => {
                 //this.addContentRE(model).then(async resp => {
                     this.createHeader(model).then(async resp => {

                            let nomDocumento = "Resolución.pdf"
                            // Open PDF document in new tab
                            //this.doc.output('dataurlnewwindow')

                            this.doc.setProperties({
								title: nomDocumento
							})

                            this.doc.output('dataurlnewwindow',"Resolución.pdf")
                            
                            // Download PDF document                           
                            this.doc.save(nomDocumento);

                    //});
                })
            })
        })
    }

    async addContent(usuario) {

        (this.doc as any).autoTable({
            head: [],
            body: []
        })

        var mapAsc = new Map([...this.memoriaData.mapTablas.entries()].sort((a, b) => a[0] - b[0]));
        // console.log(mapAsc)
        let index = 0;
        let posFinalUltimaTablaSave=0;
        mapAsc.forEach((value, key) => {
            // console.log(value, key);
            const element = value;
            this.doc.setFont('Montserrat-SemiBold')
            this.doc.setTextColor(103, 103, 103);
            this.doc.setFontSize(9);

            if(index == 1){
                this.createLine(this.doc.lastAutoTable.finalY + 5,5);
            }

            var posFinalUltimaTabla=this.doc.lastAutoTable.finalY;
            var altoDocumento = this.doc.internal.pageSize.height - (this.margins.bottom + 5)
            // console.log('alto disponible ',altoDocumento - posFinalUltimaTabla);
    

            let marginTb = 45;
            let posNewElement = this.doc.lastAutoTable.finalY;
            if((altoDocumento - posFinalUltimaTabla) <  180){
                // this.doc.rect(this.margins.left, this.doc.lastAutoTable.finalY, 754.5, altoDocumento - posFinalUltimaTabla); // empty square 
                marginTb = 0;
                posNewElement = this.margins.top + 65;
                this.doc.addPage();   
            }
                        
            if(element.title){
                //incorporamos icono
                this.doc.addImage(RESOURCES.base64ListadoMezclaImgLogo, 'PNG', this.margins.left+8, posNewElement + marginTb, 10, 13)          
               
                 this.doc.setFontSize(this.FONT_SIZE_LIST_MEZCLAS);
                this.doc.text(element.title, this.margins.left+35, posNewElement + marginTb+10);
                marginTb += 5;
              //  this.createLine(posNewElement + marginTb);
                marginTb += 10;
            }

            let stilefont;
            let nextcelltext;
            (this.doc as any).autoTable({
                head: element.header,
                body: element.data,

                startY: posNewElement + marginTb,
                //tableWidth: 754.5,
                margin: { top: 75, left: this.margins.left, bottom: this.margins.bottom + 80 },
                styles: //element.styles,
                {
                    minCellHeight: 10,
                    fontSize: this.FONT_SIZE_BODY_PDF,
                    font: 'Montserrat-Regular',
                    
                    cellPadding: {top: 5, right: 5, bottom: 5, left: 0},
                    halign: 'justify',
                    textColor: [103, 103, 103]
                },
                headStyles: {
                    minCellHeight: 10,
                    fontSize: this.FONT_SIZE_BODY_PDF,
                    font: 'Montserrat-SemiBold',
                    fillColor : [240, 250, 237],
                    cellPadding: {top: 5, right: 5, bottom: 5, left: 0},
                    halign: 'left',
                    textColor: [103, 103, 103]
                },
                showHead: 'everyPage',
                verticalMargin: 'topMargin',
                columnStyles: element.columnStyles,
                theme: 'plain',
                willDrawCell: function (data) {
					// *************************************************************
					// mixed style in cell (for <b>, <i>, <u>, <del>)
					// *************************************************************
                    // console.log('data.cell.raw :::::::::::',data.cell.raw)
					 if (validaHtml(data.cell.raw) ) {
						var totRow = data.cell.text.length;
						var stileV = data.cell.styles.valign;
						var stileH = data.cell.styles.halign;
						// ****************************************************
						// font style
						// ****************************************************
											
						var fontNormal = 'Montserrat-Regular';
						var fontBold = 'Montserrat-SemiBold';
                        stilefont = fontNormal;
						// ****************************************************
						// text position
						// ****************************************************						
						var isIE = false;
						var righecalc = 0;
						var textPos = data.cell.getTextPos();
						var textPosX = textPos.x;
						var textPosY = textPos.y;						
						var cellW = data.cell.width;
						var paddH = Number(data.cell.padding('horizontal'));
						var gfs = (data.cell.styles.fontSize / data.doc.internal.scaleFactor);
						// ********************
						// workaround for ie	
						// ********************
						if (data.cell.raw.outerText) {							
							var arrH = data.cell.raw.outerText.split('\n');
							if (arrH.length > 1) {
								righecalc = arrH.length;
								isIE = true;
							}
						}
						if (isIE && righecalc != totRow) {
							if (stileV === 'middle') {
								textPosY = data.cell.y + paddH + (data.cell.height - paddH*2 - ((((righecalc )) * gfs)));
							} else if (stileV === 'bottom') {
								textPosY = data.cell.y + paddH + (data.cell.height - paddH*2 - ((((righecalc - 1)) * gfs / 2)));
							}						
						}
						// ********************
						var celltext = 0;
						var widthStringa = 0;
						var offSet = 0;
						// ****************************************************
						// cell content
						// ****************************************************
						var testoriga = '';
						var curStinga = '';
						var contenuto = data.cell.raw;
						var arr =  getArrayTagsHtmlString(contenuto);
						// in ie the <br> is ignored and row number not corrispond
						arr.forEach(function(item, idx, arr) {
							// ****************************************************
							// change font style
							// ****************************************************
							if (item.substr(0,3) === '<b>' && fontBold != '') {
								if (stilefont.indexOf(fontBold) < 0) {
									
										stilefont = fontBold;
									
								}
								stilefont = stilefont.replace(fontNormal, '');
								
							} else if(item.substr(0,4) === '</b>' && fontBold != '') {
								stilefont = stilefont.replace(fontBold, '');
								if (stilefont === '') stilefont = fontNormal
							}else if(item.substr(0,4) === '<br>') {
								// add line on <br>
								celltext = 0 ;
								textPosY += gfs;
								testoriga = '';
								curStinga = curStinga.trim();								
							}else if(item.substr(0,8) === '<&nbsp;>') {
								item = item.replace('<&nbsp;>', ' ');
							}
							item = item.substr(item.indexOf('>') + 1);
							data.doc.setFont(stilefont);
							// ****************************************************
							// verify width
							// ****************************************************
							if (item === ' ') {
								curStinga += item;
							} else {
								curStinga = decodeHTML(curStinga);
								// for space on char pre-underline
								offSet = 0;
								curStinga += item;
								nextcelltext = data.doc.getTextWidth(curStinga + "-");
								if (curStinga.trim() === '') {
									offSet = nextcelltext;
								}
								
								// if too large, new line							
								if ((celltext + nextcelltext + paddH > cellW)) {							
									celltext = 0;
									// new row text postion
									textPosY += gfs;								
									// find tot string of new row if halign center or right
									testoriga = '';
									// remove first space caracter on new line
									curStinga = curStinga.trim();
								}
								
								// if new line
								if (curStinga != '') {
									// reposition text for correct style
									if (idx === 0) {
										if (stileV === 'middle') {
											textPosY -= (((totRow - 1) / 2) * gfs);
										} else if (stileV === 'bottom') {
											textPosY -= ((totRow - 1) * gfs);
										}
									}
									
									if (celltext === 0) {									
										// Horizontal style
										if (stileH === 'center' || stileH === 'right') {
											if (idx === 0 ) {
												if (data.cell.text) {
													testoriga = data.cell.text[0];
												}												
												// ********************
												// workaround for ie
												// ********************
												if (data.cell.raw.outerText) {
													testoriga = data.cell.raw.outerText.substr(0,data.cell.raw.outerText.indexOf('\n') - 1);
													testoriga = testoriga.trim();
												}
												// ********************
											}									
											if (testoriga === '') {
												// find tot row string for correct position if center or right
												var arrc = '';
												var rigatmp = curStinga;
												for (var b = idx + 1; b < arr.length; b++) {
													arrc = arr[b];
													if(arrc.substr(0,4) != '<br>') {
														arrc = arrc.replace('<&nbsp;>',' ');
														arrc = arrc.substr(arrc.indexOf('>') + 1);
														arrc = this.decodeHTML(arrc);
														var arrd = [arrc];
															if ((data.doc.getTextWidth(rigatmp + arrc) + (paddH*2) > cellW)) {
																	break;
																} else {
																	rigatmp += arrc;
															}
													} else {
														break;
													}
												}
												testoriga = rigatmp.trim();
											}	
											
											var alignSize = gfs;
											// correct postion for left
											textPosX = data.cell.getTextPos().x;
											if (stileH === 'center') alignSize *= 0.5;									
											// find correct postion if center 
											textPosX -= data.doc.getStringUnitWidth(testoriga) * alignSize;
											if (stileH === 'right') {
												// find correct postion if right
												textPosX -= paddH;
											}
										}
									}

									// write text									
									widthStringa = data.doc.getTextWidth(curStinga);
									data.doc.autoTableText(curStinga, textPosX + celltext, textPosY, {
										//halign: stileH,
										valign: stileV,
									});
								
									
									if (((textPosX - data.cell.x) + celltext + paddH * 2 ) > cellW) {
										// reset row string
										testoriga = '';
									}
									// add text width for next text postion
									celltext += widthStringa;
									curStinga = '';
								}
							}
							
							// save actual font style
							stilefont = stilefont;	
                           				
						});						
						// reset to main cell style font
						data.doc.setFont(fontNormal);
						// delete default cell text content						
						data.cell.text = '';
                        posFinalUltimaTablaSave=posFinalUltimaTablaSave+this.doc.lastAutoTable.finalY;		
					}			
					// ************************************************************************
					
				},
               
            })
           
            //this.doc.text(usuario.nomNombreCompleto, this.margins.left+35, posFinalUltimaTablaSave);
            
            index = index + 1;
        });
            

    }
	async addContentRE(model) {
		const element = model;


		this.doc.text("Aquí va tu texto", this.margins.left + 10);
	
	}
	
    async createHeader(model) {
        const pageCount = this.doc.internal.getNumberOfPages();
        const separe = 190;
        let textoDoc = '';
        this.doc.setFont('Montserrat-Regular');
        this.doc.setFontSize(11);

        this.doc.setPage(1);
        var posY = this.margins.top;

        this.doc.setFont('Montserrat-SemiBold');
		this.doc.setTextColor(188, 149, 92);
        this.doc.text('SIICEM', this.margins.left + 22, posY+18);
        this.doc.setTextColor(65, 171, 202);
		this.doc.setFont('Montserrat-SemiBold');
        this.doc.text('  |  Sistema Informático Integral Centros de Mezclas', this.margins.left + 60, posY+18);

        this.doc.addImage(RESOURCES.base64ILogoIMSS, 'PNG', this.doc.internal.pageSize.width - separe, this.margins.top + 15, 120.5, 60.5);
        posY += 80;
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.text('No de folio ' + model.folioResolucion, this.doc.internal.pageSize.width - separe, posY+58, { align: 'left' });
        posY += 20;
        this.doc.setFont('Montserrat-Regular');
        posY += 25;
        this.doc.setFontSize(21);
        this.doc.text('Resolución de investigación de Mezcla Estéril', this.margins.left + 22, posY-55);
        posY += 30;
        this.doc.setFontSize(11);
        this.doc.text(model.fechaResolucion, this.margins.left + 22, posY-40);

        this.doc.setFontSize(135);
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.setTextColor(237, 231, 221);
        this.doc.text('SIICEM', this.margins.left + 116, posY+135);

        this.doc.setFont('Montserrat-Regular');
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFontSize(11);

        this.doc.setDrawColor(65, 171, 202);
		this.doc.line(this.margins.left + 22,posY-20,590, posY-20);
        
        posY += 50;

        textoDoc = textoDoc.concat('En la Central de mezclas del **').concat(model.desCentralMezcla).concat('**').
        concat(' se generó un Folio de investigación **').concat(model.folioInvestigacion).concat('**'). 
        concat(' , con Folio de Mezcla Estéril **').concat(model.cveFolioMezclaDosis).concat('**').
        concat(', y Fecha de la Solicitud de Investigación **').concat(model.fechaInvestigacion).concat('**').
        concat(', esto debido a una Causa atribuible por **').concat(model.desCausaAtribuible).concat('**').concat('.');
        const fontSize = 11;
        let startX = this.margins.left + 22//12;
        let startY = posY//20;

        const inputValue = textoDoc;
        const endX = 730;
        //console.log(textoDoc)
        let textMap = this.doc.splitTextToSize( inputValue,endX);
        //console.log(textMap)
        const isBoldOpen = (arrayLength, valueBefore = false) => {
            const isEven = arrayLength % 2 === 0;
            const result = valueBefore !== isEven;
            return result;
        }

        const startXCached = startX;
        let boldOpen = false;
        textMap.map((text, i) => {
            if (text) {
                const arrayOfNormalAndBoldText = text.split('**');
                const boldStr = 'Montserrat-SemiBold';
                const normalOr = 'Montserrat-Regular';
                arrayOfNormalAndBoldText.map((textItems, j) => {

                    this.doc.setFont(boldOpen ? normalOr : boldStr);
                    if (j % 2 === 0) {
                        this.doc.setFont(boldOpen ? boldStr : normalOr);
                    }
                    this.doc.text(textItems, startX, startY);
                    startX = startX + this.doc.getStringUnitWidth(textItems) * fontSize;
                });
                boldOpen = isBoldOpen(arrayOfNormalAndBoldText.length, boldOpen);
                startX = startXCached;
                startY += 15//lineSpacing;
                posY += 15
            }
        });

        /*
        this.doc.setFont('Montserrat-Regular');
        this.doc.text('En la Central de mezclas del', this.margins.left + 22, posY);
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.text(model.desCentralMezcla, this.margins.left + 22 + this.doc.getTextWidth('En la Central de mezclas del'), posY);
        this.doc.setFont('Montserrat-Regular');
        this.doc.text(' se generó un Folio de investigación', this.margins.left + 30 + this.doc.getTextWidth('En la Central de mezclas del' + model.desCentralMezcla), posY);
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.text(model.folioInvestigacion, this.margins.left + 20 + this.doc.getTextWidth('En la Central de mezclas del' + model.desCentralMezcla + ' se generó un Folio de investigación'), posY);
        this.doc.setFont('Montserrat-Regular');
        this.doc.text(', con Folio de Mezcla Estéril ', this.margins.left + 35 + this.doc.getTextWidth('En la Central de mezclas del' + model.desCentralMezcla + ' se generó un Folio de investigación' + model.folioInvestigacion), posY);
        
        posY += 15;
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.text(model.cveFolioMezclaDosis, this.margins.left + 22, posY);
        this.doc.setFont('Montserrat-Regular');
        this.doc.text(', y Fecha de la Solicitud de Investigación', this.margins.left + 25 + this.doc.getTextWidth(model.cveFolioMezclaDosis), posY);
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.text(model.fechaInvestigacion, this.margins.left + 20 + this.doc.getTextWidth(model.cveFolioMezclaDosis + ', y Fecha de la Solicitud de Investigación'), posY);
        this.doc.setFont('Montserrat-Regular');
        this.doc.text(', esto debido a una Causa atribuible por', this.margins.left + 34 + this.doc.getTextWidth(model.cveFolioMezclaDosis + ', y Fecha de la Solicitud de Investigación' + model.fechaInvestigacion), posY);
        posY += 15;
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.text(model.desCausaAtribuible + '.', this.margins.left + 22, posY);
        */
        //posY += 15;
        this.doc.setFont('Montserrat-Regular');
        this.doc.text('Tomando las siguientes Medidas correctivas: ', this.margins.left + 22, posY);
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.text(model.desMedidaCorrectiva, this.margins.left + 15 + this.doc.getTextWidth('Tomando las siguientes Medidas correctivas: '), posY);
        
        posY += 30;
        this.doc.setFont('Montserrat-Regular');
        this.doc.text('Fecha de Resolución:', this.margins.left + 22, posY);
        this.doc.setFont('Montserrat-SemiBold');
        this.doc.text(model.fechaResolucion, this.margins.left + 22 + this.doc.getTextWidth('Fecha de Resolución:'), posY);

        posY += 60;
        this.doc.setFont('Montserrat-Regular');
        this.doc.text('Observaciones:', this.margins.left + 22, posY);
        this.doc.setFont('Montserrat-SemiBold');
        console.log( this.doc.internal.pageSize.width)
        const contenidoSplit = this.doc.splitTextToSize((model.refObsResolucInvest  === null || model.refObsResolucInvest  === undefined || model.refObsResolucInvest  === '') ? '' : model.refObsResolucInvest, this.doc.internal.pageSize.width - 170);
        this.doc.text(contenidoSplit, this.margins.left + 22 + this.doc.getTextWidth('Observaciones:'), posY);
        posY += contenidoSplit.length * 5;

        return 'ok';
    }

    

    createLine(yPos,width?) {
        if(width){
            this.doc.setLineWidth(width); 
        }else{
            this.doc.setLineWidth(1.0); 
        }
        this.doc.setDrawColor(221, 221, 221);
        this.doc.line(this.margins.left, yPos, this.doc.internal.pageSize.width - this.margins.left, yPos);
    }

    async createFooter() {
        const pageCount = this.doc.internal.getNumberOfPages()
        this.doc.setFont('Montserrat-Regular')
        this.doc.setFontSize(9)
        this.doc.setTextColor(103, 103, 103);
        for (var i = 1; i <= pageCount; i++) {
            this.doc.setPage(i)
            //this.doc.text(String(i) + '/' + String(pageCount), this.doc.internal.pageSize.width / 2, this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });
    
            this.doc.text('Pag. '+String(i) + ' de ' + String(pageCount), this.doc.internal.pageSize.width-40 , this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });
        
            this.doc.addImage(RESOURCES.base64ImgFooter, 'PNG', this.margins.left, this.doc.internal.pageSize.height - (this.margins.bottom + 5), this.doc.internal.pageSize.width - (2 * this.margins.left), 8.64)
        }

        return 'ok';
    }

    
}

function validaHtml(data) {

    const etiquetas: Array<string> = [
        '<b>',
        '<br>'
    ];


    if (data == undefined || data == null) {
        return false;
    }
    if (typeof data != 'string') {
        return false;
    }
    if (data == '') {
        return false;
    }

    const found = etiquetas.filter((etiqueta) => {
        if (data.includes(etiqueta)) {
            return etiqueta;
        }

    });

    return found.length > 0;
}

function getArrayTagsHtmlString(str){
    // replace new line and tab to nothing
    str = str.replace(/(?:\r\n|\r|\n|\t)/g, '');
    str = str.replace(/<b>/gi, ':bb:');
    str = str.replace(/<\/b>/gi, ':/bb:');
    str = str.replace(/<i>/gi, ':ii:');
    str = str.replace(/<\/i>/gi, ':/ii:');
    str = str.replace(/<u>/gi, ':uu:');
    str = str.replace(/<\/u>/gi, ':/uu:');
    str = str.replace(/<del>/gi, ':ddd:');
    str = str.replace(/<\/del>/gi, ':/ddd:');
    str = str.replace(/<br>/gi, ':br:');
    str = str.replace(/<[^>]*>/g, '');
    str = str.replace(/:bb:/g, '<b>');
    str = str.replace(/:ii:/g, '<i>');	
    str = str.replace(/:\/bb:/g, '</b>');
    str = str.replace(/:\/ii:/g, '</i>');
    str = str.replace(/:uu:/g, '<u>');
    str = str.replace(/:\/uu:/g, '</u>');
    str = str.replace(/:ddd:/g, '<del>');
    str = str.replace(/:\/ddd:/g, '</del>');
    str = str.replace(/:br:/g, '<br>');
    str = str.replace(/<\/b><b>/g, '');
    str = str.replace(/<\/i><i>/g, '');	
    str = str.replace(/<\/u><u>/g, '');	
    str = str.replace(/<\/del><del>/g, '');
    str = str.replace(/ /g, '<&nbsp;>');	
    let htmlSplit = str.split('<');
    let arrayElements = [];
    let nodeElement = '';
    if (htmlSplit[0] != '') {
        arrayElements.push(htmlSplit[0]);
    }
     for (var i = 1; i < htmlSplit.length; i++) {	
        nodeElement = "<" + htmlSplit[i];
        arrayElements.push(nodeElement);
     }
    return arrayElements;
  }
  
  function decodeHTML(str) {
    str = str.replace('&amp;', '&');
    str = str.replace('&lt;', '<');
    str = str.replace('&gt;', '>');
    str = str.replace('&quot;', '"');
    str = str.replace('&apos;', '\'');
    str = str.replace('&amp;', '&');
    str = str.replace('&nbsp;', ' ');
  return str;
}
