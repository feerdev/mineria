const ESTADOS = {
  SUBIDA: 'S',
  INDUCCION: 'I',
  PERFORACION: 'P',
  BAJADA: 'B',
  DESCANSO: 'D',
  VACIO: '-'
};

function contarPerforando(s1, s2, s3) {
  let count = 0;
  if (s1 === ESTADOS.PERFORACION) count++;
  if (s2 === ESTADOS.PERFORACION) count++;
  if (s3 === ESTADOS.PERFORACION) count++;
  return count;
}

function generarSecuenciaNormal(diaInicio, diasTrabajo, diasDescanso, diasInduccion, totalDias) {
  const secuencia = [];

  for (let i = 0; i < diaInicio; i++) {
    secuencia.push(ESTADOS.VACIO);
  }

  let primerCiclo = true;

  while (secuencia.length < totalDias) {
    secuencia.push(ESTADOS.SUBIDA);

    if (primerCiclo) {
      for (let i = 0; i < diasInduccion; i++) {
        secuencia.push(ESTADOS.INDUCCION);
      }
    }

    const diasPerf = primerCiclo ? diasTrabajo - diasInduccion : diasTrabajo;
    for (let i = 0; i < diasPerf; i++) {
      secuencia.push(ESTADOS.PERFORACION);
    }

    secuencia.push(ESTADOS.BAJADA);

    for (let i = 0; i < diasDescanso - 2; i++) {
      secuencia.push(ESTADOS.DESCANSO);
    }

    primerCiclo = false;
  }

  return secuencia.slice(0, totalDias);
}

function calcularRequerimientos(s1, s3, totalDias) {
  const diaS3Activo = s3.findIndex(e => e === ESTADOS.PERFORACION);
  const requerido = new Array(totalDias).fill('F');

  for (let i = 0; i < totalDias; i++) {
    if (diaS3Activo !== -1 && i >= diaS3Activo) {
      const s1P = s1[i] === ESTADOS.PERFORACION;
      const s3P = s3[i] === ESTADOS.PERFORACION;
      requerido[i] = (s1P && s3P) ? 'X' : 'P';
    }
  }

  return { requerido, diaS3Activo };
}

function encontrarVentanasX(requerido, totalDias) {
  const ventanas = [];
  let inicio = -1;

  for (let i = 0; i < totalDias; i++) {
    if (requerido[i] === 'X') {
      if (inicio === -1) inicio = i;
    } else {
      if (inicio !== -1) {
        ventanas.push({ inicio, fin: i - 1, longitud: i - inicio });
        inicio = -1;
      }
    }
  }

  if (inicio !== -1) {
    ventanas.push({ inicio, fin: totalDias - 1, longitud: totalDias - inicio });
  }

  return ventanas;
}

function construirS2Adaptativo(s1, s3, diasTrabajo, diasDescanso, diasInduccion, totalDias) {
  const s2 = new Array(totalDias).fill(null);
  const { requerido } = calcularRequerimientos(s1, s3, totalDias);
  const ventanasX = encontrarVentanasX(requerido, totalDias);

  s2[0] = ESTADOS.SUBIDA;
  for (let i = 1; i <= diasInduccion && i < totalDias; i++) {
    s2[i] = ESTADOS.INDUCCION;
  }

  for (let dia = diasInduccion + 1; dia < totalDias; dia++) {
    const prev = s2[dia - 1];
    const req = requerido[dia];

    if (prev === ESTADOS.SUBIDA || prev === ESTADOS.INDUCCION) {
      s2[dia] = ESTADOS.PERFORACION;
      continue;
    }

    if (prev === ESTADOS.BAJADA) {
      if (req === 'P') {
        s2[dia] = ESTADOS.PERFORACION;
      } else {
        s2[dia] = ESTADOS.DESCANSO;
      }
      continue;
    }

    if (prev === ESTADOS.DESCANSO) {
      if (req === 'P') {
        s2[dia] = ESTADOS.PERFORACION;
        continue;
      }

      const ventanaActual = ventanasX.find(v => dia >= v.inicio && dia <= v.fin);

      if (ventanaActual) {
        const diasHastaFin = ventanaActual.fin - dia;
        if (diasHastaFin <= 0) {
          s2[dia] = ESTADOS.SUBIDA;
        } else {
          s2[dia] = ESTADOS.DESCANSO;
        }
      } else {
        s2[dia] = ESTADOS.SUBIDA;
      }
      continue;
    }

    if (prev === ESTADOS.PERFORACION) {
      if (req === 'P') {
        s2[dia] = ESTADOS.PERFORACION;
        continue;
      }

      if (req === 'X') {
        const ventanaActual = ventanasX.find(v => dia >= v.inicio && dia <= v.fin);

        if (ventanaActual) {
          s2[dia] = ESTADOS.BAJADA;
        } else {
          s2[dia] = ESTADOS.PERFORACION;
        }
        continue;
      }

      s2[dia] = ESTADOS.PERFORACION;
      continue;
    }

    s2[dia] = ESTADOS.PERFORACION;
  }

  for (let i = 0; i < totalDias; i++) {
    if (s2[i] === null) s2[i] = ESTADOS.PERFORACION;
  }

  corregirYForzarCobertura(s2, s1, s3, requerido, ventanasX, totalDias);

  return s2;
}

