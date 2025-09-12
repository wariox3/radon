import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ViajeRepository } from '../../repositories/viaje.repository';
import { RouterLink } from '@angular/router';
import { Viaje } from '../../interfaces/viaje.interface';
import { CommonModule } from '@angular/common';
import { AlertaService } from '@app/common/services/alerta.service';
import { ViajeCardComponent } from '../../components/viaje-card/viaje-card.component';
import { switchMap } from 'rxjs';
import { NegocioRepository } from '@app/common/repositories/transporte/negocio.repository';

@Component({
  selector: 'app-viaje-lista',
  standalone: true,
  imports: [RouterLink, CommonModule, ViajeCardComponent],
  templateUrl: './viaje.component.html',
  styleUrl: './viaje.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViajeComponent implements OnInit {
  private _viajeRepository = inject(ViajeRepository);
  private _negocioRepository = inject(NegocioRepository);
  private _alertaService = inject(AlertaService);

  public viajes = signal<Viaje[]>([]);

  ngOnInit(): void {
    this.getVisitas();
  }

  getVisitas() {
    this._viajeRepository
      .getViajes({ estado_cancelado: 'False', estado_aceptado: 'False', solicitud_cliente: 'True' })
      .subscribe(response => {
        this.viajes.set(response.viajes);
      });
  }

  aceptarPropuesta({ propuestaId }: { propuestaId: number; viajeId: number }): void {
    this._viajeRepository
      .aceptarPropuesta(propuestaId)
      .pipe(
        switchMap(response => {
          return this._negocioRepository.nuevoViaje(
            propuestaId,
            response.propuesta.viaje,
            response.propuesta.schema_name
          );
        })
      )
      .subscribe(() => {
        this.getVisitas();
        this._alertaService.mostrarExito('Viaje aprobado');
      });
  }

  eliminarViaje(viajeId: number): void {
    this._viajeRepository.eliminarViaje(viajeId).subscribe(() => {
      this.getVisitas();
      this._alertaService.mostrarExito('Viaje eliminado');
    });
  }

  cancelarViaje(viajeId: number): void {
    this._viajeRepository.cancelarViaje(viajeId).subscribe(() => {
      this.getVisitas();
      this._alertaService.mostrarExito('Viaje cancelado');
    });
  }
}
