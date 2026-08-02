---
title: "Guía de presentación — logística, demo y preguntas esperadas"
seccion: "meta"
tipo: meta
tags: [hosty, presentacion, guia, demo, defensa]
estado: completo
updated: 2026-08-02
---

# Guía de presentación — logística, demo y preguntas esperadas

Defensa final: **viernes 7 de agosto de 2026**, 20 a 25 minutos, con demo en vivo integrada y
participación de los cinco integrantes.

Esta guía cubre lo transversal: la logística, las reglas de la demo, las preguntas esperables y el
checklist técnico. **El reparto de bloques y lo que dice cada uno** está en
[[Presentacion-Reparto-y-Fichas]]; **el contenido de las slides**, en
[[Presentacion-Estructura-Slides]].

## Qué se está evaluando, en realidad

El criterio implícito de un profesor evaluando esto no es "¿está perfecto?", es **"¿este equipo
controla lo que hizo, o lo está recitando?"**. Por eso esta guía insiste en cómo hablar de lo que
*no* funciona: la ausencia de panel de administración, el ambiente único de Supabase, la falta de
una herramienta de cobertura. Mostrar esos límites con la misma seguridad que los logros es más
convincente que ocultarlos, y elimina de raíz el peor escenario posible, que es que aparezcan en una
pregunta y el equipo se quede sin respuesta.

## Los tres entregables del viernes

| Entregable | Estado | Dónde está |
|---|---|---|
| Presentación impresa | El informe final, listo para imprimir | `documentacion-final-unico/Hosty-Informe-Final.pdf` |
| Código en un pendrive | Instrucciones de armado y revisión | [[Entrega-Pendrive]] |
| Exposición oral de 20–25 min | Guion, reparto y slides | [[Presentacion-Reparto-y-Fichas]] |

## Antes del viernes

El profesor pidió **una presentación previa con él, idealmente lunes, martes o miércoles**. Es la
tarea con mayor prioridad de la semana, porque es la única oportunidad de corregir el rumbo antes
de la instancia que cuenta.

Orden sugerido para la semana:

1. **Lunes o martes:** primer ensayo completo del equipo, cronometrado y de corrido. Ajustar el
   reparto y los tiempos con lo que se aprenda.
2. **Martes o miércoles:** la presentación previa con el profesor. Llevar las slides ya armadas,
   aunque no estén pulidas — una devolución sobre el contenido vale más que sobre el diseño.
3. **Jueves:** aplicar la devolución, imprimir el informe, armar el pendrive y **probarlo en otra
   máquina**.
4. **Viernes:** segundo ensayo corto a la mañana, sólo para los relevos y los tiempos.

## Reglas de la demo en vivo

La demo se reparte entre dos oradores (bloques 3 y 4) y es la parte irremplazable de la
presentación. Cuatro reglas:

1. **Un solo navegador, preparado de antemano.** Las pestañas abiertas antes de empezar, sesión
   iniciada, sin pestañas personales a la vista.
2. **Despacio y narrando.** Decir lo que se va a hacer antes de hacerlo. El impulso natural bajo
   presión es apurarse, y es exactamente lo contrario de lo que conviene.
3. **Las dos cuentas coordinadas.** La reserva que crea Juan Pablo Czurylo en el bloque 3 tiene que
   caer en el panel del anfitrión que muestra Lautaro en el bloque 4. Es el momento más fuerte de
   toda la presentación: los dos lados del producto conectados en vivo. **Verificar antes que la
   cuenta de anfitrión sea la dueña del salón que se va a reservar.**
4. **Plan B activo, no teórico.** Si algo no carga: "lo tenemos capturado", se abre la captura y se
   sigue hablando. Sin disculpas y sin pelearse con la pantalla.

## Preguntas esperables y cómo responderlas

