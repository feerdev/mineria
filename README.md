# Cronograma de Supervisores

Sistema de planificacion de turnos para perforacion minera con 3 supervisores.

## Descripcion

Esta aplicacion genera cronogramas de trabajo para 3 supervisores (S1, S2, S3) en operaciones de perforacion minera, garantizando que siempre haya exactamente 2 supervisores perforando simultaneamente una vez que el sistema esta en regimen.

## Reglas del Sistema

### Estados de un Supervisor

| Estado | Codigo | Descripcion |
|--------|--------|-------------|
| Subida | S | Dia de llegada al sitio |
| Induccion | I | Dias de capacitacion inicial |
| Perforacion | P | Dias de trabajo activo |
| Bajada | B | Dia de salida del sitio |
| Descanso | D | Dias de descanso fuera del sitio |

### Ciclo de Trabajo

Cada supervisor sigue un ciclo repetitivo:

```
S -> I (solo primer ciclo) -> P -> B -> D -> S -> P -> B -> D -> ...
```

**Primer ciclo:**
- 1 dia de Subida (S)
- N dias de Induccion (I) - solo la primera vez
- (diasTrabajo - diasInduccion) dias de Perforacion (P)
- 1 dia de Bajada (B)
- (diasDescanso - 2) dias de Descanso (D)

**Ciclos siguientes:**
- 1 dia de Subida (S)
- diasTrabajo dias de Perforacion (P)
- 1 dia de Bajada (B)
- (diasDescanso - 2) dias de Descanso (D)

### Regla Principal

**Siempre deben haber exactamente 2 supervisores perforando** una vez que S3 comienza a perforar.

### Comportamiento de cada Supervisor

- **S1**: Ciclo fijo, comienza el dia 0
- **S3**: Entra calculado para comenzar a perforar cuando S1 baja por primera vez
- **S2**: Se adapta dinamicamente para mantener siempre 2 perforando

### Formula de Entrada de S3

```
diaEntradaS3 = primeraBajadaS1 - diasInduccion - 1
```

## Parametros de Configuracion

| Parametro | Descripcion | Ejemplo |
|-----------|-------------|---------|
| Dias de trabajo | Dias consecutivos en sitio | 14 |
| Dias de descanso | Dias consecutivos fuera | 7 |
| Dias de induccion | Dias de capacitacion inicial | 5 |
| Dias de perforacion | Total dias que S1 debe perforar | 90 |

### Ejemplos de Regimenes

| Regimen | Trabajo | Descanso | Ciclo Total |
|---------|---------|----------|-------------|
| 14x7 | 14 dias | 7 dias | 21 dias |
| 21x7 | 21 dias | 7 dias | 28 dias |
| 10x5 | 10 dias | 5 dias | 15 dias |
| 14x6 | 14 dias | 6 dias | 20 dias |

## Validaciones

El sistema valida automaticamente:

1. **Cobertura minima**: Nunca menos de 2 perforando (despues de que S3 inicia)
2. **Cobertura maxima**: Nunca mas de 2 perforando
3. **Transiciones validas**: No permite secuencias invalidas como S->S o B->S

## Uso

1. Ingresar los parametros de configuracion
2. Hacer clic en "Calcular Cronograma"
3. Navegar por las paginas del cronograma (organizadas por ciclo)
4. Verificar el indicador de validacion

## Tecnologias

- React 18
- JavaScript ES6+
- CSS3

## Instalacion

```bash
npm install
npm start
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Genera la version de produccion
- `npm test` - Ejecuta las pruebas

## Licencia

MIT
