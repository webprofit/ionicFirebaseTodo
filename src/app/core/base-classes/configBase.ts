import { AlertController } from '@ionic/angular';
import { NotifierService } from 'angular-notifier';
import { Injectable } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Injectable()
export class BaseConfig {

    constructor(
        public theme: ThemeService,
        public alertCtrl: AlertController,
        public notifier: NotifierService,
    ) {

    }
}
