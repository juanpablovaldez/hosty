---
title: "Presentación final — reparto de bloques y fichas de apoyo"
seccion: "meta"
tipo: meta
tags: [hosty, presentacion, reparto, fichas, defensa]
estado: completo
updated: 2026-08-02
---

# Presentación final — reparto de bloques y fichas de apoyo

Defensa del **viernes 7 de agosto de 2026**. El profesor pidió expresamente que **hablen los cinco
integrantes**. Este documento define quién habla de qué, con cuánto tiempo, y deja una ficha de
apoyo por persona.

**Cómo usarlo:** imprimir el documento y que cada uno se quede con su ficha. Las fichas están
pensadas para mirar de reojo, no para leer: son datos y anclas, no un texto para recitar.

## Reparto de bloques

El criterio de asignación es el rol de cada uno en el equipo y el área del producto donde
efectivamente concentró su trabajo, verificable en el historial del repositorio (Tabla 11 y Tabla
12 del informe). Nadie explica una parte que no construyó.

| # | Bloque | Orador | Duración | Slides |
|---|---|---|---|---|
| 1 | Apertura: idea, problema y qué decidimos construir | Juan Pablo Valdez | 3:30 | 1–7 |
| 2 | Proceso: Scrum, sprints y evolución del proyecto | Juan Ignacio Mignone | 3:30 | 8–11 |
| 3 | **Demo en vivo:** buscar salones y reservar | Juan Pablo Czurylo | 5:00 | 12 |
| 4 | **Demo en vivo:** publicar un salón y gestionar reservas | Lautaro Martinez Naglieri | 4:00 | 13 |
| 5 | Arquitectura y tecnologías | Juan Pablo Valdez | 3:30 | 14–17 |
| 6 | Calidad: testing, automatización y CI/CD | Benjamín Garma | 3:30 | 18–19 |
| 7 | Cierre y roadmap | Juan Ignacio Mignone | 1:00 | 20–21 |

**Total: 24 minutos**, dentro de la ventana de 20 a 25 que pidió el profesor, con un minuto de
margen. Las preguntas van después y no cuentan.

Juan Pablo Valdez y Juan Ignacio Mignone hablan dos veces porque son quienes sostienen los dos
hilos que atraviesan toda la presentación —la visión de producto y el proceso—, y porque cortar sus
bloques en dos apariciones cortas mantiene mejor el ritmo que un único bloque largo al principio.

## Qué hizo cada uno en el proyecto

Esta tabla es la respuesta a "¿cómo se repartieron el trabajo?", que es una pregunta casi segura.
Conviene que todos la tengan clara, no sólo el que la responda.

| Integrante | Legajo | Rol en el equipo | Dónde concentró su trabajo | Commits |
|---|---|---|---|---|
| Juan Pablo Valdez | UIA7 0262 | Product Owner | Arquitectura general, catálogo de salones, panel del anfitrión, flujo de reserva y autenticación | 140 (59,3 %) |
| Juan Ignacio Mignone | UIA7 0298 | Scrum Master | Catálogo de salones, página de inicio, panel del anfitrión y favoritos | 45 (19,1 %) |
| Lautaro Martinez Naglieri | UIA7 0286 | Desarrollador | Catálogo de salones, panel del anfitrión y flujo de reserva | 33 (14,0 %) |
| Benjamín Garma | UIA7 0362 | Desarrollador con foco en QA | Infraestructura de pruebas (Vitest, Playwright, Cypress) y el workflow de CI `frontend-tests.yml` | 10 (4,2 %) |
| Juan Pablo Czurylo | UIA7 0331 | Desarrollador | Búsqueda de salones, flujo de reserva y notificaciones por email | 8 (3,4 %) |

Las cifras son las de la Tabla 12 del informe, consolidando las 9 identidades Git en 5 personas.

Si preguntan por la diferencia de volumen entre integrantes, la respuesta honesta y suficiente es
que el conteo de commits mide actividad en el repositorio, no esfuerzo: el trabajo de diseño, de
gestión del tablero y de definición de criterios de aceptación no deja commits, y las tareas de
infraestructura de pruebas concentran mucho trabajo en pocos archivos.

---

# Fichas de apoyo individuales

---

## Ficha 1 — Juan Pablo Valdez (Product Owner)

**Tus bloques: 1 (apertura, 3:30) y 5 (arquitectura, 3:30). Slides 1–7 y 14–17.**

### Bloque 1 — Apertura

Abrís la presentación. Presentás al equipo en una frase y arrancás.

**El arco a recorrer, en orden:**

1. **Qué es Hosty** — "un marketplace para encontrar y reservar salones de eventos en Tucumán".
   Una frase, sin rodeos.
2. **Cómo surge la idea** — de un problema concreto y cotidiano: conseguir un salón hoy se hace por
   boca a boca, Instagram y WhatsApp. No existe un lugar donde ver la oferta junta.
