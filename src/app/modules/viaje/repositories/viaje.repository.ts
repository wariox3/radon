import { inject, Injectable } from '@angular/core';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';
import { ViajeLista, ViajeDetalle, Propuesta } from '../interfaces/viaje.interface';

@Injectable({
  providedIn: 'root',
})
export class ViajeRepository {
  private _httpBase = inject(HttpBaseRepository);

  getViajes(parametros?: QueryParams) {
    return this._httpBase.get<ViajeLista>('vertical/viaje/lista/', parametros);
  }

  guardarViaje(viaje: any) {
    return this._httpBase.post<any>('vertical/viaje/nuevo/', viaje);
  }

  getViajeById(id: number) {
    return this._httpBase.get<ViajeDetalle>(`vertical/viaje/${id}/`);
  }

  actualizarViaje(id: number, viaje: any) {
    return this._httpBase.put<any>(`vertical/viaje/${id}/`, viaje);
  }

  aceptarPropuesta(id: number) {
    return this._httpBase.post<{ mensaje: string; propuesta: Propuesta }>(
      `vertical/propuesta/aceptar/`,
      { id }
    );
  }

  eliminarViaje(id: number) {
    return this._httpBase.delete(`vertical/viaje/${id}/`);
  }

  cancelarViaje(id: number) {
    return this._httpBase.post(`vertical/viaje/cancelar/`, { id });
  }
}
