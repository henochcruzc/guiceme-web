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
export class ReporteMezclasAprobada {


	// FONT_SIZE_TITULO = 6;
	// FONT_SIZE_BARRAS = 4.3;
	// FONT_SIZE_PACIENTE = 5;
	// FONT_SIZE_MEZCLA_TITULO = 6;
	// FONT_SIZE_MEZCLA = 5;
	// FONT_SIZE_MEDICAMENTO_TITULO = 5;
	// FONT_SIZE_MEDICAMENTO = 4;
	// FONT_SIZE_FOOTER = 4;
	// FONT_SIZE_GLOBAL = 4;


	FONT_SIZE_TITULO = 6;
	FONT_SIZE_BARRAS = 4.3;
	FONT_SIZE_PACIENTE = 4.3;
	FONT_SIZE_MEZCLA_TITULO = 5.5;
	FONT_SIZE_MEZCLA = 4.5;
	FONT_SIZE_MEDICAMENTO_TITULO = 5;
	FONT_SIZE_MEDICAMENTO = 4;
	FONT_SIZE_FOOTER = 4;

	LINE_SPACING = 0.061;

	PY_PACIENTE = 0.10
	PY_MEZCLA = 0.37
	PY_MEDICAMENTO = 0.60


	constructor(private reporteMezclasAService: ReporteMezclasAprobadasDataService, private spinner: NgxSpinnerService) {
		this._memoriaDataSubject = new BehaviorSubject(null);
		this._memoriaDataSubject.subscribe(val => {
			this.memoriaData = val;
		})
	}

	FONT_SIZE_BODY_PDF = 9;
	FONT_SIZE_LIST_MEZCLAS = 12;
	bulletPoint = '\u2022 ';

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

	async prepareDataRE() {

		(await this.reporteMezclasAService.getData()).toPromise().then(
			data => {
				this.memoriaData = data;

			}
		);

	}


	async preparePdf() {
		this.doc = new jsPDF('l', 'pt', 'letter')

		this.doc.addFileToVFS("Montserrat-Regular-normal.ttf", RESOURCES.montserratRegular);
		this.doc.addFileToVFS("Montserrat-SemiBold-normal.ttf", RESOURCES.monserratSemiBold);
		this.doc.addFont("Montserrat-Regular-normal.ttf", "Montserrat-Regular", "normal");
		this.doc.addFont("Montserrat-SemiBold-normal.ttf", "Montserrat-SemiBold", "normal");

	}
	async preparePdfRecepcionUM() {
		this.doc = new jsPDF('p', 'pt', 'a4');

		this.doc.addFileToVFS("Montserrat-Regular-normal.ttf", RESOURCES.montserratRegular);
		this.doc.addFileToVFS("Montserrat-SemiBold-normal.ttf", RESOURCES.monserratSemiBold);
		this.doc.addFont("Montserrat-Regular-normal.ttf", "Montserrat-Regular", "normal");
		this.doc.addFont("Montserrat-SemiBold-normal.ttf", "Montserrat-SemiBold", "normal");

	}

	async preparePdfEtiqueta() {
		this.doc = new jsPDF('p', 'pt', 'letter');

		this.doc.addFileToVFS("Montserrat-Regular-normal.ttf", RESOURCES.montserratRegular);
		this.doc.addFileToVFS("Montserrat-SemiBold-normal.ttf", RESOURCES.monserratSemiBold);
		this.doc.addFont("Montserrat-Regular-normal.ttf", "Montserrat-Regular", "normal");
		this.doc.addFont("Montserrat-SemiBold-normal.ttf", "Montserrat-SemiBold", "normal");

	}

	async preparePdfEtiquetaFormato() {

		this.doc = new jsPDF('l', 'in', [4, 2]);
		this.doc.addFileToVFS("Montserrat-Regular-normal.ttf", RESOURCES.robotoRegular); // La referencia se deja pero la fuente es Roboto
		this.doc.addFileToVFS("Montserrat-SemiBold-normal.ttf", RESOURCES.robotoSemiBold); // Igual la referencia se deja pero la fuente es Roboto
		this.doc.addFont("Montserrat-Regular-normal.ttf", "Montserrat-Regular", "normal");
		this.doc.addFont("Montserrat-SemiBold-normal.ttf", "Montserrat-SemiBold", "normal");
	}


	async createRecepcionUM(dataReporte): Promise<any> {

		await this.prepareData().then(async r => {
			this.preparePdfRecepcionUM().then(async re => {
				this.addContentHTMLRecepcionUM(dataReporte).then(async resp => {
					this.createHeaderRecepcionUM(dataReporte).then(async resp => {
						this.createFooterRecepcionUM().then(resp => {

							let nomDocumento = "Orden_Rechazo.pdf"
							// Open PDF document in new tab
							this.doc.setProperties({
								title: nomDocumento
							})
							this.doc.output('dataurlnewwindow', "Orden_Rechazo.pdf")
							// Download PDF document                           
							this.doc.save(nomDocumento);

						})
					});
				})
			})
		})
	}

	async createRecepcionUMOrden(dataReporte): Promise<any> {

		await this.prepareData().then(async r => {
			this.preparePdfRecepcionUM().then(async re => {
				this.addContentHTMLRecepcionUMOrden(dataReporte).then(async resp => {
					this.createHeaderRecepcionUMOrden(dataReporte).then(async resp => {
						this.createFooterRecepcionUMOrden().then(resp => {

							let nomDocumento = "Orden_Envio.pdf";// "OrdenEntregaRecepcion.pdf"
							this.doc.setProperties({
								title: nomDocumento
							})
							// Open PDF document in new tab
							this.doc.output('dataurlnewwindow', "Orden_Envio.pdf")
							// Download PDF document                           
							this.doc.save(nomDocumento);
						})
					});
				})
			})
		})
	}

	async createEtiquetaFormato(dataReporte): Promise<any> {//formato de 4x3 pulgadas

		await this.prepareData().then(async r => {
			this.preparePdfEtiquetaFormato().then(async re => {
				//this.addContentHTMLRecepcionUMOrden(dataReporte).then(async resp => {
				// this.createHeaderEtiquetaFormato(dataReporte).then(async resp => {
				this.generarEtiquetaFormato(dataReporte).then(async resp => {
					this.createFooterEtiquetaFormato(dataReporte).then(resp => {

						let nomDocumento = "EtiquetaMezcla.pdf"
						this.doc.setProperties({
							title: "EtiquetaMezcla"
						})
						// Open PDF document in new tab
						this.doc.output('dataurlnewwindow')
						// Download PDF document                           
						this.doc.save(nomDocumento);
					})
				});
				//})
			})
		})
	}

	async createEtiquetaFormatoNTP(dataReporte): Promise<any> {//formato de 4x3 pulgadas

		await this.prepareData().then(async r => {
			this.preparePdfEtiquetaFormato().then(async re => {
				//this.addContentHTMLRecepcionUMOrden(dataReporte).then(async resp => {
				this.createHeaderEtiquetaFormatoNTP(dataReporte).then(async resp => {
					this.createFooterEtiquetaFormatoNPT(dataReporte).then(resp => {

						let nomDocumento = "EtiquetaMezcla.pdf"
						this.doc.setProperties({
							title: "EtiquetaMezcla"
						})
						// Open PDF document in new tab
						this.doc.output('dataurlnewwindow')
						// Download PDF document                           
						this.doc.save(nomDocumento);
					})
				});
				//})
			})
		})
	}
	/*async createEtiqueta(dataReporte): Promise<any> {
	    
		await this.prepareData().then(async r => {
			this.preparePdfEtiqueta().then(async re => {
				//this.addContentHTMLRecepcionUMOrden(dataReporte).then(async resp => {
					this.createHeaderEtiqueta(dataReporte).then(async resp => {
						this.createFooterEtiqueta(dataReporte).then(resp => {

						let nomDocumento = "EtiquetaMezcla.pdf"
						this.doc.setProperties({
							title: "EtiquetaMezcla"
						})
						// Open PDF document in new tab
						this.doc.output('dataurlnewwindow')
						// Download PDF document                           
						this.doc.save(nomDocumento);
						})
					});
				//})
			})
		})
	}*/

	/*async createEtiquetaNTP(dataReporte): Promise<any> {
	    
		await this.prepareData().then(async r => {
			this.preparePdfEtiqueta().then(async re => {
				//this.addContentHTMLRecepcionUMOrden(dataReporte).then(async resp => {
					this.createHeaderEtiquetaNTP(dataReporte).then(async resp => {
						this.createFooterEtiquetaNTP(dataReporte).then(resp => {

						let nomDocumento = "EtiquetaMezcla.pdf"
						this.doc.setProperties({
							title: "EtiquetaMezcla"
						})
						// Open PDF document in new tab
						this.doc.output('dataurlnewwindow')
						// Download PDF document                           
						this.doc.save(nomDocumento);
						})
					});
				//})
			})
		})
	}*/

	// async createFooterEtiquetaFormato(data) {
	// 	let posy = 25;
	// 	const pageCount = this.doc.internal.getNumberOfPages()
	// 	this.doc.setFont('Montserrat-Regular')
	// 	this.doc.setFontSize(5)
	// 	this.doc.setTextColor(103, 103, 103);
	// 	for (var i = 1; i <= pageCount; i++) {
	// 		let x = 196;
	// 		const separe = 55;

	// 		this.doc.setDrawColor(65, 171, 202);
	// 		this.doc.setLineWidth(0.8);
	// 		this.doc.rect(this.doc.internal.pageSize.width - 281, this.doc.internal.pageSize.height - posy, 273, 19, 'S');
	// 		// this.doc.line(this.doc.internal.pageSize.width - 281, this.doc.internal.pageSize.height - posy, 280, this.doc.internal.pageSize.height - posy);

	// 		if (data?.requisitoConservacion) {
	// 			for (let index = 0; index < data.requisitoConservacion.length; index++) {
	// 				this.doc.setFontSize(4);
	// 				this.doc.setFont('Montserrat-Regular');
	// 				this.doc.setTextColor(0, 0, 0);
	// 				this.doc.text(this.bulletPoint + data?.requisitoConservacion[index], this.doc.internal.pageSize.width - 279, x);
	// 				x += 4
	// 			}
	// 		}

	// 		// x = 204
	// 		this.doc.setPage(i)
	// 		// this.doc.setFontSize(4);
	// 		// this.doc.setFont('Montserrat-Regular');
	// 		// this.doc.setTextColor(0, 0, 0);
	// 		// this.doc.text(data.direccion , separe, x);
	// 		// x += 5;
	// 		// this.doc.setTextColor(0, 0, 0);
	// 		// this.doc.text(data.cons.param1 , 80, x);
	// 		// x += 5;
	// 		// this.doc.setTextColor(0, 0, 0);
	// 		// this.doc.text(data.cons.param2 , 90, x);
	// 	}

	// 	return 'ok';
	// }

	private async createFooterEtiquetaFormato(data: any, isNPT: boolean = false) {
		const doc = this.doc;
		const width = doc.internal.pageSize.width;
		const height = doc.internal.pageSize.height;

		const px = (p: number) => width * p;
		const py = (p: number) => height * p;

		const boxHeight = py(0.11);
		const boxY = height - boxHeight - py(0.01);
		const boxX = px(0.01);
		const boxWidth = width - px(0.03);

		const bullet = this.bulletPoint ?? '•';

		const pageCount = doc.internal.getNumberOfPages();

		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(this.FONT_SIZE_FOOTER);
			doc.text(`RECOMENDACIONES`, boxX + px(0.35), boxY - py(0.017));


			// doc.setDrawColor(65, 171, 202);
			// doc.setDrawColor(0, 0, 0);
			// doc.setLineWidth(0.008);
			// doc.rect(boxX, boxY, boxWidth, boxHeight, 'S');

			this.doc.setDrawColor(0, 0, 0);
			this.doc.setLineWidth(0.01);
			this.doc.line(px(0.01), (boxY - .08) + py(0.03), px(0.83), (boxY - .08) + py(0.03));

			if (data?.requisitoConservacion?.length) {
				let posY = boxY + py(0.025);
				const textX = boxX + px(0.01);
				doc.setFont('Montserrat-Regular');
				doc.setTextColor(0, 0, 0);

				for (const requisito of data.requisitoConservacion) {
					doc.text(`${bullet} ${requisito}`, textX, posY);
					posY += py(0.026);
				}
			}
		}

