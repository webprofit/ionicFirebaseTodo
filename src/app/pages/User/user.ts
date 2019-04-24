import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';



export class User {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  styleUrls: ['./user.scss'],
})
export class UserPage implements OnInit {

  user: User = {
    firstName: 'Robert',
    lastName: ''
  };


  constructor(
    private alertSvc: AlertService,
    // private route: ActivatedRoute,
    // private nav: NavController,
    // private todoService: TodoService,
    // private loadingController: LoadingController
  ) { }

  ngOnInit() {

  }

  save() {
    const al = {
      message: `${this.user.firstName} not saved!`,
      title: 'Saving user'
    };
    this.alertSvc.show(al);
  }


}
