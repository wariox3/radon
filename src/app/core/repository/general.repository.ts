import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AlertaService } from '@app/common/services/alerta.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { QueryParams } from '../interfaces/api.interface';
import { UrlService } from '../services/url.service';
import { HttpBaseRepository } from './http-base.repository';

@Injectable({
  providedIn: 'root',
})
export class GeneralRepository {
  private httpBase = inject(HttpBaseRepository);
  private urlService = inject(UrlService);
  private alertaService = inject(AlertaService);

  /**
   * Realiza una consulta GET a la API con el subdominio actual
   * @param endpoint Ruta del endpoint a consultar
   * @param queryParams Parámetros de consulta opcionales
   * @returns Observable con la respuesta tipada
   */
  get<T>(endpoint: string, queryParams: QueryParams = {}): Observable<T> {
    return this.getWithSubdominio<T>(endpoint, queryParams);
  }

  /**
   * Realiza una consulta GET para obtener un único recurso con el subdominio actual
   * @param endpoint Ruta del endpoint a consultar
   * @param id Identificador del recurso
   * @returns Observable con la respuesta tipada
   */
  getById<T>(endpoint: string, id: string | number): Observable<T> {
    return this.getWithSubdominio<T>(`${endpoint}${id}/`);
  }

  /**
   * Crea un nuevo recurso mediante POST con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param data Datos a enviar
   * @returns Observable con la respuesta tipada
   */
  create<T>(endpoint: string, data: any): Observable<T> {
    return this.postWithSubdominio<T>(endpoint, data);
  }

  /**
   * Actualiza un recurso existente mediante PUT con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param id Identificador del recurso
   * @param data Datos a actualizar
   * @returns Observable con la respuesta tipada
   */
  update<T>(endpoint: string, id: string | number, data: any): Observable<T> {
    return this.putWithSubdominio<T>(`${endpoint}${id}/`, data);
  }

  /**
   * Actualiza parcialmente un recurso mediante PATCH con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param id Identificador del recurso
   * @param data Datos a actualizar
   * @returns Observable con la respuesta tipada
   */
  patch<T>(endpoint: string, id: string | number, data: any): Observable<T> {
    return this.patchWithSubdominio<T>(`${endpoint}/${id}`, data);
  }

  /**
   * Elimina un recurso mediante DELETE con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param id Identificador del recurso
   * @returns Observable con la respuesta
   */
  delete<T>(endpoint: string, id: string | number): Observable<T> {
    return this.deleteWithSubdominio<T>(`${endpoint}${id}/`);
  }

  /**
   * Descarga un archivo desde el servidor
   * @param endpoint Ruta del endpoint
   * @param queryParams Parámetros de consulta opcionales
   */
  public descargarArchivos(endpoint: string, queryParams: QueryParams = {}): void {
    // this.alertaService.mensajaEspera('espera');
    this.urlService
      .getSubdomainUrl()
      .pipe(
        switchMap(subdomainUrl => {
          const url = `${subdomainUrl}/${endpoint}`;
          return this.httpBase.getArchivo(url, queryParams);
        }),
        catchError(() => {
          this.alertaService.cerrar();
          this.alertaService.mostrarError(`Error 15`, 'El documento no tiene un formato');
          return of(null);
        })
      )
      .subscribe(response => {
        if (!response) return;

        const nombreArchivo = this.obtenerNombreArchivo(response.headers);
        this.descargarBlob(response.body, nombreArchivo);
        setTimeout(() => this.alertaService.cerrar(), 1000);
      });
  }

  /**
   * Consultar un recurso mediante POST con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param data Datos a enviar
   * @returns Observable con la respuesta tipada
   */
  public post<T>(endpoint: string, data: any): Observable<T> {
    return this.postWithSubdominio<T>(endpoint, data);
  }

  // Métodos privados que utilizan el subdominio

  private getWithSubdominio<T>(endpoint: string, params?: QueryParams): Observable<T> {
    return this.urlService.getSubdomainUrl().pipe(
      switchMap(subdomainUrl => {
        const url = `${subdomainUrl}/${endpoint}`;
        return this.httpBase.get<T>(url, params);
      })
    );
  }

  private postWithSubdominio<T>(endpoint: string, data: any): Observable<T> {
    return this.urlService.getSubdomainUrl().pipe(
      switchMap(subdomainUrl => {
        const url = `${subdomainUrl}/${endpoint}`;

        return this.httpBase.post<T>(url, data);
      })
    );
  }

  private putWithSubdominio<T>(endpoint: string, data: any): Observable<T> {
    return this.urlService.getSubdomainUrl().pipe(
      switchMap(subdomainUrl => {
        const url = `${subdomainUrl}/${endpoint}`;
        return this.httpBase.put<T>(url, data);
      })
    );
  }

  private patchWithSubdominio<T>(endpoint: string, data: any): Observable<T> {
    return this.urlService.getSubdomainUrl().pipe(
      switchMap(subdomainUrl => {
        const url = `${subdomainUrl}/${endpoint}`;
        return this.httpBase.patch<T>(url, data);
      })
    );
  }

  private deleteWithSubdominio<T>(endpoint: string): Observable<T> {
    return this.urlService.getSubdomainUrl().pipe(
      switchMap(subdomainUrl => {
        const url = `${subdomainUrl}/${endpoint}`;
        return this.httpBase.delete(url, {});
      })
    );
  }

  private obtenerNombreArchivo(headers: HttpHeaders): string {
    const contentDisposition = headers.get('Content-Disposition');
    if (!contentDisposition) {
      throw new Error('Error no existe Content-Disposition');
    }

    let nombreArchivo = contentDisposition.split(';')[1].trim().split('=')[1];
    nombreArchivo = decodeURI(nombreArchivo.replace(/"/g, ''));
    if (!nombreArchivo) {
      throw new Error('fileName error');
    }
    return nombreArchivo;
  }

  private descargarBlob(data: Blob | null, nombreArchivo: string): void {
    if (!data) return;

    const blob = new Blob([data], { type: data.type });
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = objectUrl;
    a.download = nombreArchivo;
    a.click();

    URL.revokeObjectURL(objectUrl);
  }
}