		return 'ok';
	}


	async createFooterEtiquetaFormatoNPT(data) {
		let posy = 25;

		const pageCount = this.doc.internal.getNumberOfPages() //hcc
		this.doc.setFont('Montserrat-Regular')
		this.doc.setFontSize(5)
		this.doc.setTextColor(103, 103, 103);
		for (var i = 1; i <= pageCount; i++) {
			let x = 196;
			const separe = 55;

			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.rect(this.doc.internal.pageSize.width - 281, this.doc.internal.pageSize.height - posy, 273, 19, 'S');
			// this.doc.line(this.doc.internal.pageSize.width - 281, this.doc.internal.pageSize.height - posy, 280, this.doc.internal.pageSize.height - posy);

			if (data?.requisitoConservacion) {
				for (let index = 0; index < data.requisitoConservacion.length; index++) {
					this.doc.setFontSize(4);
					this.doc.setFont('Montserrat-Regular');
					this.doc.setTextColor(0, 0, 0);
					this.doc.text(this.bulletPoint + data.requisitoConservacion[index], this.doc.internal.pageSize.width - 279, x);
					x += 4
				}
			}



			// x = 204
			this.doc.setPage(i)
			// this.doc.setFontSize(4);
			// this.doc.setFont('Montserrat-Regular');
			// this.doc.setTextColor(0, 0, 0);
			// this.doc.text(data.direccion, separe, x);
			// x += 5;
			// this.doc.setTextColor(0, 0, 0);
			// this.doc.text(data.cons.param1, 80, x);
			// x += 5;
			// this.doc.setTextColor(0, 0, 0);
			// this.doc.text(data.cons.param2, 90, x);
		}

		return 'ok';
	}

	async createFooterEtiqueta(data) {
		const pageCount = this.doc.internal.getNumberOfPages()
		this.doc.setFont('Montserrat-Regular')
		this.doc.setFontSize(9)
		this.doc.setTextColor(103, 103, 103);
		const separe = 500;
		let x = 130;

		//let textX = (this.doc.internal.pageSize.getWidth() - this.doc.getTextWidth('Calle Primera, No.500-B Colonia Maclovio Herrera C.P.21482, Municipio Tecate,Baja California'))/2

		for (var i = 1; i <= pageCount; i++) {

			this.doc.setPage(i)
			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - 580, this.doc.internal.pageSize.height - 155, 575, this.doc.internal.pageSize.height - 155);

			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setFontSize(45);
			this.doc.setTextColor(212, 232, 237);
			//this.doc.setFillColor(212,232,237,0.9);
			this.doc.text('Centro de Mezclas', this.doc.internal.pageSize.width - 515, 680, { align: 'left' });

			var posY = this.margins.top;
			//this.doc.setPage(i)
			//this.doc.setFont('Montserrat-Regular');
			//this.doc.setFontSize(11);
			//this.doc.setTextColor(0, 0, 0);
			//this.doc.text('Elaborado por:',  this.doc.internal.pageSize.width - separe, 710, { align: 'left' });



			//x -= 15;
			//this.doc.setFont('Montserrat-SemiBold');
			//this.doc.setFontSize(10);
			//this.doc.setTextColor(0, 0, 0);
			//this.doc.text(data.elabora,  this.doc.internal.pageSize.width - separe, 725, { align: 'left' });
			x -= 15;
			this.doc.addImage(data.codigoBarra, 'PNG', this.doc.internal.pageSize.width - separe, 684, 406.5, 36.5)
			x -= 46;
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.textoCodigo, this.doc.internal.pageSize.width - 360, 729);
			x -= 10;

			this.doc.setFont('Montserrat-Regular');
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.direccion, this.doc.internal.pageSize.width - 535, 741);
			//this.doc.text('Calle Primera, No.500-B Colonia Maclovio Herrera C.P.21482, Municipio Tecate,Baja California de texcoco cuautlalpan', textX, 797);
			x -= 10;
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.cons.param1, this.doc.internal.pageSize.width - 430, 755);
			x -= 10;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.cons.param2, this.doc.internal.pageSize.width - 410, 767);

		}

		return 'ok';
	}


	async createFooterEtiquetaNTP(data) {
		const pageCount = this.doc.internal.getNumberOfPages()
		this.doc.setFont('Montserrat-Regular')
		this.doc.setFontSize(9)
		this.doc.setTextColor(103, 103, 103);
		const separe = 500;
		//const separeY = 12;
		let x = 130;

		for (var i = 1; i <= pageCount; i++) {

			this.doc.setPage(i)
			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - 580, this.doc.internal.pageSize.height - 203, 580, this.doc.internal.pageSize.height - 203);


			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - 580, this.doc.internal.pageSize.height - 138, 580, this.doc.internal.pageSize.height - 138);

			var posY = this.margins.top;
			//this.doc.setPage(i)
			this.doc.setFont('Montserrat-Regular')
			this.doc.setFontSize(9);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Osmolaridad Calc:', this.doc.internal.pageSize.width - 520, 600, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.osmolaridad, this.doc.internal.pageSize.width - 390, 600, { align: 'left' });

			this.doc.setTextColor(0, 0, 0);
			this.doc.text('KCal No Proteicas:', this.doc.internal.pageSize.width - 520, 612, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.kcalNoProt, this.doc.internal.pageSize.width - 390, 612, { align: 'left' });

			this.doc.setTextColor(0, 0, 0);
			this.doc.text('KCal Totales:', this.doc.internal.pageSize.width - 520, 624, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.kcalTotal, this.doc.internal.pageSize.width - 390, 624, { align: 'left' });

			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Nitrógeno:', this.doc.internal.pageSize.width - 520, 636, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.nitrogeno, this.doc.internal.pageSize.width - 390, 636, { align: 'left' });

			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Volumen total:', this.doc.internal.pageSize.width - 270, 600, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.volTotal, this.doc.internal.pageSize.width - 160, 600, { align: 'left' });

			this.doc.setFont('Montserrat-Regular')
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Vel.Infusión:', this.doc.internal.pageSize.width - 270, 612, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.velInfu, this.doc.internal.pageSize.width - 160, 612, { align: 'left' });

			this.doc.setTextColor(0, 0, 0);
			this.doc.text('F.Prep:', this.doc.internal.pageSize.width - 270, 624, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.fPrep, this.doc.internal.pageSize.width - 160, 624, { align: 'left' });

			this.doc.setTextColor(0, 0, 0);
			this.doc.text('F.Cad.Amb:', this.doc.internal.pageSize.width - 270, 636, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.fAmb, this.doc.internal.pageSize.width - 160, 636, { align: 'left' });

			this.doc.setTextColor(0, 0, 0);
			this.doc.text('F.Cad.Ref:', this.doc.internal.pageSize.width - 270, 648, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.nptMezcla.fFria, this.doc.internal.pageSize.width - 160, 648, { align: 'left' });

			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setFontSize(45);
			this.doc.setTextColor(212, 232, 237);
			//this.doc.setFillColor(212,232,237,0.9);
			this.doc.text('Centro de Mezclas', this.doc.internal.pageSize.width - 515, 695, { align: 'left' });

			x -= 15;
			this.doc.addImage(data.codigoBarra, 'PNG', this.doc.internal.pageSize.width - separe, 699, 406.5, 36.5)
			x -= 46;
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.textoCodigo, this.doc.internal.pageSize.width - 360, 744);
			x -= 10;
			this.doc.setFont('Montserrat-Regular');
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.direccion, this.doc.internal.pageSize.width - 535, 755);
			x -= 10;
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.cons.param1, this.doc.internal.pageSize.width - 398, 768);
			x -= 10;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(data.cons.param2, this.doc.internal.pageSize.width - 370, 780);

		}

		return 'ok';
	}




	async createHeaderEtiquetaNTP(dataEtiqueta) {

		for (let index = 0; index < dataEtiqueta.paciente.length; index++) {



			const separe = 583;
			this.doc.setFont('Montserrat-Regular')
			this.doc.setFontSize(11);
			var posY = this.margins.top;

			posY += 10;
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setTextColor(188, 149, 92);
			this.doc.text('SIICEM', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(65, 171, 202);
			this.doc.setFont('Montserrat-Regular')
			this.doc.text('|', this.doc.internal.pageSize.width - 540, posY, { align: 'left' });
			//posY += 10;
			this.doc.setTextColor(65, 171, 202);
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.text('Sistema Informático Integral Centros de Mezclas', this.doc.internal.pageSize.width - 534, posY, { align: 'left' });
			this.doc.addImage(RESOURCES.base64ILogoIMSS, 'PNG', this.margins.left + 400, this.margins.top + 40, 120.5, 60.5)
			posY += 10;
			//this.createLine(posY);
			this.doc.setFont('Montserrat-Regular')
			this.doc.setFontSize(10);
			posY += 10;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Paciente:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setFontSize(9);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].nombre, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de nacimiento:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].fechaNac, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Edad:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].edad, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Peso:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].peso, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Piso:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].piso, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Cama:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].cama, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('NSS:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].nss, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Agregado médico:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].agregado, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Servicio:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].servicio, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Unidad médica:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.paciente[0].unidad, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - separe, posY + 8, 550, posY + 8);

			posY += 25;
			this.doc.setFontSize(13);
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.text(dataEtiqueta.tipoMezcla, this.doc.internal.pageSize.width - separe, posY, { align: 'left' });

			posY += 20;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFont('Montserrat-Regular');
			this.doc.text('Via de administración:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.mezcla[0].via, this.doc.internal.pageSize.width - 305, posY, { align: 'left' });


			posY += 13;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Velocidad de infusión (ml/hrs):', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.mezcla[0].velocidad, this.doc.internal.pageSize.width - 305, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de preparación:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.mezcla[0].fPrepa, this.doc.internal.pageSize.width - 305, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de caducidad ambiente:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.mezcla[0].ambiente, this.doc.internal.pageSize.width - 305, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de caducidad red fría:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.mezcla[0].fria, this.doc.internal.pageSize.width - 305, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Nombre del preparador de la mezcla:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.mezcla[0].usuario, this.doc.internal.pageSize.width - 305, posY, { align: 'left' });

			posY += 12;
			this.doc.setFontSize(10);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Folio de la mezcla:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFontSize(9);
			this.doc.text(dataEtiqueta.mezcla[0].folio, this.doc.internal.pageSize.width - 305, posY, { align: 'left' });

			posY += 10;
			this.doc.setFontSize(12);
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFont('Montserrat-SemiBold');



			this.doc.autoTable({
				html: '#medicamentosEtiquetaNTPPruebaCambio',
				startY: posY,
				theme: 'grid',
				showHead: 'everyPage',
				columnWidth: 20,
				margin: {
					//top: 130,
					right: 30,
					bottom: 200,
					left: 30,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: 10,
					font: 'Montserrat-Regular',
					lineWidth: .1,
					lineColor: 255,
					cellPadding: { top: 0, right: 2, bottom: 3, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0],
					tableLineColor: 0,
				},
				headStyles: {
					minCellHeight: 1,
					fontSize: 11,
					font: 'Montserrat-SemiBold',
					fillColor: [255, 255, 255],
					cellPadding: { top: 0, right: 5, bottom: 10, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},


				columnStyles: {
					0: {
						//halign: 'center',
						tableWidth: 100,

					},
					1: {
						//halign: 'center',
						tableWidth: 100,
					},
					2: {
						//halign: 'center',
						tableWidth: 100,
					},
					3: {
						//halign: 'center',
						tableWidth: 100,
					}
					,
					4: {
						//halign: 'center',
						tableWidth: 100,
					}
					,
					5: {
						//halign: 'center',
						tableWidth: 100,
					},

					6: {
						//halign: 'center',
						tableWidth: 100,
					},

					7: {
						//halign: 'center',
						tableWidth: 100,
					},

					8: {
						//halign: 'center',
						tableWidth: 100,
					},
					9: {
						//halign: 'center',
						tableWidth: 100,
					}
				},


			})



			this.doc.autoTable({
				html: '#diluyentesEtiquetaNTP',
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				showHead: 'everyPage',
				margin: {
					//top: 130,
					right: 30,
					bottom: 200,
					left: 30,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: 10,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 255,
					cellPadding: { top: 0, right: 0, bottom: 2, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: 11,
					font: 'Montserrat-SemiBold',
					fillColor: [255, 255, 255],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},

				columnStyles: {
					0: {
						halign: 'left',
						tableWidth: 100,
					},
					1: {
						halign: 'left',

						tableWidth: 100,
					},
					2: {
						halign: 'left',
						tableWidth: 100,
					},
					3: {
						halign: 'left',
						tableWidth: 100,
					},
					4: {
						halign: 'left',
						tableWidth: 100,
					}
					, 5: {
						halign: 'left',
						tableWidth: 100,
					}
				},


			})


			if (index + 1 == dataEtiqueta.paciente.length)
				break;
			this.doc.addPage();
		}
		return 'ok';
	}

	async generarEtiquetaFormato(dataEtiqueta: any): Promise<string> {
		this.preparePdfEtiquetaFormato(); // Crea el doc con pulgadas, carga fuentes, etc.
		console.log('dataEtiqueta', dataEtiqueta);
		for (let i = 0; i < dataEtiqueta.paciente.length; i++) {

			this.createHeaderEtiquetaFormatoPorcentual(dataEtiqueta);

			this.drawPacienteInfoPorcentual(dataEtiqueta.paciente[i]);

			this.drawMezclaInfoPorcentual(dataEtiqueta.mezcla[i], dataEtiqueta);

			this.drawTablasEtiqueta(dataEtiqueta.medicamento, dataEtiqueta.diluyente);

			if (i < dataEtiqueta.paciente.length - 1) {
				this.doc.addPage();
			}
		}

		return 'ok';
	}

	private async createHeaderEtiquetaFormatoPorcentual(dataEtiqueta) {
		const doc = this.doc;
		const width = doc.internal.pageSize.width;
		const height = doc.internal.pageSize.height;

		const px = (percent: number) => width * percent;
		const py = (percent: number) => height * percent;

		doc.setFont('Montserrat-SemiBold');
		doc.setFontSize(this.FONT_SIZE_TITULO);
		doc.setTextColor(0, 0, 0);
		doc.text('SIICEM', px(0.01), py(0.06));
		doc.text(
			'Sistema Informático Integral Centros de Mezclas',
			px(0.11),
			py(0.06)
		);

		// Logo IMSS
		doc.addImage(
			RESOURCES.base64ILogoIMSS,
			'PNG',
			px(0.73),
			py(0.03),
			px(0.13),
			py(0.15)
		);

		// Código de barras
		const barcodeX = px(0.92);
		const barcodeY = py(0.90);
		const barcodeWidth = px(0.55);
		const barcodeHeight = py(0.15);

		doc.addImage(
			dataEtiqueta.codigoBarra,
			'PNG',
			barcodeX,
			barcodeY,
			barcodeWidth,
			barcodeHeight,
			null,
			null,
			90
		);
		doc.setFontSize(6);
		doc.text(
			dataEtiqueta.textoCodigo,
			px(0.94),
			py(0.75),
			{ angle: 90 }
		);

		doc.setFontSize(this.FONT_SIZE_BARRAS);
		doc.setFont('Montserrat-Regular');
		const splitTitle = doc.splitTextToSize(dataEtiqueta.direccion, px(0.30));
		const baseX = px(0.96);
		const baseY = py(1.60);

		splitTitle.forEach((linea, index) => {
			const offsetX = baseX + px(index * 0.015);
			const textWidth = doc.getTextWidth(linea);
			const offsetY = baseY - ((px(1.1) - textWidth) / 2);
			doc.text(linea, offsetX, offsetY, null, 90);
		});

	}

	private async drawPacienteInfoPorcentual(dataPaciente: any) {
		const doc = this.doc;
		const width = doc.internal.pageSize.width;
		const height = doc.internal.pageSize.height;

		const px = (p: number) => width * p;
		const py = (p: number) => height * p;

		const col1X = px(0.01);
		const col2X = px(0.50);
		let posY1 = py(this.PY_PACIENTE);
		let posY2 = py(this.PY_PACIENTE);

		doc.setFontSize(this.FONT_SIZE_PACIENTE);
		doc.setTextColor(0, 0, 0);

		const col1Campos = [
			['Paciente', dataPaciente.nombre],
			['Fecha de nacimiento', dataPaciente.fechaNac],
			['Edad', dataPaciente.edad],
			['Peso', dataPaciente.peso],
			['Unidad médica', dataPaciente.unidad],
			['Servicio', dataPaciente.servicio],
			['Nombre del médico', dataPaciente.nomMedico],//'dsadasdasd asasdasd asd asd asd'],
			['Diagnóstico', dataPaciente.diagnostico], //'J440 - 
		];

		const col2Campos = [
			// ['Nombre del médico', dataPaciente.nomMedico],//'dsadasdasd asasdasd asd asd asd'],
			// ['Diagnóstico', dataPaciente.diagnostico], //'J440 - Enfermedad pulmonar obstructiva crónica con infección aguda de las vías respiratorias inferiores'],
			['Piso', dataPaciente.piso],
			['Cama', dataPaciente.cama],
			['NSS', dataPaciente.nss],
			['Agregado médico', dataPaciente.agregado]
		];

		const drawCampo = (x: number, y: number, label: string, value: string) => {
			doc.setFont('Montserrat-SemiBold');
			doc.text(`${label}:`, x, y);
			const labelWidth = doc.getTextWidth(`${label}: `);
			doc.setFont('Montserrat-Regular');
			doc.text(value, x + labelWidth + px(0.005), y);
		};

		col1Campos.forEach(([label, value]) => {
			drawCampo(col1X, posY1, label, value);
			posY1 += this.LINE_SPACING;
		});



		col2Campos.forEach(([label, value]) => {
			drawCampo(col2X, posY2, label, value);
			posY2 += this.LINE_SPACING;
		});

		// this.doc.setDrawColor(65, 171, 202);
		this.doc.setDrawColor(0, 0, 0);
		this.doc.setLineWidth(0.01);
		this.doc.line(px(0.01), posY1 - 0.02, px(0.83), posY1 - 0.02);

	}

	private async drawMezclaInfoPorcentual(dataMezcla: any, dataEtiqueta: any) {
		const doc = this.doc;
		const width = doc.internal.pageSize.width;
		const height = doc.internal.pageSize.height;

		const px = (p: number) => width * p;
		const py = (p: number) => height * p;

		const col1X = px(0.01);
		const col2X = px(0.55);
		const posYTitulo = py(this.PY_MEZCLA);

		let posY1 = py(this.PY_MEZCLA + 0.04);
		let posY2 = py(this.PY_MEZCLA + 0.10);
		doc.setFontSize(this.FONT_SIZE_MEZCLA_TITULO);
		doc.setFont('Montserrat-SemiBold');
		doc.setTextColor(0, 0, 0);
		doc.text(dataEtiqueta.tipoMezcla, col1X, posYTitulo);

		doc.setFontSize(this.FONT_SIZE_MEZCLA);
		doc.setTextColor(0, 0, 0);

		const col1Campos = [
			['Vía de administración', dataMezcla.via],
			['Preparador de la mezcla', dataMezcla.usuario],
			['Fecha de preparación', dataMezcla.fPrepa],
			['Fecha de caducidad ambiente', dataMezcla.ambiente],
			['Fecha de caducidad red fría', dataMezcla.fria],
			//   ['Folio de la mezcla', dataMezcla.folio],
		];

		const col2Campos = [
			['Temp Estab amb', dataMezcla.tempEstabAmb ?? ''],
			['Temp Estab fría', dataMezcla.tempEstabFria ?? ''],
			['Vel. Infusión', dataMezcla.velocidad ?? ''],
		];

		col1Campos.forEach(([label, value]) => {
			if (value && (typeof value === 'string' && value.trim().length > 0)) {
				doc.setFont('Montserrat-SemiBold');
				doc.text(`${label}:`, col1X, posY1);
				const labelWidth = doc.getTextWidth(`${label}: `);
				doc.setFont('Montserrat-Regular');
				doc.text(value, col1X + labelWidth + px(0.005), posY1);
				posY1 += this.LINE_SPACING;
			}
		});



		col2Campos.forEach(([label, value]) => {
			if (value && (typeof value === 'string' && value.trim().length > 0)) {
				doc.setFont('Montserrat-SemiBold');
				doc.text(`${label}:`, col2X, posY2);
				const labelWidth = doc.getTextWidth(`${label}: `);
				doc.setFont('Montserrat-Regular');
				doc.text(value, col2X + labelWidth + px(0.005), posY2);
				posY2 += this.LINE_SPACING;
			}
		});

		doc.setDrawColor(6, 171, 202);
		doc.setDrawColor(0, 0, 0);
		doc.setLineWidth(0.01);
		const lineY = posY1 + py(0.01);
		doc.line(px(0.01), lineY - 0.02, px(0.83), lineY - 0.02);
	}


	private async drawTablasEtiqueta(medicamentos: any[], diluyentes: any[]) {
		const doc = this.doc;
		const width = doc.internal.pageSize.width;
		const height = doc.internal.pageSize.height;

		const px = (p: number) => width * p;
		const py = (p: number) => height * p;

		let posY = py(this.PY_MEDICAMENTO);

		const drawSection = (titulo: string, elementos: any[]) => {
			// Título de sección
			doc.setFont('Montserrat-SemiBold');
			doc.setFontSize(this.FONT_SIZE_MEDICAMENTO_TITULO);
			doc.setTextColor(0, 0, 0);
			doc.text(titulo, px(0.01), posY);
			posY += py(0.04);

			doc.setFont('Montserrat-Regular');
			doc.setFontSize(this.FONT_SIZE_MEDICAMENTO);

			elementos.forEach(el => {
				const descripcion = el.descripcion ?? '';
				if (descripcion.trim()) {
					doc.text(`${descripcion}`, px(0.015), posY);
					posY += py(0.015);
				}
			});

			posY += py(0.03);
		};

		if (medicamentos?.length) {
			//drawSection('Lista de medicamentos que componen la mezcla:', medicamentos);
			drawSection('Mezcla medicamentosa, lista de componentes:', medicamentos);
		}

		if (diluyentes?.length) {
			drawSection('Diluyente', diluyentes);
		}
	}

	// async createHeaderEtiquetaFormato(dataEtiqueta) {

	// 	for (let index = 0; index < dataEtiqueta.paciente.length; index++) {

	// 		const separe = 281;
	// 		this.doc.setFont('Montserrat-Regular')
	// 		this.doc.setFontSize(5);

	// 		//console.log('dataReporteIn', dataEtiqueta)
	// 		var w = 220;
	// 		var wm = 180;
	// 		var posY = 0//this.margins.top;

	// 		posY += 9;
	// 		this.doc.setFont('Montserrat-SemiBold');
	// 		this.doc.setTextColor(188, 149, 92);
	// 		this.doc.text('SIICEM', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(65, 171, 202);
	// 		this.doc.text('Sistema Informático Integral Centros de Mezclas', this.doc.internal.pageSize.width - 255, posY, { align: 'left' });

	// 		// this.doc.addImage(RESOURCES.base64ILogoIMSS, 'PNG', this.doc.internal.pageSize.width - 90, posY + 12, 50.5, 25.5)
	// 		// this.doc.addImage(dataEtiqueta.codigoBarra, 'PNG', this.doc.internal.pageSize.width - 20, posY + 69, 95.5, 25.5, null, null, 90)
	// 		// this.doc.setTextColor(0, 0, 0);
	// 		// this.doc.text(dataEtiqueta.textoCodigo, this.doc.internal.pageSize.width - 15, posY + 80, { align: 'left', angle: 90 });

	// 		let posX = 35;

	// 		this.doc.addImage(RESOURCES.base64ILogoIMSS, 'PNG', this.doc.internal.pageSize.width - (posX + 75), posY + 12, 50.5, 25.5)
	// 		this.doc.addImage(dataEtiqueta.codigoBarra, 'PNG', this.doc.internal.pageSize.width - posX, posY + 62, 90.5, 25.5, null, null, 90)
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.textoCodigo, this.doc.internal.pageSize.width - (posX - 5), posY + 76, { align: 'left', angle: 90 });


	// 		this.doc.setFont('Montserrat-Regular')
	// 		this.doc.setFontSize(4);
	// 		var splitTitle = this.doc.splitTextToSize(dataEtiqueta.direccion, 80);
	// 		console.log(splitTitle);


	// 		let posXDir = 22 ;
	// 		for (let index = 0; index < splitTitle.length; index++) {
	// 			this.doc.text(this.doc.internal.pageSize.width - (posXDir - (index * 4)), 93 -((80 - this.doc.getTextDimensions(splitTitle[index]).w)/2), splitTitle[index] , null, 90);		
	// 		}


	// 		posY += 5;
	// 		this.doc.setFont('Montserrat-Regular')
	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Paciente:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].nombre, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Fecha de nacimiento:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].fechaNac, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Edad:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].edad, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Peso:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].peso, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Piso:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].piso, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Cama:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].cama, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('NSS:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].nss, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Agregado médico:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].agregado, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Servicio:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].servicio, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		posY += 5;
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Unidad médica:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.paciente[0].unidad, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

	// 		this.doc.setDrawColor(65, 171, 202);
	// 		this.doc.setLineWidth(0.8);
	// 		this.doc.line(this.doc.internal.pageSize.width - separe, posY + 3, 225, posY + 3);

	// 		posY += 9;
	// 		this.doc.setFontSize(6);
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.setFont('Montserrat-SemiBold');
	// 		this.doc.text(dataEtiqueta.tipoMezcla, this.doc.internal.pageSize.width - separe, posY, { align: 'left' });

	// 		posY += 7;
	// 		this.doc.setFontSize(5);
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.setFont('Montserrat-Regular');
	// 		this.doc.text('Via de administración:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.setFont('Montserrat-SemiBold',);
	// 		this.doc.text(dataEtiqueta.mezcla[0].via, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });


	// 		posY += 5;
	// 		this.doc.setFontSize(5);
	// 		this.doc.setFont('Montserrat-Regular');
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Preparador de la mezcla:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.mezcla[0].usuario, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });

	// 		posY += 5;

	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Fecha de preparación:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.mezcla[0].fPrepa, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });

	// 		posY += 5;

	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Fecha de caducidad ambiente:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.mezcla[0].ambiente, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });

	// 		posY += 5;

	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Fecha de caducidad red fría:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.mezcla[0].fria, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });

	// 		posY += 5;

	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Folio de la mezcla:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.mezcla[0].folio, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });

	// 		// posY += 5;   ya no se usa esta temperatura

	// 		// this.doc.setTextColor(0, 0, 0);
	// 		// this.doc.text('Temp estabilidad:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		// this.doc.setTextColor(0, 0, 0);
	// 		// this.doc.text(dataEtiqueta.temperatura, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });//variable de temperatura

	// 		posY += 5;

	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Temp Estab amb:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.tempEstabAmb, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });//variable de temperatura

	// 		posY += 5;

	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Temp Estab fria:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.tempEstabFria, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });//variable de temperatura


	// 		posY += 5;

	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text('Vel. Infusión:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
	// 		this.doc.setTextColor(0, 0, 0);
	// 		this.doc.text(dataEtiqueta.velocidad, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });//variable de temperatura


	// 		this.doc.setDrawColor(65, 171, 202);
	// 		this.doc.setLineWidth(0.8);
	// 		this.doc.line(this.doc.internal.pageSize.width - separe, posY + 3, 280, posY + 3);

	// 		posY += 4
	// 		this.doc.autoTable({
	// 			html: '#medicamentosEtiqueta',
	// 			startY: posY,
	// 			theme: 'grid',
	// 			showHead: 'everyPage',
	// 			margin: {
	// 				top: 10,
	// 				right: 7,
	// 				bottom: 30,
	// 				left: 7,
	// 				useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
	// 			},
	// 			styles: //element.styles,
	// 			{
	// 				minCellHeight: 5,
	// 				fontSize: 5,
	// 				font: 'Montserrat-Regular',
	// 				lineWidth: .5,
	// 				lineColor: 255,
	// 				cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
	// 				halign: 'left',
	// 				textColor: [0, 0, 0]
	// 			},
	// 			headStyles: {
	// 				minCellHeight: 6,
	// 				fontSize: 6,
	// 				font: 'Montserrat-SemiBold',
	// 				fillColor: [255, 255, 255],
	// 				cellPadding: { top: 1, right: 5, bottom: 1, left: 0 },
	// 				halign: 'left',
	// 				textColor: [0, 0, 0]
	// 			},

	// 			columnStyles: {
	// 				0: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				},
	// 				1: {
	// 					halign: 'left',

	// 					tableWidth: 100,
	// 				},
	// 				2: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				},
	// 				3: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				},
	// 				4: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				}
	// 				, 5: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				}
	// 			},


	// 		})



	// 		this.doc.autoTable({
	// 			html: '#diluyentesEtiqueta',
	// 			startY: this.doc.lastAutoTable.finalY,
	// 			theme: 'grid',
	// 			showHead: 'everyPage',
	// 			margin: {
	// 				top: 10,
	// 				right: 7,
	// 				bottom: 30,
	// 				left: 7,
	// 				useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
	// 			},
	// 			styles: //element.styles,
	// 			{
	// 				minCellHeight: 5,
	// 				fontSize: 5,
	// 				font: 'Montserrat-Regular',
	// 				lineWidth: .5,
	// 				lineColor: 255,
	// 				cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
	// 				halign: 'left',
	// 				textColor: [0, 0, 0]
	// 			},
	// 			headStyles: {
	// 				minCellHeight: 6,
	// 				fontSize: 6,
	// 				font: 'Montserrat-SemiBold',
	// 				fillColor: [255, 255, 255],
	// 				cellPadding: { top: 1, right: 5, bottom: 1, left: 0 },
	// 				halign: 'left',
	// 				textColor: [0, 0, 0]
	// 			},

	// 			columnStyles: {
	// 				0: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				},
	// 				1: {
	// 					halign: 'left',

	// 					tableWidth: 100,
	// 				},
	// 				2: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				},
	// 				3: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				},
	// 				4: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				}
	// 				, 5: {
	// 					halign: 'left',
	// 					tableWidth: 100,
	// 				}
	// 			},


	// 		})


	// 		if (index + 1 == dataEtiqueta.paciente.length)
	// 			break;
	// 		this.doc.addPage();
	// 	}
	// 	return 'ok';
	// }

	async createHeaderEtiquetaFormatoNTP(dataEtiqueta) {

		for (let index = 0; index < dataEtiqueta.paciente.length; index++) {

			const separe = 281;
			this.doc.setFont('Montserrat-Regular')
			this.doc.setFontSize(5);
			var w = 220;
			var wm = 180;
			var posY = 0//this.margins.top;
			var posYh = 0;
			posY += 9;
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setTextColor(188, 149, 92);
			this.doc.text('SIICEM', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(65, 171, 202);
			this.doc.text('Sistema Informático Integral Centros de Mezclas', this.doc.internal.pageSize.width - 255, posY, { align: 'left' });

			let posX = 35;

			this.doc.addImage(RESOURCES.base64ILogoIMSS, 'PNG', this.doc.internal.pageSize.width - (posX + 75), posY + 12, 50.5, 25.5)
			this.doc.addImage(dataEtiqueta.codigoBarra, 'PNG', this.doc.internal.pageSize.width - posX, posY + 62, 90.5, 25.5, null, null, 90)
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.textoCodigo, this.doc.internal.pageSize.width - (posX - 5), posY + 76, { align: 'left', angle: 90 });

			this.doc.setFont('Montserrat-Regular')
			this.doc.setFontSize(4);
			var splitTitle = this.doc.splitTextToSize(dataEtiqueta.direccion, 80);
			console.log(splitTitle);


			let posXDir = 22;
			for (let index = 0; index < splitTitle.length; index++) {
				this.doc.text(this.doc.internal.pageSize.width - (posXDir - (index * 4)), 93 - ((80 - this.doc.getTextDimensions(splitTitle[index]).w) / 2), splitTitle[index], null, 90);
			}

			posY += 5;
			this.doc.setFont('Montserrat-Regular')
			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Paciente:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].nombre, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de nacimiento:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].fechaNac, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Edad:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].edad, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Peso:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].peso, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Piso:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].piso, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Cama:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].cama, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('NSS:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].nss, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Agregado médico:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].agregado, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Servicio:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].servicio, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			posY += 5;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Unidad médica:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].unidad, this.doc.internal.pageSize.width - w, posY, { align: 'left' });

			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - separe, posY + 3, 225, posY + 3);

			posY += 9;
			this.doc.setFontSize(6);
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFont('Montserrat-SemiBold');

			this.doc.text(dataEtiqueta.tipoMezcla, this.doc.internal.pageSize.width - separe, posY, { align: 'left' });

			posY += 7;
			this.doc.setFontSize(5);
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFont('Montserrat-Regular');
			this.doc.text(this.bulletPoint + 'Via de administración:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setFont('Montserrat-SemiBold',);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].via, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });


			posY += 5;
			this.doc.setFont('Montserrat-Regular');
			this.doc.setFontSize(5);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(this.bulletPoint + 'Preparador de la mezcla:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].usuario, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });

			posY += 5;

			this.doc.setTextColor(0, 0, 0);
			this.doc.text(this.bulletPoint + 'Folio de la mezcla:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].folio, this.doc.internal.pageSize.width - wm, posY, { align: 'left' });

			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - separe, posY + 2, 225, posY + 2);

			this.doc.setFontSize(6);
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.text('Listado de medicamentos que componen la mezcla:', this.doc.internal.pageSize.width - separe, posY + 9, { align: 'left' });
			posY += 10;
			posYh = posY + 6;
			this.doc.setFont('Montserrat-Regular')
			this.doc.setFontSize(5);
			this.doc.text('Osmolaridad:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.osmolaridad, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('KCal No Proteicas:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.kcalNoProt, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('KCal Totales:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.kcalTotal, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('Nitrógeno:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.nitrogeno, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('Proteínas:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.proteinas, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('Volumen Total:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.volTotal, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('Vel. Infusión:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.velInfu, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('F. Prep:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.fPrep, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('F. Cad.Amb:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.fAmb, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			posYh += 6
			this.doc.text('F. Cad.Ref:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.nptMezcla.fFria, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });
			// posYh +=6
			// this.doc.text('Temp Estabilidad:',  this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			// this.doc.setTextColor(0, 0, 0);
			// this.doc.text(dataEtiqueta.temperatura,  this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });  se quita esta etiqueta y se colocan dos
			posYh += 6
			this.doc.text('Temp Estab fria:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.tempEstabFria, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });

			posYh += 6
			this.doc.text('Temp Estab amb:', this.doc.internal.pageSize.width - 115, posYh, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.tempEstabAmb, this.doc.internal.pageSize.width - 60, posYh, { align: 'left' });


			posY += 2
			this.doc.autoTable({
				html: '#medicamentosEtiquetaNTPPruebaCambio',
				startY: posY,
				theme: 'grid',
				showHead: 'everyPage',
				columnWidth: 5,
				margin: {
					top: 10,
					right: 125,
					bottom: 30, //hcc
					left: 7,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 5,
					fontSize: 5,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 255,
					cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},
				headStyles: {
					minCellHeight: 0,
					fontSize: 0,
					font: 'Montserrat-SemiBold',
					fillColor: [255, 255, 255],
					cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},

				columnStyles: {
					0: {
						halign: 'left',
						tableWidth: 100,
					}
				},


			})



			// this.doc.autoTable({
			// 	html: '#diluyentesEtiquetaNTP',
			// 	startY: this.doc.lastAutoTable.finalY+1,
			// 	theme: 'grid',
			// 	showHead: 'everyPage',
			// 	margin: {
			// 		top: 10,
			// 		right: 125,
			// 		bottom: 22,
			// 		left: 7,
			// 		useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
			// 	},
			// 	styles: //element.styles,
			// 	{
			// 		minCellHeight: 5,
			// 		fontSize: 5,
			// 		font: 'Montserrat-Regular',
			// 		lineWidth: .5,
			// 		lineColor: 255,
			// 		cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
			// 		halign: 'left',
			// 		textColor: [0, 0, 0]
			// 	},
			// 	headStyles: {
			// 		minCellHeight: 6,
			// 		fontSize: 6,
			// 		font: 'Montserrat-SemiBold',
			// 		fillColor: [255, 255, 255],
			// 		cellPadding: { top: 1, right: 5, bottom: 1, left: 0 },
			// 		halign: 'left',
			// 		textColor: [0, 0, 0]
			// 	},

			// 	columnStyles: {
			// 		0: {
			// 			halign: 'left',
			// 			tableWidth: 100,
			// 		},
			// 		1: {
			// 			halign: 'left',

			// 			tableWidth: 100,
			// 		},
			// 		2: {
			// 			halign: 'left',
			// 			tableWidth: 100,
			// 		},
			// 		3: {
			// 			halign: 'left',
			// 			tableWidth: 100,
			// 		},
			// 		4: {
			// 			halign: 'left',
			// 			tableWidth: 100,
			// 		}
			// 		, 5: {
			// 			halign: 'left',
			// 			tableWidth: 100,
			// 		}
			// 	},


			// }) ya no tiene diluyente nutricion 


			if (index + 1 == dataEtiqueta.paciente.length)
				break;
			this.doc.addPage();
		}
		return 'ok';
	}

	async createHeaderEtiqueta(dataEtiqueta) {

		for (let index = 0; index < dataEtiqueta.paciente.length; index++) {


			//const pageCount = this.doc.internal.getNumberOfPages()
			const separe = 580;
			this.doc.setFont('Montserrat-Regular')
			this.doc.setFontSize(11);

			console.log('dataReporteIn', dataEtiqueta)

			var posY = this.margins.top;
			posY += 10;
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setTextColor(188, 149, 92);
			this.doc.text('SIICEM', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setFont('Montserrat-Regular')
			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - separe, posY + 5, this.doc.internal.pageSize.width - 455, posY + 5);

			this.doc.setTextColor(65, 171, 202);
			this.doc.text('|', this.doc.internal.pageSize.width - 537, posY, { align: 'left' });
			//posY += 10;
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.setTextColor(65, 171, 202);
			this.doc.text('Sistema Informático Integral Centros de Mezclas', this.doc.internal.pageSize.width - 530, posY, { align: 'left' });
			this.doc.addImage(RESOURCES.base64ILogoIMSS, 'PNG', this.margins.left + 400, this.margins.top + 60, 106.5, 60.5)
			posY += 10;
			//this.createLine(posY);
			this.doc.setFont('Montserrat-Regular')
			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Paciente:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].nombre, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de nacimiento:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].fechaNac, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Edad:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].edad, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Peso:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].peso, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Piso:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].piso, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Cama:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].cama, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('NSS:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].nss, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Agregado médico:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].agregado, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Servicio:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].servicio, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			posY += 15;
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Unidad médica:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.paciente[0].unidad, this.doc.internal.pageSize.width - 380, posY, { align: 'left' });

			this.doc.setDrawColor(65, 171, 202);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - 580, posY + 8, 580, posY + 8);

			posY += 28;
			this.doc.setFontSize(14);
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.text(dataEtiqueta.tipoMezcla, this.doc.internal.pageSize.width - separe, posY, { align: 'left' });

			posY += 19;
			this.doc.setFontSize(11);
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFont('Montserrat-Regular');
			this.doc.text('Via de administración:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].via, this.doc.internal.pageSize.width - 270, posY, { align: 'left' });


			posY += 15;
			this.doc.setFontSize(11);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Velocidad de infusión (ml/hrs):', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].velocidad, this.doc.internal.pageSize.width - 270, posY, { align: 'left' });

			posY += 15;
			this.doc.setFontSize(11);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de preparación:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].fPrepa, this.doc.internal.pageSize.width - 270, posY, { align: 'left' });

			posY += 15;
			this.doc.setFontSize(11);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de caducidad ambiente:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].ambiente, this.doc.internal.pageSize.width - 270, posY, { align: 'left' });

			posY += 15;
			this.doc.setFontSize(11);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Fecha de caducidad red fría:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].fria, this.doc.internal.pageSize.width - 270, posY, { align: 'left' });

			posY += 15;
			this.doc.setFontSize(11);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Nombre del preparador de la mezcla:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].usuario, this.doc.internal.pageSize.width - 270, posY, { align: 'left' });

			posY += 15;
			this.doc.setFontSize(11);
			this.doc.setTextColor(0, 0, 0);
			this.doc.text('Folio de la mezcla:', this.doc.internal.pageSize.width - separe, posY, { align: 'left' });
			this.doc.setTextColor(0, 0, 0);
			this.doc.text(dataEtiqueta.mezcla[0].folio, this.doc.internal.pageSize.width - 270, posY, { align: 'left' });

			posY += 10;
			this.doc.setFontSize(12);
			this.doc.setTextColor(0, 0, 0);
			this.doc.setFont('Montserrat-SemiBold');


			//for (let index = 0; index < 1; index++) {

			//'#proveedor-tableOrden' + (index + 1)
			this.doc.autoTable({
				html: '#medicamentosEtiqueta',
				startY: posY,
				theme: 'grid',
				showHead: 'everyPage',
				margin: {
					//top: 130,
					right: 35,
					bottom: 50,
					left: 30,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: 11,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 255,
					cellPadding: { top: 0, right: 0, bottom: 2, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: 12,
					font: 'Montserrat-SemiBold',
					fillColor: [255, 255, 255],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},

				columnStyles: {
					0: {
						halign: 'left',
						tableWidth: 100,
					},
					1: {
						halign: 'left',

						tableWidth: 100,
					},
					2: {
						halign: 'left',
						tableWidth: 100,
					},
					3: {
						halign: 'left',
						tableWidth: 100,
					},
					4: {
						halign: 'left',
						tableWidth: 100,
					}
					, 5: {
						halign: 'left',
						tableWidth: 100,
					}
				},


			})



			this.doc.autoTable({
				html: '#diluyentesEtiqueta',
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				showHead: 'everyPage',
				margin: {
					//top: 130,
					right: 35,
					bottom: 150,
					left: 30,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: 11,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 255,
					cellPadding: { top: 0, right: 0, bottom: 2, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: 12,
					font: 'Montserrat-SemiBold',
					fillColor: [255, 255, 255],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'left',
					textColor: [0, 0, 0]
				},

				columnStyles: {
					0: {
						halign: 'left',
						tableWidth: 100,
					},
					1: {
						halign: 'left',

						tableWidth: 100,
					},
					2: {
						halign: 'left',
						tableWidth: 100,
					},
					3: {
						halign: 'left',
						tableWidth: 100,
					},
					4: {
						halign: 'left',
						tableWidth: 100,
					}
					, 5: {
						halign: 'left',
						tableWidth: 100,
					}
				},


			})


			if (index + 1 == dataEtiqueta.paciente.length)
				break;
			this.doc.addPage();
		}
		return 'ok';
	}



	async addContentHTMLRecepcionUMOrden(dataReporte) {


		for (let index = 0; index < dataReporte.folioMezclaRechazadaLst.length; index++) {
			//const element = dataReporte.folioMezclaRechazadaLst[index];

			this.doc.autoTable({
				html: '#proveedor-tableOrden' + (index + 1),
				startY: 110,
				theme: 'grid',
				showHead: 'everyPage',
				margin: {
					top: 130,
					right: 40,
					bottom: 50,
					left: 40,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				//margin: { top: 110, left:, bottom: this.margins.bottom + 80 },
				styles: //element.styles,
				{
					minCellHeight: 50,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',

					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},

				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,
					},
					1: {
						halign: 'center',

						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					},
					4: {
						halign: 'center',
						tableWidth: 100,
					}
					, 5: {
						halign: 'center',
						tableWidth: 100,
					}
				},


			})

			this.doc.autoTable({
				html: '#ordenEntrega-tableOrden' + (index + 1),
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				margin: {
					top: 130,
					right: 40,
					bottom: 50,
					left: 40,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,

				{
					minCellHeight: 50,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,
					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					},
					4: {
						halign: 'center',
						tableWidth: 100,
					},
					5: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})

			this.doc.autoTable({
				html: '#almacenes1-tableOrden' + (index + 1),
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				margin: {
					top: 130,
					right: 40,
					bottom: 50,
					left: 40,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 50,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'left',
						tableWidth: 100,

					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					},
					4: {
						halign: 'left',
						tableWidth: 100,
					},
					5: {
						halign: 'left',
						tableWidth: 100,
					}
				},

			})
			this.doc.autoTable({
				html: '#almacenes2-tableOrden' + (index + 1),
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				showHead: 'never',
				margin: {
					top: 130,
					right: 40,
					bottom: 50,
					left: 40,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 70,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,

					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					4: {
						halign: 'center',
						tableWidth: 100,
					},

					5: {
						halign: 'center',
						tableWidth: 100,
					},

					6: {
						halign: 'center',
						tableWidth: 100,
					},
					7: {
						halign: 'center',
						tableWidth: 100,
					},
					8: {
						halign: 'center',
						tableWidth: 100,
					},
					9: {
						halign: 'center',
						tableWidth: 100,
					},

					10: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})

			this.doc.autoTable({
				html: '#product-table4Orden',
				startY: this.doc.lastAutoTable.finalY + 10,
				theme: 'grid',
				margin: {
					top: 130,
					right: 40,
					bottom: 50,
					left: 40,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 20,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,

					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					4: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					5: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					6: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					7: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})

			this.doc.autoTable({

				html: '#reciboMezclaOrden-' + (index + 1),
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				showHead: 'never',
				margin: {
					top: 130,
					right: 40,
					bottom: 50,
					left: 40,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 20,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,

					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					4: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					5: {
						halign: 'center',
						tableWidth: 100,
					},

					6: {
						halign: 'center',
						tableWidth: 100,
					},

					7: {
						halign: 'center',
						tableWidth: 100,
					},

					8: {
						halign: 'center',
						tableWidth: 100,
					},
					9: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})


			this.doc.autoTable({
				html: '#observacion' + (index + 1),
				startY: this.doc.lastAutoTable.finalY + 15,
				theme: 'grid',
				margin: {
					top: 130,
					right: 40,
					bottom: 50,
					left: 40,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 90,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'left',
						tableWidth: 100,

					},
					1: {
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})
			this.doc.autoTable({
				html: '#firma-orden' + (index + 1),
				startY: this.doc.lastAutoTable.finalY + 5,
				theme: 'grid',
				showHead: 'everyPage',
				margin: {
					top: 130,
					right: 25,
					bottom: 50,
					left: 25,
					useFor: 'page' // This property is mandatory to keep the margin to supsequent pages
				},
				styles: //element.styles,
				{
					minCellHeight: 5,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: 1,
					lineColor: 255,

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',

					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 5,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [255, 255, 255],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,
					},
					1: {
						halign: 'center',

						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					},
					4: {
						halign: 'center',
						tableWidth: 100,
					}
					, 5: {
						halign: 'center',
						tableWidth: 100,
					}
				},
			})

			if (index + 1 == dataReporte.folioMezclaRechazadaLst.length)
				break;
			this.doc.addPage();

		}
	}

	async create(usuario): Promise<any> {

		await this.prepareData().then(async r => {
			this.preparePdf().then(async re => {
				this.addContent(usuario).then(async resp => {
					this.createHeader(usuario).then(async resp => {
						this.createFooter().then(resp => {

							let nomDocumento = "Reporte_Medicamento.pdf";
							this.doc.setProperties({
								title: nomDocumento
							})
							// Open PDF document in new tab
							this.doc.output('dataurlnewwindow', 'Reporte_Medicamento.pdf')
							// Download PDF document                           
							this.doc.save(nomDocumento);
						})
					});
				})
			})
		})
	}

	async createResolucion(usuario): Promise<any> {

		await this.prepareDataRE().then(async r => {
			this.preparePdf().then(async re => {
				//this.addContentRE(usuario).then(async resp => {
				this.createHeader(usuario).then(async resp => {
					this.createFooter().then(resp => {

						let nomDocumento = "Resolucion.pdf"
						// Open PDF document in new tab
						this.doc.setProperties({
							title: nomDocumento
						})

						this.doc.output('dataurlnewwindow', "Resolucion.pdf")
						// Download PDF document                           
						this.doc.save(nomDocumento);
					})
					//});
				})
			})
		})
	}

	async addContentHTMLRecepcionUM(dataReporte) {


		for (let index = 0; index < dataReporte.folioMezclaRechazadaLst.length; index++) {
			const element = dataReporte.folioMezclaRechazadaLst[index];
			this.doc.autoTable({
				html: '#proveedor-table' + (index + 1),
				startY: 110,
				theme: 'grid',
				showHead: 'everyPage',
				styles: //element.styles,
				{
					minCellHeight: 50,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',

					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},

				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,
					},
					1: {
						halign: 'center',

						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					},
					4: {
						halign: 'center',
						tableWidth: 100,
					}
					, 5: {
						halign: 'center',
						tableWidth: 100,
					}
				},


			})

			this.doc.autoTable({
				html: '#ordenEntrega-table' + (index + 1),
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				styles: //element.styles,
				{
					minCellHeight: 50,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,
					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					},
					4: {
						halign: 'center',
						tableWidth: 100,
					},
					5: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})

			this.doc.autoTable({
				html: '#almacenes1-table' + (index + 1),
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				styles: //element.styles,
				{
					minCellHeight: 50,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'left',
						tableWidth: 100,

					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					},
					4: {
						halign: 'left',
						tableWidth: 100,
					},
					5: {
						halign: 'left',
						tableWidth: 100,
					}
				},

			})
			this.doc.autoTable({
				html: '#almacenes2-table' + (index + 1),
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				showHead: 'never',
				styles: //element.styles,
				{
					minCellHeight: 70,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,

					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					4: {
						halign: 'center',
						tableWidth: 100,
					},

					5: {
						halign: 'center',
						tableWidth: 100,
					},

					6: {
						halign: 'center',
						tableWidth: 100,
					},
					7: {
						halign: 'center',
						tableWidth: 100,
					},
					8: {
						halign: 'center',
						tableWidth: 100,
					},
					9: {
						halign: 'center',
						tableWidth: 100,
					},

					10: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})

			this.doc.autoTable({
				html: '#product-table4',
				startY: this.doc.lastAutoTable.finalY + 10,
				theme: 'grid',
				styles: //element.styles,
				{
					minCellHeight: 20,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,

					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					4: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					5: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					6: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					7: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})

			this.doc.autoTable({
				html: '#reciboMezcla-' + (index + 1),
				startY: this.doc.lastAutoTable.finalY,
				theme: 'grid',
				showHead: 'never',
				styles: //element.styles,
				{
					minCellHeight: 100,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'center',
						tableWidth: 100,

					},
					1: {
						halign: 'center',
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					4: {
						halign: 'center',
						tableWidth: 100,
					}
					,
					5: {
						halign: 'center',
						tableWidth: 100,
					},

					6: {
						halign: 'center',
						tableWidth: 100,
					},

					7: {
						halign: 'center',
						tableWidth: 100,
					},

					8: {
						halign: 'center',
						tableWidth: 100,
					},
					9: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})

			//dibujar el cuadrado
			this.doc.setLineWidth(1);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width / 2 + 50, this.doc.lastAutoTable.finalY - 70, (this.doc.internal.pageSize.width / 2) + 80, this.doc.lastAutoTable.finalY - 70);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width / 2 + 50, this.doc.lastAutoTable.finalY - 50, (this.doc.internal.pageSize.width / 2) + 80, this.doc.lastAutoTable.finalY - 50);

			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width / 2 + 50, this.doc.lastAutoTable.finalY - 70, (this.doc.internal.pageSize.width / 2) + 50, this.doc.lastAutoTable.finalY - 50);
			this.doc.setLineWidth(0.8);
			this.doc.line((this.doc.internal.pageSize.width / 2) + 80, this.doc.lastAutoTable.finalY - 70, (this.doc.internal.pageSize.width / 2) + 80, this.doc.lastAutoTable.finalY - 50);


			this.doc.autoTable({
				html: '#observaciones-' + (index + 1),
				startY: this.doc.lastAutoTable.finalY + 20,
				theme: 'grid',

				styles: //element.styles,
				{
					minCellHeight: 100,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					lineWidth: .5,
					lineColor: 1,
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						halign: 'left',
						tableWidth: 100,

					},
					1: {
						tableWidth: 100,
					},
					2: {
						halign: 'center',
						tableWidth: 100,
					},
					3: {
						halign: 'center',
						tableWidth: 100,
					}
				},

			})
			if (index + 1 == dataReporte.folioMezclaRechazadaLst.length) break;
			this.doc.addPage();
		}
	}
	async addContentRecepcionUM(usuario) {

		(this.doc as any).autoTable({
			head: [],
			body: []
		})

		var mapAsc = new Map([...this.memoriaData.mapTablas.entries()].sort((a, b) => a[0] - b[0]));
		// console.log(mapAsc)
		let index = 0;
		let posFinalUltimaTablaSave = 0;
		mapAsc.forEach((value, key) => {
			// console.log(value, key);
			const element = value;
			this.doc.setFont('Montserrat-SemiBold')
			this.doc.setTextColor(103, 103, 103);
			this.doc.setFontSize(9);

			if (index == 1) {
				this.createLine(this.doc.lastAutoTable.finalY + 5, 5);
			}

			var posFinalUltimaTabla = this.doc.lastAutoTable.finalY + 50;
			var altoDocumento = this.doc.internal.pageSize.height - (this.margins.bottom + 5)
			// console.log('alto disponible ',altoDocumento - posFinalUltimaTabla);


			let marginTb = 45;
			let posNewElement = this.doc.lastAutoTable.finalY;
			if ((altoDocumento - posFinalUltimaTabla) < 180) {
				// this.doc.rect(this.margins.left, this.doc.lastAutoTable.finalY, 754.5, altoDocumento - posFinalUltimaTabla); // empty square 
				marginTb = 0;
				posNewElement = this.margins.top + 65;
				this.doc.addPage();
			}

			if (element.title) {
				//incorporamos icono
				//  this.doc.addImage(RESOURCES.base64ListadoMezclaImgLogo, 'PNG', this.margins.left+8, posNewElement + marginTb, 10, 13)          

				this.doc.setFontSize(this.FONT_SIZE_LIST_MEZCLAS);
				this.doc.text(element.title, this.margins.left + 35, posNewElement + marginTb + 10);
				marginTb += 5;
				//  this.createLine(posNewElement + marginTb);
				marginTb += 10;
			}

			let stilefont;
			let nextcelltext;
			(this.doc as any).autoTable({
				head: element.header,
				body: element.data,

				startY: posNewElement + marginTb + 50,//+10
				//tableWidth: 754.5,
				margin: { top: 75, left: this.margins.left, bottom: this.margins.bottom + 80 },
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'left',
					textColor: [255, 255, 255]
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
					if (validaHtml(data.cell.raw)) {
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
								textPosY = data.cell.y + paddH + (data.cell.height - paddH * 2 - ((((righecalc)) * gfs)));
							} else if (stileV === 'bottom') {
								textPosY = data.cell.y + paddH + (data.cell.height - paddH * 2 - ((((righecalc - 1)) * gfs / 2)));
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
						var arr = getArrayTagsHtmlString(contenuto);
						// in ie the <br> is ignored and row number not corrispond
						arr.forEach(function (item, idx, arr) {
							// ****************************************************
							// change font style
							// ****************************************************
							if (item.substr(0, 3) === '<b>' && fontBold != '') {
								if (stilefont.indexOf(fontBold) < 0) {

									stilefont = fontBold;

								}
								stilefont = stilefont.replace(fontNormal, '');

							} else if (item.substr(0, 4) === '</b>' && fontBold != '') {
								stilefont = stilefont.replace(fontBold, '');
								if (stilefont === '') stilefont = fontNormal
							} else if (item.substr(0, 4) === '<br>') {
								// add line on <br>
								celltext = 0;
								textPosY += gfs;
								testoriga = '';
								curStinga = curStinga.trim();
							} else if (item.substr(0, 8) === '<&nbsp;>') {
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
											if (idx === 0) {
												if (data.cell.text) {
													testoriga = data.cell.text[0];
												}
												// ********************
												// workaround for ie
												// ********************
												if (data.cell.raw.outerText) {
													testoriga = data.cell.raw.outerText.substr(0, data.cell.raw.outerText.indexOf('\n') - 1);
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
													if (arrc.substr(0, 4) != '<br>') {
														arrc = arrc.replace('<&nbsp;>', ' ');
														arrc = arrc.substr(arrc.indexOf('>') + 1);
														arrc = this.decodeHTML(arrc);
														var arrd = [arrc];
														if ((data.doc.getTextWidth(rigatmp + arrc) + (paddH * 2) > cellW)) {
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


									if (((textPosX - data.cell.x) + celltext + paddH * 2) > cellW) {
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
						posFinalUltimaTablaSave = posFinalUltimaTablaSave + this.doc.lastAutoTable.finalY;
					}
					// ************************************************************************

				},

			})
			/*      this.doc.text(usuario.nomNombreCompleto, this.doc.internal.pageSize.width / 2,this.doc.lastAutoTable.finalY+40,{ align: 'center' }  );
				  this.doc.setDrawColor(0, 0, 0);
				  this.doc.setLineWidth(0.8); 
				  this.doc.line((this.doc.internal.pageSize.width / 2)-110, this.doc.lastAutoTable.finalY+70,(this.doc.internal.pageSize.width / 2)+120, this.doc.lastAutoTable.finalY+70);
	  	
				  this.doc.text("Puesto: "+usuario.cemetUsuarios[0].idPerfil.desPerfil, (this.doc.internal.pageSize.width / 2),this.doc.lastAutoTable.finalY+80,{ align: 'center' }  );
			  */
			index = index + 1;
		});


	}
	async addContent(usuario) {

		(this.doc as any).autoTable({
			head: [],
			body: []
		})

		var mapAsc = new Map([...this.memoriaData.mapTablas.entries()].sort((a, b) => a[0] - b[0]));
		// console.log(mapAsc)
		let index = 0;
		let posFinalUltimaTablaSave = 0;
		mapAsc.forEach((value, key) => {
			// console.log(value, key);
			const element = value;
			this.doc.setFont('Montserrat-SemiBold')
			this.doc.setTextColor(103, 103, 103);
			this.doc.setFontSize(9);

			if (index == 1) {
				this.createLine(this.doc.lastAutoTable.finalY + 5, 5);
			}

			var posFinalUltimaTabla = this.doc.lastAutoTable.finalY;
			var altoDocumento = this.doc.internal.pageSize.height - (this.margins.bottom + 5)
			// console.log('alto disponible ',altoDocumento - posFinalUltimaTabla);


			let marginTb = 45;
			let posNewElement = this.doc.lastAutoTable.finalY;
			if ((altoDocumento - posFinalUltimaTabla) < 180) {
				// this.doc.rect(this.margins.left, this.doc.lastAutoTable.finalY, 754.5, altoDocumento - posFinalUltimaTabla); // empty square 
				marginTb = 0;
				posNewElement = this.margins.top + 65;
				this.doc.addPage();
			}

			if (element.title) {
				//incorporamos icono
				//  this.doc.addImage(RESOURCES.base64ListadoMezclaImgLogo, 'PNG', this.margins.left+8, posNewElement + marginTb, 10, 13)          

				this.doc.setFontSize(this.FONT_SIZE_LIST_MEZCLAS);
				this.doc.text(element.title, this.margins.left + 35, posNewElement + marginTb + 10);
				marginTb += 5;
				//  this.createLine(posNewElement + marginTb);
				marginTb += 10;
			}

			let stilefont;
			let nextcelltext;
			(this.doc as any).autoTable({
				head: element.header,
				body: element.data,

				startY: posNewElement + marginTb + 30,
				//tableWidth: 754.5,
				margin: { top: 115, left: this.margins.left, bottom: this.margins.bottom + 80, useFor: 'page' },
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [240, 250, 237],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'left',
					textColor: [103, 103, 103]
				},
				showHead: 'everyPage',
				verticalMargin: 'topMargin',
				columnStyles: {
					0: {
						cellWidth: 25,
						halign: 'left',
						tableWidth: 25,
					},
					1: {
						cellWidth: 455,
						halign: 'left',

						tableWidth: 455,
					},
					2: {
						cellWidth: 70,
						halign: 'left',

						tableWidth: 70,
					},
					3: {
						cellWidth: 100,
						halign: 'left',

						tableWidth: 100,
					},
					4: {
						cellWidth: 104,
						halign: 'left',

						tableWidth: 104,
					}
				},
				theme: 'plain',
				willDrawCell: function (data) {
					// *************************************************************
					// mixed style in cell (for <b>, <i>, <u>, <del>)
					// *************************************************************
					// console.log('data.cell.raw :::::::::::',data.cell.raw)
					if (validaHtml(data.cell.raw)) {
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
								textPosY = data.cell.y + paddH + (data.cell.height - paddH * 2 - ((((righecalc)) * gfs)));
							} else if (stileV === 'bottom') {
								textPosY = data.cell.y + paddH + (data.cell.height - paddH * 2 - ((((righecalc - 1)) * gfs / 2)));
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
						var arr = getArrayTagsHtmlString(contenuto);
						// in ie the <br> is ignored and row number not corrispond
						arr.forEach(function (item, idx, arr) {
							// ****************************************************
							// change font style
							// ****************************************************
							if (item.substr(0, 3) === '<b>' && fontBold != '') {
								if (stilefont.indexOf(fontBold) < 0) {

									stilefont = fontBold;

								}
								stilefont = stilefont.replace(fontNormal, '');

							} else if (item.substr(0, 4) === '</b>' && fontBold != '') {
								stilefont = stilefont.replace(fontBold, '');
								if (stilefont === '') stilefont = fontNormal
							} else if (item.substr(0, 4) === '<br>') {
								// add line on <br>
								celltext = 0;
								textPosY += gfs;
								testoriga = '';
								curStinga = curStinga.trim();
							} else if (item.substr(0, 8) === '<&nbsp;>') {
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
											if (idx === 0) {
												if (data.cell.text) {
													testoriga = data.cell.text[0];
												}
												// ********************
												// workaround for ie
												// ********************
												if (data.cell.raw.outerText) {
													testoriga = data.cell.raw.outerText.substr(0, data.cell.raw.outerText.indexOf('\n') - 1);
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
													if (arrc.substr(0, 4) != '<br>') {
														arrc = arrc.replace('<&nbsp;>', ' ');
														arrc = arrc.substr(arrc.indexOf('>') + 1);
														arrc = this.decodeHTML(arrc);
														var arrd = [arrc];
														if ((data.doc.getTextWidth(rigatmp + arrc) + (paddH * 2) > cellW)) {
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


									if (((textPosX - data.cell.x) + celltext + paddH * 2) > cellW) {
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
						posFinalUltimaTablaSave = posFinalUltimaTablaSave + this.doc.lastAutoTable.finalY;
					}
					// ************************************************************************

				},

			})
			//	, this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });
			this.doc.text(usuario.nomNombreCompleto, (this.doc.internal.pageSize.width / 2) - 250 + 10, this.doc.lastAutoTable.finalY + 40, { align: 'center' });
			this.doc.setDrawColor(0, 0, 0);//110
			this.doc.setLineWidth(0.8);
			this.doc.line((this.doc.internal.pageSize.width / 2) - 330, this.doc.lastAutoTable.finalY + 70, (this.doc.internal.pageSize.width / 2) - 250 + 100, this.doc.lastAutoTable.finalY + 70);

			this.doc.text("Puesto: " + usuario.cemetUsuarios[0].idPerfil.desPerfil, (this.doc.internal.pageSize.width / 2) - 250 + 10, this.doc.lastAutoTable.finalY + 80, { align: 'center' });

			//se agrega responsable sanitario

			this.doc.text(this.memoriaData.reponsableSanitario.nombreUsusario == null ? "" : this.memoriaData.reponsableSanitario.nombreUsusario, this.doc.internal.pageSize.width / 2 + 250, this.doc.lastAutoTable.finalY + 40, { align: 'center' });
			this.doc.setDrawColor(0, 0, 0);
			this.doc.setLineWidth(0.8);
			this.doc.line((this.doc.internal.pageSize.width / 2 + 170), this.doc.lastAutoTable.finalY + 70, (this.doc.internal.pageSize.width / 2 + 250 + 80), this.doc.lastAutoTable.finalY + 70);

			this.doc.text("Puesto: " + this.memoriaData.reponsableSanitario.puestoUsuario, (this.doc.internal.pageSize.width / 2 + 250), this.doc.lastAutoTable.finalY + 80, { align: 'center' });




			index = index + 1;
		});


	}

	async addContentRE(usuario) {

		(this.doc as any).autoTable({
			head: [],
			body: []
		})

		var mapAsc = new Map([...this.memoriaData.mapTablas.entries()].sort((a, b) => a[0] - b[0]));
		// console.log(mapAsc)
		let index = 0;
		let posFinalUltimaTablaSave = 0;
		mapAsc.forEach((value, key) => {
			// console.log(value, key);
			const element = value;
			this.doc.setFont('Montserrat-SemiBold')
			this.doc.setTextColor(103, 103, 103);
			this.doc.setFontSize(9);

			if (index == 1) {
				this.createLine(this.doc.lastAutoTable.finalY + 5, 5);
			}

			var posFinalUltimaTabla = this.doc.lastAutoTable.finalY;
			var altoDocumento = this.doc.internal.pageSize.height - (this.margins.bottom + 5)
			// console.log('alto disponible ',altoDocumento - posFinalUltimaTabla);


			let marginTb = 45;
			let posNewElement = this.doc.lastAutoTable.finalY;
			if ((altoDocumento - posFinalUltimaTabla) < 180) {
				// this.doc.rect(this.margins.left, this.doc.lastAutoTable.finalY, 754.5, altoDocumento - posFinalUltimaTabla); // empty square 
				marginTb = 0;
				posNewElement = this.margins.top + 65;
				this.doc.addPage();
			}

			if (element.title) {
				//incorporamos icono
				this.doc.addImage(RESOURCES.base64ListadoMezclaImgLogo, 'PNG', this.margins.left + 8, posNewElement + marginTb, 10, 13)

				this.doc.setFontSize(this.FONT_SIZE_LIST_MEZCLAS);
				this.doc.text(element.title, this.margins.left + 35, posNewElement + marginTb + 10);
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

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'justify',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [240, 250, 237],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
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
					if (validaHtml(data.cell.raw)) {
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
								textPosY = data.cell.y + paddH + (data.cell.height - paddH * 2 - ((((righecalc)) * gfs)));
							} else if (stileV === 'bottom') {
								textPosY = data.cell.y + paddH + (data.cell.height - paddH * 2 - ((((righecalc - 1)) * gfs / 2)));
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
						var arr = getArrayTagsHtmlString(contenuto);
						// in ie the <br> is ignored and row number not corrispond
						arr.forEach(function (item, idx, arr) {
							// ****************************************************
							// change font style
							// ****************************************************
							if (item.substr(0, 3) === '<b>' && fontBold != '') {
								if (stilefont.indexOf(fontBold) < 0) {

									stilefont = fontBold;

								}
								stilefont = stilefont.replace(fontNormal, '');

							} else if (item.substr(0, 4) === '</b>' && fontBold != '') {
								stilefont = stilefont.replace(fontBold, '');
								if (stilefont === '') stilefont = fontNormal
							} else if (item.substr(0, 4) === '<br>') {
								// add line on <br>
								celltext = 0;
								textPosY += gfs;
								testoriga = '';
								curStinga = curStinga.trim();
							} else if (item.substr(0, 8) === '<&nbsp;>') {
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
											if (idx === 0) {
												if (data.cell.text) {
													testoriga = data.cell.text[0];
												}
												// ********************
												// workaround for ie
												// ********************
												if (data.cell.raw.outerText) {
													testoriga = data.cell.raw.outerText.substr(0, data.cell.raw.outerText.indexOf('\n') - 1);
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
													if (arrc.substr(0, 4) != '<br>') {
														arrc = arrc.replace('<&nbsp;>', ' ');
														arrc = arrc.substr(arrc.indexOf('>') + 1);
														arrc = this.decodeHTML(arrc);
														var arrd = [arrc];
														if ((data.doc.getTextWidth(rigatmp + arrc) + (paddH * 2) > cellW)) {
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


									if (((textPosX - data.cell.x) + celltext + paddH * 2) > cellW) {
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
						posFinalUltimaTablaSave = posFinalUltimaTablaSave + this.doc.lastAutoTable.finalY;
					}
					// ************************************************************************

				},

			})

			//this.doc.text(usuario.nomNombreCompleto, this.margins.left+35, posFinalUltimaTablaSave);

			index = index + 1;
		});


	}
	async createHeaderRecepcionUM(dataReporte) {
		const pageCount = this.doc.internal.getNumberOfPages()
		const separe = 90;
		this.doc.setFont('Montserrat-Regular')
		this.doc.setFontSize(14);


		for (var i = 1; i <= pageCount; i++) {
			this.doc.setPage(i)
			var posY = this.margins.top;
			this.doc.addImage(RESOURCES.base64ILogoIMSS, 'PNG', this.margins.left, this.margins.top + 2, 106.5, 60.5)
			posY += 10;
			this.doc.setTextColor(103, 103, 103);
			this.doc.text('Acuse de Rechazo', this.doc.internal.pageSize.width / 2 - 70, posY + 10, { align: 'center' });
			posY += 10;
			this.doc.text('Atribuibles al distribuidor', this.doc.internal.pageSize.width / 2 - 70, posY + 15, { align: 'center' });

			posY += 10;
			this.doc.text('' + dataReporte.tipoMezcla, this.doc.internal.pageSize.width / 2 - 70, posY + 20, { align: 'center' });
			(this.doc as any).autoTable({
				head: [['Número de Orden', 'Página']],
				body: [
					['' + dataReporte.numOrden, '' + i + ' de ' + pageCount,],

					// ...
				],
				theme: 'grid',
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						cellWidth: 100,
						halign: 'center',
						tableWidth: 100,
					},
					1: {
						cellWidth: 100,
						halign: 'center',

						tableWidth: 100,
					}
				},

				tableWidth: 200,
				startY: this.margins.top,
				margin: 355,

			}
			);
			let fecha = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
			(this.doc as any).autoTable({
				head: [['Fecha']],
				body: [
					['' + fecha],

					// ...
				],
				theme: 'grid',

				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				tableWidth: 200,
				startY: this.doc.lastAutoTable.finalY,
				margin: 355,

			}
			);




			/*
			posY += 15;
			this.createLine(posY);
			this.doc.setFont('Montserrat-SemiBold')
			posY += 15;
			this.doc.setTextColor(33, 122, 107);
			 this.doc.addImage(RESOURCES.base64MezclaImgLogo, 'PNG', this.margins.left+10, posY-10, 10, 15)
		  */
			//   this.doc.text('Reporte de [medicamento/componente/diluyentes] de mezclas aprobadas', this.margins.left+30, posY);
			//   this.doc.setTextColor(103, 103, 103);
			//    let fecha=formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
			//      this.doc.text('Fecha del reporte: '+fecha, this.doc.internal.pageSize.width - separe, posY);
			//		console.log("usuario",usuario);
			//	this.doc.text('Puesto: '+usuario.cemetUsuarios[0].idPerfil.desPerfil, this.doc.internal.pageSize.width - separe, posY+15);


		}

		return 'ok';
	}

	async createHeaderRecepcionUMOrden(dataReporte) {
		const pageCount = this.doc.internal.getNumberOfPages()
		const separe = 90;
		this.doc.setFont('Montserrat-Regular')
		this.doc.setFontSize(13);
		let temp = 0;
		let fin = pageCount / 3;
		let tomo = pageCount / 3;
		let aux = false;
		for (var i = 1; i <= pageCount; i++) {
			if (aux) {
				temp = 0
				aux = false;
			}
			temp = temp + 1;
			if (i === tomo) {
				//acum = temp;
				aux = true;
				temp = fin;
				tomo = tomo + fin;
			}
			this.doc.setPage(i)
			var posY = this.margins.top;
			this.doc.addImage(RESOURCES.base64ILogoIMSS, 'PNG', this.margins.left, this.margins.top + 2, 106.5, 60.5)
			posY += 10;
			this.doc.setTextColor(103, 103, 103);
			this.doc.text('Formatos para la entrega', this.doc.internal.pageSize.width / 2 - 70, posY + 10, { align: 'center' });
			posY += 10;
			this.doc.text('y la recepción de las mezclas esteriles', this.doc.internal.pageSize.width / 2 - 70, posY + 15, { align: 'center' });

			posY += 10;
			this.doc.text('' + dataReporte.tipoMezcla, this.doc.internal.pageSize.width / 2 - 70, posY + 20, { align: 'center' });
			(this.doc as any).autoTable({
				head: [['Número de Orden', 'Página']],
				body: [
					['' + dataReporte.numOrden, '' + temp + ' de ' + fin,],

					// ...
				],
				theme: 'grid',
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',

					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				columnStyles: {
					0: {
						cellWidth: 100,
						halign: 'center',
						tableWidth: 100,
					},
					1: {
						cellWidth: 100,
						halign: 'center',

						tableWidth: 100,
					}
				},

				tableWidth: 200,
				startY: this.margins.top,
				margin: 355,

			}//autotable
			);
			let fecha = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
			(this.doc as any).autoTable({
				head: [['Fecha']],
				body: [
					['' + fecha],
					// ...
				],
				theme: 'grid',
				styles: //element.styles,
				{
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-Regular',
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [103, 103, 103]
				},
				headStyles: {
					minCellHeight: 10,
					fontSize: this.FONT_SIZE_BODY_PDF,
					font: 'Montserrat-SemiBold',
					fillColor: [11, 69, 14],
					cellPadding: { top: 5, right: 5, bottom: 5, left: 0 },
					halign: 'center',
					textColor: [255, 255, 255]
				},
				tableWidth: 200,
				startY: this.doc.lastAutoTable.finalY,
				margin: 355,

			}//autotable
			);
		}//for

		return 'ok';
	}

	async createHeader(usuario) {
		const pageCount = this.doc.internal.getNumberOfPages()
		const separe = 178;
		const sepaceH = 274
		this.doc.setFont('Montserrat-Regular')
		this.doc.setFontSize(9);


		for (var i = 1; i <= pageCount; i++) {
			this.doc.setPage(i)
			var posY = this.margins.top;
			this.doc.addImage(RESOURCES.base64ImgLogo, 'PNG', this.margins.left, this.margins.top - 5, 156.5, 32.79)
			posY += 10;
			this.doc.setTextColor(33, 122, 107);
			this.doc.setFont('Montserrat-SemiBold')
			this.doc.text('Instituto Mexicano del Seguro Social', this.doc.internal.pageSize.width - sepaceH, posY, { align: 'left' });
			posY += 15;
			this.doc.setTextColor(103, 103, 103);
			this.doc.setFont('Montserrat-SemiBold')
			this.doc.text('SIICEM', this.doc.internal.pageSize.width - sepaceH, posY, { align: 'left' });
			this.doc.setFont('Montserrat-Regular');
			this.doc.text(' Sistema Informático Integral Centros de Mezclas', this.doc.internal.pageSize.width - sepaceH + this.doc.getTextWidth('SIICEM'), posY);
			posY += 15;
			this.createLine(posY);
			this.doc.setFont('Montserrat-SemiBold')
			posY += 15;
			this.doc.setTextColor(33, 122, 107);
			this.doc.addImage(RESOURCES.base64spanReporte, 'PNG', this.margins.left, posY - 11, 7, 25)
			this.doc.addImage(RESOURCES.base64MezclaImgLogo, 'PNG', this.margins.left + 15, posY - 10, 15, 20)
			posY += 5;
			this.doc.setFont('Montserrat-Regular');
			this.doc.text('Reporte de [medicamento/componente/diluyentes] de mezclas aprobadas', this.margins.left + 35, posY);
			this.doc.setTextColor(103, 103, 103);
			let fecha = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
			this.doc.setFont('Montserrat-SemiBold')
			this.doc.text('Fecha del reporte: ' + fecha, this.doc.internal.pageSize.width - separe, posY);
			console.log("usuario", usuario);
			this.doc.text('Puesto: ' + usuario.cemetUsuarios[0].idPerfil.desPerfil, this.doc.internal.pageSize.width - separe, posY + 15);
			usuario.nomNombreCompleto

		}

		return 'ok';
	}

	createLine(yPos, width?) {
		if (width) {
			this.doc.setLineWidth(width);
		} else {
			this.doc.setLineWidth(1.0);
		}
		this.doc.setDrawColor(221, 221, 221);
		this.doc.setLineWidth(0.8);
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

			this.doc.text('Pag. ' + String(i) + ' de ' + String(pageCount), this.doc.internal.pageSize.width - 40, this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });

			this.doc.addImage(RESOURCES.base64ImgFooter, 'PNG', this.margins.left, this.doc.internal.pageSize.height - (this.margins.bottom + 5), this.doc.internal.pageSize.width - (2 * this.margins.left), 8.64)
		}

		return 'ok';
	}
	async createFooterRecepcionUM() {
		const pageCount = this.doc.internal.getNumberOfPages()
		this.doc.setFont('Montserrat-Regular')
		this.doc.setFontSize(9)
		this.doc.setTextColor(103, 103, 103);
		for (var i = 1; i <= pageCount; i++) {
			this.doc.setPage(i)
			//this.doc.text(String(i) + '/' + String(pageCount), this.doc.internal.pageSize.width / 2, this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });

			//this.doc.text('Pag. '+String(i) + ' de ' + String(pageCount), this.doc.internal.pageSize.width-40 , this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });

			// this.doc.addImage(RESOURCES.base64ImgFooter, 'PNG', this.margins.left, this.doc.internal.pageSize.height - (this.margins.bottom + 5), this.doc.internal.pageSize.width - (2 * this.margins.left), 8.64)
			//this.doc.text(usuario.nomNombreCompleto, this.doc.internal.pageSize.width / 2,this.doc.lastAutoTable.finalY+40,{ align: 'center' }  );
			this.doc.setDrawColor(0, 0, 0);
			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width - 550, this.doc.internal.pageSize.height - (this.margins.bottom + 15) - 10, (this.doc.internal.pageSize.width / 2) - 50, this.doc.internal.pageSize.height - (this.margins.bottom + 15) - 10);
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.text("Matrícula, nombre completo y firma de", this.doc.internal.pageSize.width - 450, this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });
			this.doc.text("quien recibe", this.doc.internal.pageSize.width - 450, this.doc.internal.pageSize.height + 15 - (this.margins.bottom + 15), { align: 'center' });

			this.doc.setLineWidth(0.8);
			this.doc.line(this.doc.internal.pageSize.width / 2 + 40, this.doc.internal.pageSize.height - (this.margins.bottom + 15) - 10, this.doc.internal.pageSize.width / 2 + 260, this.doc.internal.pageSize.height - (this.margins.bottom + 15) - 10);
			this.doc.setFont('Montserrat-SemiBold');
			this.doc.text("Nombre completo y firma de quien recibe", this.doc.internal.pageSize.width / 2 + 150, this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });
			this.doc.text("en conformidad", this.doc.internal.pageSize.width / 2 + 150, this.doc.internal.pageSize.height + 15 - (this.margins.bottom + 15), { align: 'center' });

		}

		return 'ok';
	}

	async createFooterRecepcionUMOrden() {
		const pageCount = this.doc.internal.getNumberOfPages()
		this.doc.setFont('Montserrat-Regular')
		this.doc.setFontSize(9)
		this.doc.setTextColor(103, 103, 103);
		//let inicio = 0;
		let temp = 0;
		let fin = pageCount / 3;
		let tomo = pageCount / 3;
		let aux = false;
		for (var i = 1; i <= pageCount; i++) {
			if (aux) {
				temp = 0
				aux = false;
			}
			temp = temp + 1
			if (i === tomo) {
				aux = true;
				temp = fin;
				tomo = tomo + fin;
			}
			this.doc.setPage(i)
			this.doc.text(String(temp) + ' DE ' + String(fin), this.doc.internal.pageSize.width - 60, this.doc.internal.pageSize.height - (this.margins.bottom + 15), { align: 'center' });
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

function getArrayTagsHtmlString(str) {
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
