import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ConductorModel } from "../../models/conductor.model";
import { VehiculoSqliteService } from "../../providers/vehiculo.service.sqlite";
import { ConductorSqliteService } from "../../providers/conductor.service.sqlite";
import { ConductorPage } from "../conductor/conductor";

@Component({
  selector: 'page-list-conductor',
  templateUrl: 'list-conductor.html',
})
export class ListConductorPage {

  private vehiculos: ConductorModel[] = [];

  constructor(private navCtrl: NavController,
    private vehiculoService: VehiculoSqliteService,
    private conductorService: ConductorSqliteService,
    private alertCtrl: AlertController) {
    this.loadData();
  }

  loadData() {
    this.vehiculoService.getAll().then(data => {
      this.vehiculos = data;
    });
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ionViewDidLoad() {
    this.loadData();
  }

  onAddClick() {
    this.navCtrl.push(ConductorPage);
  }

  editCategory(conductor: ConductorModel) {
    this.navCtrl.push(ConductorPage, {
      conductor: conductor
    });
  }

  doRefresh(refresher) {
    this.vehiculoService.getAll()
      .then(data => {
        this.vehiculos = data;
        refresher.complete();
      })
      .catch(e => console.log(e));
  }

  onTrash(conductor: ConductorModel) {
    let confirm = this.alertCtrl.create({
      title: 'Eliminar',
      message: `Desea eliminar el siguiente conductor: "${conductor.nombres} ${conductor.apellidos}"?`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.conductorService.delete(conductor);
            this.loadData();
          }
        }
      ]
    });
    confirm.present();
  }

}
