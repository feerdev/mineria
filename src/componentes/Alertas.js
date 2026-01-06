import React from 'react';

function Alertas({ errores }) {
  if (!errores || errores.length === 0) {
    return (
      <div className="alertas alertas-exito">
        Cronograma valido: Siempre hay exactamente 2 supervisores perforando
      </div>
    );
  }

  const erroresTres = errores.filter(e => e.tipo === 'TRES_PERFORANDO');
  const erroresUno = errores.filter(e => e.tipo === 'UNO_PERFORANDO');
  const erroresNinguno = errores.filter(e => e.tipo === 'NINGUNO_PERFORANDO');
  const erroresPatron = errores.filter(e =>
    e.tipo === 'SUBIDA_CONSECUTIVA' ||
    e.tipo === 'SUBIDA_BAJADA' ||
    e.tipo === 'BAJADA_SUBIDA' ||
    e.tipo === 'PERFORACION_UN_DIA'
  );

  return (
    <div className="alertas alertas-error">
      <h3>Se encontraron {errores.length} errores:</h3>

      {erroresTres.length > 0 && (
        <div className="alerta-grupo">
          <h4>3 supervisores perforando ({erroresTres.length} dias):</h4>
          <ul>
            {erroresTres.slice(0, 5).map((e, i) => (
              <li key={i}>{e.mensaje}</li>
            ))}
            {erroresTres.length > 5 && <li>... y {erroresTres.length - 5} mas</li>}
          </ul>
        </div>
      )}

      {erroresUno.length > 0 && (
        <div className="alerta-grupo">
          <h4>Solo 1 supervisor perforando ({erroresUno.length} dias):</h4>
          <ul>
            {erroresUno.slice(0, 5).map((e, i) => (
              <li key={i}>{e.mensaje}</li>
            ))}
            {erroresUno.length > 5 && <li>... y {erroresUno.length - 5} mas</li>}
          </ul>
        </div>
      )}

      {erroresNinguno.length > 0 && (
        <div className="alerta-grupo">
          <h4>Ningun supervisor perforando ({erroresNinguno.length} dias):</h4>
          <ul>
            {erroresNinguno.slice(0, 5).map((e, i) => (
              <li key={i}>{e.mensaje}</li>
            ))}
            {erroresNinguno.length > 5 && <li>... y {erroresNinguno.length - 5} mas</li>}
          </ul>
        </div>
      )}

      {erroresPatron.length > 0 && (
        <div className="alerta-grupo">
          <h4>Patrones invalidos ({erroresPatron.length}):</h4>
          <ul>
            {erroresPatron.slice(0, 5).map((e, i) => (
              <li key={i}>{e.mensaje}</li>
            ))}
            {erroresPatron.length > 5 && <li>... y {erroresPatron.length - 5} mas</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Alertas;
