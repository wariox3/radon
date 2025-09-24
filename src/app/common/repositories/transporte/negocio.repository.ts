import { inject, Injectable } from '@angular/core';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';
import { UrlService } from '@app/core/services/url.service';

@Injectable({
  providedIn: 'root',
})
export class NegocioRepository {
  private _httpBase = inject(HttpBaseRepository);
  private _urlService = inject(UrlService);

  constructor() {}

  nuevoViaje(propuestaId: number, viajeId: number, schemaName: string) {
    const url = this._urlService.buildSubdomainUrl(schemaName);
    return this._httpBase.post<{ estado_aprobado: true }>(
      `${url}/transporte/negocio/nuevo-viaje/`,
      {
        viaje_id: viajeId,
        propuesta_id: propuestaId,
      }
    );
  }
}
