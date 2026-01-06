import React, { useState } from 'react';
import './App.css';
import Formulario from './componentes/Formulario';
import Cronograma from './componentes/Cronograma';
import Alertas from './componentes/Alertas';
import { calcularCronograma } from './logica/algoritmo';
import { validarCronograma, obtenerDiasConError } from './logica/validaciones';

function App() {
  const [cronograma, setCronograma] = useState(null);
  const [errores, setErrores] = useState([]);
  const [diasConError, setDiasConError] = useState(new Set());
  const [parametros, setParametros] = useState(null);

  const manejarCalcular = (params) => {
    const resultado = calcularCronograma(
      params.diasTrabajo,
      params.diasDescanso,
      params.diasInduccion,
      params.diasPerforacion
    );

    const listaErrores = validarCronograma(resultado);
    const diasError = obtenerDiasConError(resultado);

    setCronograma(resultado);
    setErrores(listaErrores);
    setDiasConError(diasError);
    setParametros(params);
  };

  return (
    <div className="contenedor">
      <header className="encabezado">
        <h1>Cronograma de Supervisores</h1>
        <p>Sistema de planificacion de turnos para perforacion minera</p>
      </header>

      <main className="principal">
        <section className="seccion-formulario">
          <h2>Configuracion</h2>
          <Formulario onCalcular={manejarCalcular} />
        </section>

        {cronograma && (
          <>
            <section className="seccion-resumen">
              <h2>Resumen</h2>
              <div className="resumen-datos">
                <div className="resumen-item">
                  <span className="resumen-etiqueta">Regimen:</span>
                  <span className="resumen-valor">{parametros.diasTrabajo}x{parametros.diasDescanso}</span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-etiqueta">Induccion:</span>
                  <span className="resumen-valor">{parametros.diasInduccion} dias</span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-etiqueta">Perforacion requerida:</span>
                  <span className="resumen-valor">{parametros.diasPerforacion} dias</span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-etiqueta">Total dias cronograma:</span>
                  <span className="resumen-valor">{cronograma.diasTotales} dias</span>
                </div>
              </div>
            </section>

            <section className="seccion-alertas">
              <h2>Validacion</h2>
              <Alertas errores={errores} />
            </section>

            <section className="seccion-cronograma">
              <h2>Cronograma</h2>
              <Cronograma
                cronograma={cronograma}
                diasConError={diasConError}
                diasTrabajo={parametros.diasTrabajo}
                diasDescanso={parametros.diasDescanso}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