function corregirYForzarCobertura(s2, s1, s3, requerido, ventanasX, totalDias) {
  const diaS3Activo = s3.findIndex(e => e === ESTADOS.PERFORACION);

  for (let iter = 0; iter < 500; iter++) {
    let cambios = false;

    for (let i = Math.max(1, diaS3Activo); i < totalDias; i++) {
      const s1P = s1[i] === ESTADOS.PERFORACION;
      const s3P = s3[i] === ESTADOS.PERFORACION;
      const s2P = s2[i] === ESTADOS.PERFORACION;
      const total = (s1P ? 1 : 0) + (s2P ? 1 : 0) + (s3P ? 1 : 0);

      if (total < 2 && !s2P) {
        let encontrado = false;
        for (let j = i; j >= Math.max(0, i - 30); j--) {
          if (s2[j] === ESTADOS.BAJADA) {
            s2[j] = ESTADOS.PERFORACION;
            for (let k = j + 1; k <= i; k++) {
              s2[k] = ESTADOS.PERFORACION;
            }
            encontrado = true;
            cambios = true;
            break;
          }
          if (s2[j] === ESTADOS.DESCANSO) {
            s2[j] = ESTADOS.SUBIDA;
            for (let k = j + 1; k <= i; k++) {
              s2[k] = ESTADOS.PERFORACION;
            }
            encontrado = true;
            cambios = true;
            break;
          }
          if (s2[j] === ESTADOS.PERFORACION) {
            for (let k = j + 1; k <= i; k++) {
              s2[k] = ESTADOS.PERFORACION;
            }
            encontrado = true;
            cambios = true;
            break;
          }
        }
        if (!encontrado && i > 0) {
          s2[i] = ESTADOS.PERFORACION;
          cambios = true;
        }
      }
    }

    for (let i = 1; i < totalDias; i++) {
      const prev = s2[i - 1];
      const curr = s2[i];

      const s1P = s1[i] === ESTADOS.PERFORACION;
      const s3P = s3[i] === ESTADOS.PERFORACION;
      const necesitaCobertura = diaS3Activo !== -1 && i >= diaS3Activo && (s1P ? 1 : 0) + (s3P ? 1 : 0) < 2;

      if (curr === ESTADOS.PERFORACION &&
          prev !== ESTADOS.SUBIDA &&
          prev !== ESTADOS.INDUCCION &&
          prev !== ESTADOS.PERFORACION &&
          prev !== ESTADOS.DESCANSO &&
          prev !== ESTADOS.BAJADA) {
      }

      if (prev === ESTADOS.BAJADA && curr !== ESTADOS.DESCANSO && curr !== ESTADOS.PERFORACION && !necesitaCobertura) {
        s2[i] = ESTADOS.DESCANSO;
        cambios = true;
      }

      if (prev === ESTADOS.SUBIDA && curr !== ESTADOS.PERFORACION && curr !== ESTADOS.INDUCCION) {
        s2[i] = ESTADOS.PERFORACION;
        cambios = true;
      }

      if (prev === ESTADOS.SUBIDA && curr === ESTADOS.SUBIDA) {
        s2[i] = ESTADOS.PERFORACION;
        cambios = true;
      }

      if (prev === ESTADOS.BAJADA && curr === ESTADOS.BAJADA) {
        s2[i] = ESTADOS.DESCANSO;
        cambios = true;
      }
    }

    for (let i = Math.max(1, diaS3Activo); i < totalDias; i++) {
      const s1P = s1[i] === ESTADOS.PERFORACION;
      const s3P = s3[i] === ESTADOS.PERFORACION;
      const s2P = s2[i] === ESTADOS.PERFORACION;
      const total = (s1P ? 1 : 0) + (s2P ? 1 : 0) + (s3P ? 1 : 0);

      if (total > 2 && s2P && requerido[i] === 'X') {
        const prev = i > 0 ? s2[i - 1] : null;

        if (prev === ESTADOS.PERFORACION) {
          const ventana = ventanasX.find(v => i >= v.inicio && i <= v.fin);
          if (ventana) {
            s2[i] = ESTADOS.BAJADA;
            cambios = true;
          }
        }
      }
    }

    if (!cambios) break;
  }
}

export function calcularCronograma(diasTrabajo, diasDescanso, diasInduccion, diasPerforacionRequeridos) {
  const cicloCompleto = diasTrabajo + diasDescanso;
  const totalDias = Math.ceil(diasPerforacionRequeridos * 2) + cicloCompleto * 5;

  const s1 = generarSecuenciaNormal(0, diasTrabajo, diasDescanso, diasInduccion, totalDias);

  const primeraBajadaS1 = s1.findIndex(e => e === ESTADOS.BAJADA);
  const diaInicioS3 = primeraBajadaS1 - diasInduccion - 1;

  const s3 = generarSecuenciaNormal(
    Math.max(0, diaInicioS3),
    diasTrabajo,
    diasDescanso,
    diasInduccion,
    totalDias
  );

  const s2 = construirS2Adaptativo(s1, s3, diasTrabajo, diasDescanso, diasInduccion, totalDias);

  const diasFinales = diasPerforacionRequeridos;

  const conteoPerforando = [];
  for (let i = 0; i < diasFinales; i++) {
    conteoPerforando.push(contarPerforando(s1[i], s2[i], s3[i]));
  }

  return {
    s1: s1.slice(0, diasFinales),
    s2: s2.slice(0, diasFinales),
    s3: s3.slice(0, diasFinales),
    conteoPerforando,
    diasTotales: diasFinales
  };
}

export { ESTADOS };
