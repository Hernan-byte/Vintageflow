'use client';

import { useActionState, useState } from 'react';
import { ingresar, crearCuenta } from './actions';

export default function FormularioAcceso({ deshabilitado = false }) {
  const [modo, setModo] = useState('entrar');
  const [estadoEntrar, accionEntrar, pendienteEntrar] = useActionState(ingresar, null);
  const [estadoCrear, accionCrear, pendienteCrear] = useActionState(crearCuenta, null);

  const crear = modo === 'crear';
  const estado = crear ? estadoCrear : estadoEntrar;
  const pendiente = crear ? pendienteCrear : pendienteEntrar;

  return (
    <>
      <div className="filters modos" role="group" aria-label="Tipo de acceso">
        <button
          type="button"
          className="filter"
          aria-pressed={!crear}
          onClick={() => setModo('entrar')}
        >
          Ingresar
        </button>
        <button
          type="button"
          className="filter"
          aria-pressed={crear}
          onClick={() => setModo('crear')}
        >
          Crear cuenta
        </button>
      </div>

      <form action={crear ? accionCrear : accionEntrar} key={modo} id="acceso">
        {crear && (
          <div className="campo">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" type="text" autoComplete="name" required />
          </div>
        )}
        <div className="campo">
          <label htmlFor="correo">Correo</label>
          <input id="correo" name="correo" type="email" autoComplete="email" required />
        </div>
        <div className="campo">
          <label htmlFor="clave">Clave</label>
          <input
            id="clave"
            name="clave"
            type="password"
            autoComplete={crear ? 'new-password' : 'current-password'}
            minLength={crear ? 8 : undefined}
            required
          />
          {crear && <span className="ayuda">Mínimo 8 caracteres.</span>}
        </div>
        <button className="btn" type="submit" disabled={pendiente || deshabilitado}>
          {pendiente ? 'Un momento…' : crear ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </form>

      <p className="msg" role="status" hidden={!estado}>
        {estado?.error || estado?.ok}
      </p>
    </>
  );
}
