import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Profile } from "../../models/profile.model";
import { HomePage } from "../home/home";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile = {} as Profile;

  constructor(private navCtrl: NavController,
    private navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  createProfile(profile: Profile) {    
  }

}
