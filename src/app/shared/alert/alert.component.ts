import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from './alert.model';
import { AlertService } from './alert.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']

})
export class AlertComponent implements OnInit, OnDestroy {
    @Input() id = 'default-alert';
    @Input() fade = true;

    alerts: Alert[] = [];
    alertSubscription: Subscription = new Subscription;
    routeSubscription: Subscription = new Subscription;

    constructor(private router: Router, private alertService: AlertService) { }

    ngOnInit() {
        // subscribe to new alert notifications
        this.alertSubscription = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                // clear alerts when an empty alert is received
                if (!alert.message) {
                    // filter out alerts without 'keepAfterRouteChange' flag
                    this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

                    // remove 'keepAfterRouteChange' flag on the rest
                    this.alerts.forEach(x => x.keepAfterRouteChange = false);
                    return;
                }

                // add alert to array
                this.alerts.push(alert);

                // auto close alert if required
                if (alert.autoClose) {
                    setTimeout(() => this.removeAlert(alert), 5000);
                }
            });

        // clear alerts on location change
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.alertService.clear(this.id);
            }
        });
    }

    ngOnDestroy() {
        // unsubscribe to avoid memory leaks
        this.alertSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

    removeAlert(alert: Alert) {
        // check if already removed to prevent error on auto close
        if (!this.alerts.includes(alert)) return;

        if (this.fade) {
            // fade out alert
            let ale = this.alerts.find(x => x === alert);
            if (ale) {
                ale.fade = true;
            }
            // remove alert after faded out
            setTimeout(() => {
                this.alerts = this.alerts.filter(x => x !== alert);
            }, 250);
        } else {
            // remove alert
            this.alerts = this.alerts.filter(x => x !== alert);
        }
    }

    cssClass(alert: Alert) {
        if (!alert)
            return;
        let classes = 'alert alert-dismissable';
        let alertTypeClass = [' alert-success ', ' alert-danger ', ' alert-info ', ' alert-warning ']
        classes = classes.concat(alertTypeClass[alert.type].toString());
        if (alert.fade) {
            classes = classes.concat('fade');
        }

        return classes;
    }

    cssClassIcon(alert: Alert) {
        if (!alert)
            return;
        let classes = ' ';
        let alertTypeClass = [' ico-succes-alert ', ' ico-danger-alert ', ' ico-info-alert ', ' ico-war-alert  ']
        classes = classes.concat(alertTypeClass[alert.type].toString());

        return classes;
    }
}
