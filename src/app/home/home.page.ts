import { Component, OnInit, Inject } from '@angular/core';
import { Todo, TodoService } from '../services/todo.service';
import { NotifierService } from 'angular-notifier';

import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [Push, NotifierService],
})
export class HomePage implements OnInit {

  todos: Todo[];

  constructor(
    private todoService: TodoService,
    private push: Push,
    public alertCtrl: AlertController,
    @Inject(NotifierService) private notifier: NotifierService,
  ) {

  }

  ngOnInit() {
    this.getData();

    this.pushService();

  }

  pushService() {
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          this.initPush();
          this.presentAlert({title: 'some', message: 'sdf'});
          this.notifier.notify('error', 'We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
          this.notifier.notify('error', 'We do not have permission to send push notifications');
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
      console.log('Device registered', notification);
      this.presentAlert(notification);


    });

    pushObject.on('registration').subscribe((registration: any) => {
      // alert('Event=registration, registrationId=' + registration.registrationId);
      console.log('Device registered', registration);
      this.notifier.notify('error', 'Device registered');

    });

    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error);
      this.notifier.notify('error', 'Error with Push plugin');

    });
  }

  async presentAlert(notification) {
    const alert = await this.alertCtrl.create({
      header: 'Notification',
      subHeader: notification.title,
      message: notification.message,
      buttons: ['OK']
    });

    await alert.present();
  }

  errorHandler(err: Error | any) {
    const errMsg = `${err.code ? err.code : ''} ${err.message ? err.message : ''}`;
    console.log(err); // only for dev_________
    this.notifier.notify('error', `${errMsg ? errMsg : 'Something went wrong'}  ${err}`);
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
