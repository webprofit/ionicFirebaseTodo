import { Component, OnInit } from '@angular/core';
import { BaseComponent, TypeMessage } from '../../core/base-classes/base-component';
import { BaseConfig } from '../../core/base-classes/configBase';




export class User {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  styleUrls: ['./user.scss'],
})
export class UserPage extends BaseComponent implements OnInit {

  user: User = {
    firstName: 'Robert',
    lastName: ''
  };


  constructor(
    private config: BaseConfig,
    ) {
      super(config);
    }

  ngOnInit() {

  }

  save() {
    const al = {
      message: `${this.user.firstName} not saved!`,
      title: 'Saving user'
    };
    this.showAlert(al);
  }


}
