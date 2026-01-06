import { ESTADOS } from './algoritmo';

export function validarCronograma(cronograma) {
  const errores = [];
  const { s1, s2, s3, conteoPerforando, diasTotales } = cronograma;

  let s3HaPerforado = false;

  for (let dia = 0; dia < diasTotales; dia++) {
    if (s3[dia] === ESTADOS.PERFORACION) {
      s3HaPerforado = true;
    }

    if (conteoPerforando[dia] === 3) {
      errores.push({
        tipo: 'TRES_PERFORANDO',
        dia,
        mensaje: `Dia ${dia}: 3 supervisores perforando`
      });
    }

    if (s3HaPerforado && conteoPerforando[dia] === 1) {
      errores.push({
        tipo: 'UNO_PERFORANDO',
        dia,
        mensaje: `Dia ${dia}: Solo 1 supervisor perforando`
      });
    }

    if (s3HaPerforado && conteoPerforando[dia] === 0) {
      errores.push({
        tipo: 'NINGUNO_PERFORANDO',
        dia,
        mensaje: `Dia ${dia}: Ningun supervisor perforando`
      });
    }
  }

  const supervisores = [
    { nombre: 'S1', secuencia: s1 },
    { nombre: 'S2', secuencia: s2 },
    { nombre: 'S3', secuencia: s3 }
  ];

  for (const sup of supervisores) {
    for (let dia = 0; dia < diasTotales - 1; dia++) {
      const actual = sup.secuencia[dia];
      const siguiente = sup.secuencia[dia + 1];

      if (actual === ESTADOS.SUBIDA && siguiente === ESTADOS.SUBIDA) {
        errores.push({
          tipo: 'SUBIDA_CONSECUTIVA',
          dia,
          mensaje: `${sup.nombre} dia ${dia}: Subida consecutiva (S-S)`
        });
      }

      if (actual === ESTADOS.SUBIDA && siguiente === ESTADOS.BAJADA) {
        errores.push({
          tipo: 'SUBIDA_BAJADA',
          dia,
          mensaje: `${sup.nombre} dia ${dia}: Subida seguida de bajada sin perforacion (S-B)`
        });
      }

      if (actual === ESTADOS.BAJADA && siguiente === ESTADOS.SUBIDA) {
        errores.push({
          tipo: 'BAJADA_SUBIDA',
          dia,
          mensaje: `${sup.nombre} dia ${dia}: Bajada seguida de subida sin descanso (B-S)`
        });
      }
    }
  }

  for (const sup of supervisores) {
    let enPerforacion = false;
    let diasPerforacion = 0;
    let inicioPerforacion = -1;

    for (let dia = 0; dia < diasTotales; dia++) {
      if (sup.secuencia[dia] === ESTADOS.PERFORACION) {
        if (!enPerforacion) {
          enPerforacion = true;
          inicioPerforacion = dia;
          diasPerforacion = 0;
        }
        diasPerforacion++;
      } else {
        if (enPerforacion && diasPerforacion === 1) {
          errores.push({
            tipo: 'PERFORACION_UN_DIA',
            dia: inicioPerforacion,
            mensaje: `${sup.nombre} dia ${inicioPerforacion}: Solo 1 dia de perforacion`
          });
        }
        enPerforacion = false;
        diasPerforacion = 0;
      }
    }
  }

  return errores;
}

export function obtenerDiasConError(cronograma) {
  const { conteoPerforando, s3, diasTotales } = cronograma;
  const diasError = new Set();

  let s3HaPerforado = false;

  for (let dia = 0; dia < diasTotales; dia++) {
    if (s3[dia] === ESTADOS.PERFORACION) {
      s3HaPerforado = true;
    }

    if (conteoPerforando[dia] === 3) {
      diasError.add(dia);
    }

    if (s3HaPerforado && conteoPerforando[dia] !== 2) {
      diasError.add(dia);
    }
  }

  return diasError;
}