3. **El problema** — quien organiza no puede comparar precio, capacidad ni disponibilidad sin
   escribirle a cada salón uno por uno; el dueño del salón no tiene vidriera y atiende consultas
   repetidas a mano.
4. **Qué decidimos construir** — las tres capacidades del MVP: catálogo con filtros y mapa, reserva
   en tres pasos, panel del anfitrión.
5. **Qué dejamos afuera y por qué** — esto decilo vos, no esperes a que lo pregunten. Mercado Pago
   (issue #45), reviews y ratings (#33, marcado `post-mvp` desde el inicio) y panel de
   administración quedaron fuera del alcance del MVP por una decisión de alcance académico, no por
   falta de tiempo.

**Cerrás pasándole la palabra a Nacho:** "para contar cómo lo organizamos, Nacho".

### Bloque 5 — Arquitectura y tecnologías

**Las tres cosas que sí o sí tenés que dejar dichas:**

1. **No hay backend propio.** Supabase como *backend as a service*: Postgres, autenticación y
   almacenamiento gestionados. La razón concreta: permitió a un equipo de cinco entregar
   autenticación, persistencia y control de acceso en unas doce semanas sin escribir ni operar un
   servidor. Lo que cedimos a cambio: toda regla de negocio tiene que poder expresarse como
   política de base de datos.
2. **La autorización es por propiedad, no por roles.** Las políticas RLS de Postgres deciden qué
   fila puede ver o editar cada usuario según `auth.uid()`. Ser anfitrión no es un permiso que
   alguien otorga: es la consecuencia de tener al menos un salón publicado.
3. **El costo de esa decisión, dicho por vos.** Hoy no hay un perfil de administrador funcional:
   moderar un salón requiere intervención manual sobre la base. Está documentado como hallazgo en
   el informe, no escondido.

**Stack, si lo piden con nombre y versión:** React 19 + Vite + TypeScript estricto · Tailwind CSS v4
con tokens de marca · shadcn/ui · TanStack Router (rutas por archivo), Query v5 y Form · Zustand ·
Supabase (Postgres, Auth, Storage) · despliegue en AWS S3 + CloudFront provisionado con Terraform.

**Datos duros de tu bloque:** 14 rutas, 8 de ellas protegidas · 6 tablas en el esquema `public` · 10
archivos de migración · 4 estados de reserva (`pending`, `confirmed`, `declined`, `cancelled`).

**Cerrás pasándole la palabra a Benjamín:** "y cómo verificamos que todo esto funciona, Benja".

---

## Ficha 2 — Juan Ignacio Mignone (Scrum Master)

**Tus bloques: 2 (proceso, 3:30) y 7 (cierre, 1:00). Slides 8–11 y 20–21.**

### Bloque 2 — Proceso

**El arco:**

1. **Cómo trabajamos** — Scrum, con tablero en GitHub Projects v2 (board #4). Sprints con
   planificación, revisión y retrospectiva.
2. **Los cinco sprints** — no los leas uno por uno de la slide. Contá el arco: arrancamos por la
   base y la home (S1), seguimos con el catálogo y los filtros (S2), autenticación e imágenes (S3),
   panel del anfitrión y reservas (S4), y cerramos con plan destacado, geolocalización y favoritos
   (S5).
3. **La decisión que cambió el proyecto** — en el sprint 2 migramos de un backend propio en NestJS
   a Supabase (commit `3a89616`). Vale la pena nombrarla: muestra que el equipo corrigió el rumbo a
   tiempo en vez de sostener una decisión mala por inercia.
4. **Dónde llegamos** — 45 de 50 issues cerradas (90 %), 181 commits en la rama de trabajo, 26 pull
   requests mergeados, ~12,6 semanas.

**Si preguntan por las 5 issues abiertas:** están todas justificadas — Mercado Pago fuera de alcance
académico, reviews marcado `post-mvp` desde el inicio, auditoría de performance como mejora
posterior. No es trabajo abandonado, es alcance decidido.

**Cerrás pasándole la palabra a Juan Pablo Czurylo:** "y ahora lo mejor, verlo funcionando".

### Bloque 7 — Cierre

Un minuto, tres cosas y nada más:

1. **Corto plazo:** resolver la deuda técnica identificada (cobertura de código, unificar el gestor
   de paquetes).
2. **Mediano plazo:** integrar Mercado Pago, activar la internacionalización que ya está montada
   pero sin usar, y separar los ambientes de *staging* y producción.
3. **Largo plazo:** reviews y ratings, panel de administración, y expansión a otras provincias.

**Frase de cierre:** "Hosty conecta a quien organiza un evento con el salón indicado, en un solo
lugar. Gracias." Y quedate callado — el silencio después del cierre invita a las preguntas.

**No prometas fechas** para nada de lo diferido.

---

## Ficha 3 — Juan Pablo Czurylo (Desarrollador)

**Tu bloque: 3 (demo — buscar y reservar, 5:00). Slide separadora 12, después navegador.**

Tenés el bloque más importante de la presentación. Un producto real funcionando convence más que
cualquier slide. Trabajaste en la búsqueda y en el flujo de reserva, así que estás explicando lo que
construiste.

### El recorrido, paso a paso

1. **Abrir la home** — mostrar el buscador, los chips de tipo de evento y los salones destacados.
2. **Ir a `/salones`** — mostrar los filtros funcionando: zona, capacidad, precio y servicios.
   Cambiá un filtro en vivo y que se vea cómo se actualizan los resultados.
3. **Mostrar el mapa** — los salones están geolocalizados, no son un listado plano.
4. **Entrar al detalle de un salón** — por ejemplo "Villa Eventos Tafí".
5. **Click en "Reservar"** y completar el asistente de tres pasos, hablando mientras lo hacés:
   - **Paso 1 — fecha y horario.** Mencioná que valida el mínimo de horas que configuró el dueño
     del salón y que los horarios van en intervalos de 30 minutos.
   - **Paso 2 — tipo de evento, cantidad de asistentes y datos de contacto.** Acá hay algo que vale
     la pena mostrar: si ponés más asistentes que la capacidad del salón, el formulario avisa con un
     mensaje propio, en español, que dice la capacidad real. **Hacelo a propósito** — es una
     validación que ajustamos esta semana y muestra cuidado por el detalle.
   - **Paso 3 — confirmación** con el precio calculado automáticamente.
6. **Confirmar la reserva** y mostrar que aparece en "Mis Reservas".

### Anclas por si te preguntan

- **"¿El precio de dónde sale?"** — del precio por hora del salón y la duración real seleccionada,
  más los servicios extra elegidos. Es lógica real, no un valor fijo de prueba.
- **"¿Esto queda guardado?"** — sí, en Postgres sobre Supabase. Se puede mostrar en "Mis Reservas" y,
  si insisten, en el panel del anfitrión que muestra Lautaro a continuación.
- **"¿Y si el salón no está disponible ese día?"** — el anfitrión puede bloquear fechas y el
  asistente no deja avanzar sobre una fecha bloqueada.

### Reglas de la demo

- **Andá despacio.** El impulso natural es apurarse. Cada click tiene que verse.
- **Narrá lo que hacés** antes de hacerlo: "ahora voy a filtrar por zona".
- **Si algo falla, no te pelees con la pantalla.** Decí "lo tenemos capturado" y pasá a
  `assets/f37-flujo-reserva.png`, que muestra los tres pasos. Seguí hablando.

**Cerrás pasándole la palabra a Lautaro:** "eso del lado de quien organiza; Lautaro va a mostrar el
otro lado, el del dueño del salón".

---

## Ficha 4 — Lautaro Martinez Naglieri (Desarrollador)

**Tu bloque: 4 (demo — publicar y gestionar, 4:00). Slide separadora 13, después navegador.**

Mostrás el lado del anfitrión. Trabajaste en el panel y en el flujo de reserva, así que estás
explicando lo que construiste.

### El recorrido, paso a paso

1. **Entrar al panel del anfitrión** — mostrar el resumen: reservas pendientes, salones publicados.
2. **La reserva que acaba de crear Juan Pablo** — abrila y mostrá que llegó. Esto es lo que más
   impresiona: los dos lados conectados en vivo, delante del profesor. **Coordinen antes que la
   cuenta de anfitrión sea dueña del salón que él va a reservar.**
3. **Gestionar la reserva** — aceptarla o rechazarla desde el panel, y mostrar que el estado cambia.
4. **La vista de calendario** — las reservas del mes, con los estados diferenciados por color.
5. **Publicar un salón nuevo** — abrí el asistente de cuatro pasos. No hace falta completarlo
   entero: con los dos primeros pasos alcanza para mostrar que el catálogo no es data cargada a
   mano, que cualquier usuario autenticado puede publicar.
6. **Mencionar el plan "Destacado"** — mejora la posición del salón en el catálogo. Nombralo aunque
   no lo demuestres, si el tiempo aprieta.

### Anclas por si te preguntan

- **"¿Cualquiera puede publicar un salón?"** — sí, cualquier usuario autenticado. Ser anfitrión no
  es un permiso que otorga un administrador: es consecuencia de publicar. Es la decisión de diseño
  que explicó Juan Pablo.
- **"¿Y si alguien publica algo inapropiado?"** — hoy requiere intervención manual sobre la base. No
  hay panel de administración todavía; está identificado y en el roadmap. **Decilo sin rodeos** —
  reconocer un límite conocido suma más que improvisar una respuesta.
- **"¿Las imágenes dónde se guardan?"** — en Supabase Storage, en el bucket `salon-images`.

### Reglas de la demo

Las mismas que las de Juan Pablo: despacio, narrando, y con plan B si algo no carga.

**Cerrás pasándole la palabra a Juan Pablo Valdez:** "así funciona por fuera; Juan Pablo va a contar
cómo está construido por dentro".

---

## Ficha 5 — Benjamín Garma (Desarrollador con foco en QA)

**Tu bloque: 6 (calidad y automatización, 3:30). Slides 18–19.**

Montaste la infraestructura de pruebas del proyecto y el workflow de integración continua. Este
bloque es el que más diferencia a un equipo que controla lo que hizo de uno que sólo lo entregó.

### El arco

1. **Cómo pensamos las pruebas** — una pirámide: muchas pruebas unitarias rápidas en la base,
   pruebas de componente en el medio, y unas pocas de punta a punta arriba, que son las caras y
   lentas pero las que prueban que el flujo completo funciona.
2. **Con qué las corremos** — Vitest para unitarias y de componente, con Testing Library y jsdom
   para renderizar componentes React sin navegador. Playwright para las de punta a punta, que abren
   un navegador real contra la aplicación desplegada.
3. **Los números** — **73 casos de Vitest en 14 archivos, todos en verde**, más 5 especificaciones
   de Playwright que corren sobre tres navegadores.
4. **La automatización** — cada *pull request* dispara el workflow `frontend-tests.yml`, que corre
   la suite de Vitest. Si falla, el PR no se mergea. Al mergear a `dev`, el workflow `web-dev.yml`
   construye la aplicación y la publica en S3 + CloudFront. Hay un tercer workflow, `infra-ci.yml`,
   que valida la infraestructura en Terraform.
5. **Análisis estático** — TypeScript en modo estricto y ESLint sin errores. No es una prueba, pero
   atrapa una clase entera de defectos antes de que lleguen a ejecutarse.

### La historia que más conviene contar

Hoy la suite está **73 de 73 en Vitest y 111 de 111 en Playwright**, sobre tres navegadores. Pero lo
que vale la pena contar no es el número final, sino cómo se llegó: hasta la semana pasada había
**6 casos fallando**, y en una primera lectura los habíamos clasificado a todos como pruebas
desactualizadas frente a cambios de interfaz.

Al reproducirlos uno por uno resultó que **cuatro sí eran localizadores mal escritos** —un control
que el test buscaba por el rol `button` cuando en realidad se renderiza como enlace, un selector que
agarraba el desplegable equivocado— **pero dos estaban señalando un defecto real del producto**: los
formularios de login y registro no desactivaban la validación nativa del navegador, así que el
navegador interceptaba el envío y mostraba su propio cartel, en su idioma, y el mensaje en español
de la aplicación nunca se veía. Lo corregimos, y los tests pasaron a verde solos.

Esa es la mejor respuesta posible a "¿para qué sirven las pruebas automatizadas?": si hubiéramos
dado por buena la primera clasificación y descartado los seis casos como tests viejos, el defecto
seguiría en el producto. Está documentado en la Tabla 57c del Anexo V.

### Lo que también conviene nombrar

- **Lo que falta:** no tenemos todavía una herramienta de cobertura de líneas configurada. Está
  identificado y priorizado como primera línea del roadmap de corto plazo. La relación entre líneas
  de prueba y líneas de producción es de aproximadamente 13 %.
- **Un defecto real que encontramos y corregimos:** la restricción de la base de datos sobre el
  estado de las reservas sólo admitía tres estados, mientras la aplicación ya emitía un cuarto,
  `declined`. Se detectó, se corrigió con una migración y se verificó. Está en el informe con el
  ciclo completo.

**Cerrás pasándole la palabra a Nacho:** "y para cerrar, hacia dónde va Hosty".

---

## Ensayo: qué hacer antes del viernes

El profesor pidió una presentación previa con él, idealmente lunes, martes o miércoles. Antes de
esa reunión conviene haber hecho **al menos un ensayo completo, cronometrado y de corrido**, con la
demo en vivo incluida y sin frenar a corregir.

Tres cosas que sólo aparecen al ensayar y nunca al leer:

1. **Los relevos.** El cambio de orador es donde se pierde el hilo. Practiquen la frase de traspaso.
2. **El tiempo real de la demo.** Siempre lleva más de lo que uno calcula. Si el bloque 3 se pasa
   de 5 minutos, hay que recortar el recorrido, no acelerarlo.
3. **Quién maneja la computadora.** Definanlo de antemano: lo más simple es que cada uno maneje
   durante su propio bloque y que el cambio de operador coincida con el cambio de orador.

---
[[Presentacion-Estructura-Slides]] · [[Guia-de-Presentacion]] · [[Indice|Índice]]