| Pregunta probable | Respuesta sugerida |
|---|---|
| "¿Esto está en producción?" | Sí: desplegado en AWS S3 + CloudFront, con Supabase como backend real. La URL es pública y funciona desde cualquier dispositivo. |
| "¿Tienen ambientes de desarrollo y producción separados?" | No todavía. Hoy hay un único proyecto de Supabase, que el panel etiqueta como `PRODUCTION`. Es una decisión de alcance del MVP y está en el roadmap de mediano plazo. No lo nieguen si preguntan directamente. |
| "¿Todos los tests pasan?" | Sí: 73 de 73 en Vitest y 111 de 111 en Playwright, sobre 3 navegadores. Vale la pena agregar que hasta hace unos días había 6 fallando, y que dos de ellos resultaron ser un defecto real del producto, no un test viejo. Está documentado en la Tabla 57c del Anexo V. |
| "¿Por qué no tienen backend propio?" | Decisión consciente: velocidad de entrega para un equipo de cinco en unas doce semanas, a cambio de que toda regla de negocio tenga que poder expresarse como política de base de datos. Empezamos con NestJS y migramos a Supabase en el sprint 2. |
| "¿Cómo controlan quién puede modificar qué?" | Políticas RLS de Postgres, que filtran por fila según `auth.uid()`. No hay tabla de roles: ser anfitrión es consecuencia de tener un salón publicado. |
| "¿Y si alguien publica contenido inapropiado?" | Hoy requiere intervención manual sobre la base: no hay panel de administración. Está identificado como hallazgo en el informe y priorizado en el roadmap. |
| "¿Qué falta para que esto sea un producto real?" | Cobro con Mercado Pago, reviews y ratings, ambientes separados y panel de administración. Todo identificado y priorizado, no descubierto ahora. |
| "¿Cómo se repartieron el trabajo?" | Scrum con 5 sprints y tablero en GitHub Projects v2 con 50 issues. Roles: un Product Owner, un Scrum Master y tres desarrolladores, uno con foco en QA. La tabla completa está en [[Presentacion-Reparto-y-Fichas]]. |
| "¿Cómo sé que esas cifras son reales?" | Todas están citadas contra comandos reproducibles (`git log`, `gh issue list`) en el informe. No son estimaciones. |
| "¿Usaron alguna herramienta de asistencia por IA?" | Responder con la verdad y sin incomodidad. Conviene acordar la respuesta entre los cinco **antes** de entrar, para que no haya versiones distintas. Ver la nota de [[Entrega-Pendrive]]. |

## Checklist técnico antes de entrar

- [ ] Notebook cargada **y** cargador en la mochila
- [ ] Conexión a internet probada en el aula, o datos móviles como respaldo
- [ ] Adaptador de video para el proyector, probado con esa notebook
- [ ] Pestaña 1: `https://d1ako6y2uvskg7.cloudfront.net`, con sesión de organizador iniciada
- [ ] Pestaña 2: la misma app con la cuenta de anfitrión, dueña del salón que se va a reservar
- [ ] Pestaña 3: tablero de GitHub Projects (o la captura `f12-tablero-projects.png` como respaldo)
- [ ] Slides abiertas en modo presentación, en una ventana distinta del navegador
- [ ] Notificaciones del sistema silenciadas, y el modo oscuro definido de antemano
- [ ] Informe impreso, encuadernado o anillado
- [ ] Pendrive probado en otra máquina (ver [[Entrega-Pendrive]])
- [ ] Capturas de respaldo a mano: `f37-flujo-reserva.png` y `f35-evidencia-api-postgrest-*.png`

## Qué evitar

- **No leer el informe ni las slides en voz alta.** Son material de respaldo, no el guion.
- **No prometer fechas** para lo diferido.
- **No ponerse a la defensiva** con los tests que fallan ni con el ambiente único de Supabase.
- **No improvisar una respuesta técnica que no se sabe.** "Eso no lo puedo responder con precisión,
  lo tenemos documentado en el Anexo V" es una respuesta perfectamente válida y suena mucho mejor
  que una explicación inventada que se desarma con la repregunta.
- **No dejar que hable siempre el mismo.** El profesor pidió expresamente que hablen los cinco, y
  lo va a estar mirando.

---
[[Presentacion-Reparto-y-Fichas]] · [[Presentacion-Estructura-Slides]] · [[Entrega-Pendrive]] · [[Indice|Índice]]
