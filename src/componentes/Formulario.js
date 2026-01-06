import React, { useState } from 'react';

function Formulario({ onCalcular }) {
  const [diasTrabajo, setDiasTrabajo] = useState(14);
  const [diasDescanso, setDiasDescanso] = useState(7);
  const [diasInduccion, setDiasInduccion] = useState(5);
  const [diasPerforacion, setDiasPerforacion] = useState(30);

  const manejarSubmit = (e) => {
    e.preventDefault();
    onCalcular({
      diasTrabajo: parseInt(diasTrabajo),
      diasDescanso: parseInt(diasDescanso),
      diasInduccion: parseInt(diasInduccion),
      diasPerforacion: parseInt(diasPerforacion)
    });
  };

  return (
    <form className="formulario" onSubmit={manejarSubmit}>
      <div className="formulario-grupo">
        <label>Regimen de trabajo</label>
        <div className="regimen-inputs">
          <input
            type="number"
            value={diasTrabajo}
            onChange={(e) => setDiasTrabajo(e.target.value)}
            min="5"
            max="30"
          />
          <span>x</span>
          <input
            type="number"
            value={diasDescanso}
            onChange={(e) => setDiasDescanso(e.target.value)}
            min="3"
            max="14"
          />
        </div>
        <span className="formulario-ayuda">Dias trabajo x Dias descanso</span>
      </div>

      <div className="formulario-grupo">
        <label>Dias de induccion</label>
        <input
          type="number"
          value={diasInduccion}
          onChange={(e) => setDiasInduccion(e.target.value)}
          min="1"
          max="5"
        />
        <span className="formulario-ayuda">Entre 1 y 5 dias</span>
      </div>

      <div className="formulario-grupo">
        <label>Dias del cronograma</label>
        <input
          type="number"
          value={diasPerforacion}
          onChange={(e) => setDiasPerforacion(e.target.value)}
          min="10"
          max="1500"
        />
        <span className="formulario-ayuda">Total de dias calendario</span>
      </div>

      <button type="submit" className="boton-calcular">
        Calcular Cronograma
      </button>
    </form>
  );
}

export default Formulario;
