import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

export interface AlertNotification {
    header?: string;
    title: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(public alertCtrl: AlertController) {
    }


    async show(AlertMessage: AlertNotification) {
        const alert = await this.alertCtrl.create({
            header: AlertMessage.header ? AlertMessage.header : 'Notification',
            subHeader: AlertMessage.title,
            message: AlertMessage.message,
            buttons: ['OK']
        });
        await alert.present();
    }


}
