import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { VehiculoModel } from "../../models/vehiculo.model";
import { VehiculoSqliteService } from "../../providers/vehiculo.service.sqlite";

@Component({
  selector: 'page-modal-vehiculo',
  templateUrl: 'modal-vehiculo.html',
})
export class ModalVehiculoPage {

  private vehiculos: VehiculoModel[] = [];

  constructor(
    private vehiculoService: VehiculoSqliteService,
    private viewCtl: ViewController) {

    this.vehiculoService.getAll().then(data => {
      this.vehiculos = data;
    });
  }

  ionViewDidLoad() {
  }

  onSelectedVehiculo(category) {
    this.viewCtl.dismiss(category);
  }

  closeModal() {
    this.viewCtl.dismiss();
  }

}
