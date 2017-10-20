import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserProfile } from "../../app/user-profile.model";
import { User } from "../../models/user.model";
import { RegisterPage } from "../register/register";
import { ProfilePage } from "../profile/profile";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {

  userProfile: UserProfile;
  private user = {} as User;
  showUser: boolean = false;

  constructor(private navCtrl: NavController,
    public events: Events) {

    this.userProfile = {
      username: "",
      uid: "",
      photoURL: "",
      displayName: "",
      email: ""
    };

  }

  async singIn(user: User) {
  }

  onGoogleLogin() {
  }

  onFacebookLogin() {
  }

  getInfo() {
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

}
