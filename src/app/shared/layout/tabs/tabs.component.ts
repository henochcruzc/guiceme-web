import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdComponentService } from 'src/app/modules/home/components/componentes.service';
import { AccountService } from 'src/app/modules/login/services/account.service';
import { NAV } from '../../config/global';
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [
        CommonModule, NgbNavModule, RouterModule
    ],
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements OnInit,AfterViewInit{
   
    @ViewChild("menuGral") public mainContentDiv: ElementRef;

    router = inject(Router);
    spinner = inject(NgxSpinnerService);
    modulos = inject(AccountService).getModulos().filter((mod) => mod.indActivo === true);
    componentList = inject(AdComponentService).getComponents();
    sessionStorageService = inject(SessionStorageService)
    activeTab = this.sessionStorageService.getActiveTab();

    active=0;
    ngOnInit(){
        this.active = this.activeTab.index;
    }

    ngAfterViewInit(): void {
        this.mainContentDiv?.nativeElement.scrollTo({ left:this.activeTab.left, behavior: 'smooth'}) 
    }
   
    navegarA(item,index) {
        this.spinner.show();
        const componente = this.componentList.find((element) => element.id == item) || { url: NAV.noData, id: 0 ,orden:1};
        if (componente) {
            this.router.navigate([componente.url]);
            setTimeout(() => {
                this.spinner.hide();
            }, 2000);
            let yyyyyy = (this.mainContentDiv.nativeElement.scrollWidth / (this.modulos.length +1)) * index ;
            this.sessionStorageService.setActiveTab({id:componente.id,left:yyyyyy,index:index});
        }
    }

}
