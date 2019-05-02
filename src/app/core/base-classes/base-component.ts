import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AlertController } from '@ionic/angular';
import { BaseConfig } from './configBase';
import { ThemeService } from '../services/theme.service';
import { AlertNotification } from '../interfaces/interfaces';


export enum TypeMessage {
    error = 'error',
    info = 'info',
    success = 'success'
}


@Injectable()
export class BaseComponent {
    notifierSvc: NotifierService;
    alertCtrl: AlertController;
    theme: ThemeService;

    constructor(config: BaseConfig) {
        this.notifierSvc = config.notifier;
        this.alertCtrl = config.alertCtrl;
        this.theme = config.theme;
    }

    changeTheme(name: string) {
        this.theme.setTheme(name);
    }


    errorHandler(err: Error | any) {
        const errMsg = `${err.code ? err.code : ''} ${err.message ? err.message : ''}`;
        this.showNotification(TypeMessage.error, `${errMsg ? errMsg : `'Something went wrong' ${err}`} `);
    }

    showNotification(type: string, message: string) {
        this.notifierSvc.notify(type, message);
    }

    async showAlert(AlertMessage: AlertNotification) {
        const alert = await this.alertCtrl.create({
            header: AlertMessage.header ? AlertMessage.header : 'Notification',
            subHeader: AlertMessage.title,
            message: AlertMessage.message,
            buttons: ['OK']
        });
        await alert.present();
    }


}
