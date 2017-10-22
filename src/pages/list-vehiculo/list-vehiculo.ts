import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { VehiculoModel } from "../../models/vehiculo.model";
import { VehiculoPage } from "../vehiculo/vehiculo";
import { VehiculoSqliteService } from "../../providers/vehiculo.service.sqlite";

@Component({
  selector: 'page-list-vehiculo',
  templateUrl: 'list-vehiculo.html',
})
export class ListVehiculoPage {

  private vehiculos: VehiculoModel[] = [];

  constructor(private navCtrl: NavController,
    private vehiculoService: VehiculoSqliteService,
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
    this.navCtrl.push(VehiculoPage);
  }

  editCategory(vehiculo: VehiculoModel) {
    this.navCtrl.push(VehiculoPage, {
      vehiculo: vehiculo
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

  onTrash(vehiculo: VehiculoModel) {
    let confirm = this.alertCtrl.create({
      title: 'Eliminar',
      message: `Desea eliminar el vehículo con placa: "${vehiculo.placa}"?`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.vehiculoService.delete(vehiculo);
            this.loadData();
          }
        }
      ]
    });
    confirm.present();
  }

}
