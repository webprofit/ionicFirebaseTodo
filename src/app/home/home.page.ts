import { Component, OnInit, Inject } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

import { FirebaseConfig } from '@ionic-native/firebase-config/ngx';
import { Todo, TodoService } from '../core/services/todo.service';
import { BaseComponent, TypeMessage } from '../core/base-classes/base-component';
import { BaseConfig } from '../core/base-classes/configBase';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [Push, NotifierService, FirebaseConfig],
})
export class HomePage extends BaseComponent implements OnInit {

  showRemoteConfig: boolean;
  // canUpdate: boolean = false;
  todos: Todo[];

  programVersion: string;
  programNewVersion: string;

  constructor(

    private firebaseConfig: FirebaseConfig,
    private todoService: TodoService,
    private push: Push,
    private config: BaseConfig,
  ) {
    super(config);
  }

  ngOnInit() {


    this.getData();
    this.pushService();
    this.getConfig('version');
  }

  // getRemoteConfig() {
  //   this.firebaseConfig.update(100)
  //     .then(res => {
  //       console.log('config updated!', res);

  //       this.getConfig('premium_account', true);
  //       this.getConfig('version', false);
  //     });
  // }

  getCongigNewVersion() {
    this.firebaseConfig.update(100)
      .then(ress => {
        if (ress) {
          this.firebaseConfig.getString('version')
            .then((res: any) => {
              this.programNewVersion = res;
            });
        }
      });
  }

  getConfig(paramKey: string) {
    this.firebaseConfig.getString(paramKey)
      .then((res: any) => {
        if (paramKey === 'version') {
          this.programVersion = res;
          this.getCongigNewVersion();
        }
        if (paramKey === 'premium_account') {
          if (res === 'true') {
            this.changeTheme('night');
          } else {
            this.changeTheme('neon');
          }
        }
      })
      .catch((error: any) => console.error(error));
  }

  updateVersion() {
    this.programVersion = this.programNewVersion;
    this.showNotification(TypeMessage.info, `Updated`);
  }

  // isEqualVersion(): boolean {

  //   this.programVersion = '1.2.2';
  //   this.programNewVersion = '1.2.3';
  //   // +programVersion == +programNewVersion
  //   // tslint:disable-next-line:variable-name
  //   let _programVersion = [];
  //   let _programNewVersion = [];
  //   if (this.programVersion) {
  //     _programVersion = this.programVersion.split('.');
  //   }
  //   if (this.programNewVersion) {
  //     _programNewVersion = this.programNewVersion.split('.');
  //   }
  //   let nowVersion = 0;
  //   let newVersion = 0;
  //   _programVersion.map(el => {
  //     nowVersion += el;
  //   });
  //   _programNewVersion.map(el => {
  //     newVersion += el;
  //   });
  //   this.showNotification(TypeMessage.info, `${nowVersion}`);
  //   this.showNotification(TypeMessage.info, `${newVersion}`);
  //   console.log(newVersion);
  //   console.log(nowVersion);

  //   return newVersion <= nowVersion ;
  // }


  remoteCnfig() {
    this.showRemoteConfig = !this.showRemoteConfig;
  }

  pushService() {
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          this.initPush();
          // this.notifier.notify('error', 'We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
          // this.notifier.notify('error', 'We do not have permission to send push notifications');
        }

      })
      .catch((err: any) => this.errorHandler(err));
  }

  initPush() {
    const options: PushOptions = {
      android: {
        senderID: '455698471485'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      // windows: {},
      // browser: {
      //   pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      // }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      this.showAlert(notification);
    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      // this.notifier.notify('error', 'Device registered');


    });

    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error);
      // this.notifier.notify('error', 'Error with Push plugin');
    });
  }

  // async presentAlert(notification) {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Notification',
  //     subHeader: notification.title,
  //     message: notification.message,
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  // }

  errorHandler(err: Error | any) {
    const errMsg = `${err.code ? err.code : ''} ${err.message ? err.message : ''}`;
    console.log(err); // only for dev_________
    // this.notifier.notify('error', `${errMsg ? errMsg : 'Something went wrong'}  ${err}`);
  }

  getData() {
    this.todoService.getTodos().subscribe(res => {
      this.todos = res;
    });
  }

  remove(item) {
    this.todoService.removeTodo(item.id);
  }
}
