import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectSearchComponent } from '@app/common/components/ui/forms/select-search/select-search.component';
import { Usuario } from '@app/modules/auth/interfaces/usuario.interface';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { InputComponent, LabelComponent } from '@tamerlantian/ui-components';

@Component({
  selector: 'app-viaje-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, LabelComponent, SelectSearchComponent],
  templateUrl: './viaje-formulario.component.html',
  styleUrl: './viaje-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViajeFormularioComponent implements OnInit {
  @Output() viajeGuardado: EventEmitter<any> = new EventEmitter();

  @Input() estaEditando = false;
  @Input() viajeData: any = null;

  private _store = inject(Store);
  private _usuario: Usuario | null = null;
  private _cdr = inject(ChangeDetectorRef);

  viajeForm = new FormGroup({
    servicio: new FormControl(null, [Validators.required]),
    servicio__nombre: new FormControl(null, []),
    producto: new FormControl(null, [Validators.required]),
    producto__nombre: new FormControl(null, []),
    usuario: new FormControl(null, [Validators.required]),
    empaque: new FormControl(null, [Validators.required]),
    empaque__nombre: new FormControl(null, []),
    cliente: new FormControl(null, [Validators.required]),
    unidades: new FormControl(null, [Validators.required, Validators.min(0)]),
    peso: new FormControl(null, [Validators.required, Validators.min(0)]),
    volumen: new FormControl(null, [Validators.required, Validators.min(0)]),
    ciudad_origen: new FormControl(null, [Validators.required]),
    ciudad_origen__nombre: new FormControl(null, []),
    ciudad_destino: new FormControl(null, [Validators.required]),
    ciudad_destino__nombre: new FormControl(null, []),
    puntos_entrega: new FormControl(null, [Validators.required, Validators.min(0)]),
    solicitud_cliente: new FormControl(true, [Validators.required]),
    comentario: new FormControl(null, []),
    numero_identificacion: new FormControl(null, []),
  });

  ngOnInit(): void {
    this._initStoreDatos();
    if (this.estaEditando && this.viajeData) {
      this._loadViajeData();
    } else {
      this._initForm();
    }
  }

  private _initStoreDatos() {
    this._store.select(selectCurrentUser).subscribe(usuario => {
      this._usuario = usuario;
    });
  }

  private _initForm() {
    this.viajeForm.patchValue({
      usuario: this._usuario?.id,
      cliente: this._usuario?.empresa_nombre,
      numero_identificacion: this._usuario?.empresa_numero_identificacion,
    });
  }

  private _loadViajeData() {
    if (this.viajeData) {
      this.viajeForm.patchValue(this.viajeData);
      this._cdr.detectChanges();
    }
  }

  enviarFormulario(): void {
    if (!this.viajeForm.valid) {
      this.viajeForm.markAllAsTouched();
      this._cdr.detectChanges();
      return;
    }

    this.viajeGuardado.emit(this.viajeForm.value);
  }

  getControl(nombre: string): FormControl {
    return this.viajeForm.get(nombre) as FormControl;
  }
}
