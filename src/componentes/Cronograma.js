import React, { useState, useEffect } from 'react';
import { ESTADOS } from '../logica/algoritmo';

function Cronograma({ cronograma, diasConError, diasTrabajo, diasDescanso }) {
  const [paginaActual, setPaginaActual] = useState(0);
  const diasPorPagina = diasTrabajo + diasDescanso;

  useEffect(() => {
    setPaginaActual(0);
  }, [cronograma, diasTrabajo, diasDescanso]);

  if (!cronograma) return null;

  const { s1, s2, s3, conteoPerforando, diasTotales } = cronograma;

  const totalPaginas = Math.ceil(diasTotales / diasPorPagina);
  const inicio = paginaActual * diasPorPagina;
  const fin = Math.min(inicio + diasPorPagina, diasTotales);

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case ESTADOS.SUBIDA: return 'celda-subida';
      case ESTADOS.INDUCCION: return 'celda-induccion';
      case ESTADOS.PERFORACION: return 'celda-perforacion';
      case ESTADOS.BAJADA: return 'celda-bajada';
      case ESTADOS.DESCANSO: return 'celda-descanso';
      case ESTADOS.VACIO: return 'celda-vacio';
      default: return '';
    }
  };

  const dias = [];
  for (let i = inicio; i < fin; i++) {
    dias.push(i);
  }

  return (
    <div className="cronograma">
      <div className="cronograma-navegacion">
        <button
          onClick={() => setPaginaActual(p => Math.max(0, p - 1))}
          disabled={paginaActual === 0}
        >
          Anterior
        </button>
        <span>Dias {inicio} - {fin - 1} de {diasTotales - 1}</span>
        <button
          onClick={() => setPaginaActual(p => Math.min(totalPaginas - 1, p + 1))}
          disabled={paginaActual >= totalPaginas - 1}
        >
          Siguiente
        </button>
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-cronograma">
          <thead>
            <tr>
              <th className="celda-header">Dia</th>
              {dias.map(d => (
                <th key={d} className="celda-header">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="celda-supervisor">S1</td>
              {dias.map(d => (
                <td key={d} className={`celda ${obtenerClaseEstado(s1[d])}`}>
                  {s1[d]}
                </td>
              ))}
            </tr>
            <tr>
              <td className="celda-supervisor">S2</td>
              {dias.map(d => (
                <td key={d} className={`celda ${obtenerClaseEstado(s2[d])}`}>
                  {s2[d]}
                </td>
              ))}
            </tr>
            <tr>
              <td className="celda-supervisor">S3</td>
              {dias.map(d => (
                <td key={d} className={`celda ${obtenerClaseEstado(s3[d])}`}>
                  {s3[d]}
                </td>
              ))}
            </tr>
            <tr className="fila-conteo">
              <td className="celda-supervisor">#P</td>
              {dias.map(d => (
                <td
                  key={d}
                  className={`celda celda-conteo ${diasConError.has(d) ? 'celda-error' : ''}`}
                >
                  {conteoPerforando[d]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="leyenda">
        <div className="leyenda-item">
          <span className="leyenda-color celda-subida"></span>
          <span>S - Subida</span>
        </div>
        <div className="leyenda-item">
          <span className="leyenda-color celda-induccion"></span>
          <span>I - Induccion</span>
        </div>
        <div className="leyenda-item">
          <span className="leyenda-color celda-perforacion"></span>
          <span>P - Perforacion</span>
        </div>
        <div className="leyenda-item">
          <span className="leyenda-color celda-bajada"></span>
          <span>B - Bajada</span>
        </div>
        <div className="leyenda-item">
          <span className="leyenda-color celda-descanso"></span>
          <span>D - Descanso</span>
        </div>
        <div className="leyenda-item">
          <span className="leyenda-color celda-vacio"></span>
          <span>- - Vacio</span>
        </div>
      </div>
    </div>
  );
}

export default Cronograma;
