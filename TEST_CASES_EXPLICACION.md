# Test Cases — Hosty | Final Testeo Automatizado

Proyecto: **Hosty** — marketplace de salones en Tucumán.
Herramientas: **Vitest + Testing Library** (unit/integración) · **Katalon Studio** (E2E)

---

## Conceptos clave para explicar

### ¿Qué es un test unitario?
Prueba **una sola función o componente en total aislamiento**. No depende de la red, ni de la base de datos, ni de otros módulos. Si falla, el error está exactamente en la unidad que estamos probando. Son los tests más rápidos de correr y los más fáciles de mantener.

> **Cómo explicarlo al profesor**: "Un test unitario prueba una función pura, sola, sin dependencias externas. Yo le doy una entrada, me devuelve una salida, y verifico que sea la esperada. No hay red, no hay base de datos."

---

### ¿Qué es un test de integración?
Prueba **cómo dos o más módulos trabajan juntos**. A diferencia del unitario, no aísla completamente; integra componentes reales (hooks, stores, cache). Solo se mockea la frontera externa (Supabase/red) para no depender de internet.

> **Cómo explicarlo al profesor**: "El test de integración verifica que la comunicación entre partes del sistema funciona. Por ejemplo, que cuando un hook llama a Supabase y recibe una respuesta, la caché de la aplicación se actualiza correctamente. Mockeo solo la red, el resto es código real."

---

### ¿Qué es un test End-to-End (E2E)?
Simula **a un usuario real usando la aplicación** desde el navegador. Abre el browser, navega, hace clicks, escribe texto, y verifica lo que aparece en pantalla. Prueba toda la cadena: UI → lógica → servidor → base de datos.

> **Cómo explicarlo al profesor**: "El test E2E actúa como si yo fuera un usuario. Katalon abre Chrome, va a la página de login, ingresa el email y la contraseña, hace click en el botón, y verifica que la aplicación lo llevó al lugar correcto. Prueba todo junto."

---

## Test Cases Unitarios

### TC-U01 | `salonPriceDisplay`
**Archivo**: `frontend/src/test/unit/pricing.test.ts`
**Función testeada**: `salonPriceDisplay` en `frontend/src/features/salones/lib/pricing.ts`

#### Qué hace la función
Recibe los datos de precio de un salón (`priceType`, `pricePerHour`, `priceMin`, `priceMax`) y devuelve un objeto con tres campos para mostrar en pantalla:
- `label`: texto secundario ("desde", "estimado")
- `main`: el precio principal ("$ 15.000" o "A consultar")
- `suffix`: texto al final ("/ hora")

#### Por qué elegí esta función para test unitario
Es una **función pura**: dada la misma entrada, siempre devuelve la misma salida. No llama a ningún servicio externo, no modifica estado. Tiene 5 ramas distintas según el tipo de precio, lo que la hace ideal para demostrar cobertura de casos.

#### Los dos test cases

**Caso 1 — `on_request`**
```
Entrada: priceType: 'on_request', todos los precios en null
Resultado esperado: { main: 'A consultar', label: null, suffix: null }
```
Verifica que cuando el host no quiere mostrar precio, la función devuelve el texto correcto y sin etiquetas.

**Caso 2 — `fixed` con precio por hora**
```
Entrada: priceType: 'fixed', pricePerHour: 15000
Resultado esperado: { label: 'desde', main: '$ 15.000', suffix: '/ hora' }
```
Verifica que el precio se formatea en pesos argentinos y que se añaden las etiquetas correctas.

#### Vocabulario para la oral
- "Función pura" → no tiene efectos secundarios, no depende de estado externo
- "Cobertura de ramas" → estoy testeando distintos `if/else` dentro de la función
- "Assertion" → el `expect(result.main).toBe(...)` que verifica el resultado

---

### TC-U02 | `effectivePrice` y `formatBookingPrice`
**Archivo**: `frontend/src/test/unit/booking-status.test.ts`
**Funciones testeadas**: en `frontend/src/features/host/lib/booking-status.ts`

#### Qué hacen las funciones
El sistema de reservas tiene dos tipos de precio:
- `totalPrice`: precio que calculó el sistema automáticamente
- `quotedPrice`: precio personalizado que el host le dio al cliente manualmente (tiene prioridad)

`effectivePrice` decide cuál precio usar. `formatBookingPrice` lo convierte a texto ("$ 7.500" o "A consultar").

#### Por qué elegí estas funciones para test unitario
Contienen lógica de negocio crítica: **determinar qué precio se le muestra al cliente en su reserva**. Si esta lógica falla, el cliente ve un precio incorrecto. Son funciones puras, sin dependencias externas.

#### Los dos test cases

**Caso 1 — `quotedPrice` tiene prioridad**
```
Entrada: totalPrice: 5000, quotedPrice: 7500
Resultado esperado: 7500
```
Verifica que cuando el host cotizó manualmente, ese precio es el que se usa, ignorando el automático.

**Caso 2 — fallback a "A consultar"**
```
Entrada: totalPrice: null, quotedPrice: null
Resultado esperado: 'A consultar'
```
Verifica que cuando no hay ningún precio disponible, el sistema muestra el texto apropiado en lugar de crashear o mostrar "null".

#### Vocabulario para la oral
- "Lógica de negocio" → regla del dominio (en este caso, qué precio mostrar y por qué)
- "Caso borde" → el caso donde ambos son null, que podría fallar si no se maneja
- "Operador nullish coalescing (`??`)" → `quotedPrice ?? totalPrice` devuelve el primero que no sea null/undefined

---

## Test Cases de Integración

### TC-I01 | `useToggleFavorite` (hook con optimistic update)
**Archivo**: `frontend/src/test/integration/useToggleFavorite.test.tsx`
**Módulo testeado**: `frontend/src/features/favorites/api/favorites.mutations.ts`

#### Qué hace el hook
Es un hook de React Query que maneja agregar/quitar favoritos. Implementa **optimistic update**: actualiza la interfaz de usuario ANTES de que Supabase confirme la operación, para que la app se sienta más rápida. Si Supabase falla, revierte el cambio automáticamente.

#### Por qué es un test de INTEGRACIÓN y no unitario
Prueba la **integración entre**:
1. El hook `useToggleFavorite` (lógica de mutación)
2. TanStack Query (manejo del caché)
3. El cliente de Supabase (capa de datos)

Mockeo solo Supabase (la frontera de red), pero el resto es código real: el hook, el QueryClient, el mecanismo de caché y rollback.

#### Los dos test cases

**Caso 1 — Agregar favorito actualiza el caché**
```
Setup: caché vacío (Set vacío)
Acción: mutate({ salonId: 'salon-abc', isFavorite: false })
Verifico:
  1. La mutación terminó exitosamente (isSuccess = true)
  2. El caché ahora contiene 'salon-abc'
  3. Supabase recibió la llamada a INSERT con los datos correctos
```
Verifica que el optimistic update funcionó y que la llamada a la base de datos fue correcta.

**Caso 2 — Error de Supabase revierte el caché (rollback)**
```
Setup: caché con ['salon-abc'] ya guardado
       Supabase configurado para responder con error
Acción: intentar agregar 'salon-nuevo'
Verifico:
  1. La mutación terminó con error (isError = true)
  2. El caché VOLVIÓ al estado original: tiene 'salon-abc', NO tiene 'salon-nuevo'
```
Verifica que si la red falla, la UI no queda en un estado inconsistente.

#### Vocabulario para la oral
- "Optimistic update" → actualizar la UI antes de confirmar con el servidor, para mejor experiencia de usuario
- "Rollback" → revertir el cambio si el servidor falla
- "Mock de Supabase" → reemplazo de la llamada real a la base de datos por una función controlada
- `vi.fn().mockResolvedValue(...)` → configura qué va a "responder" el mock
- `renderHook` → permite testear hooks de React fuera de un componente
- `QueryClient` → el gestor de caché de TanStack Query; lo creo desde cero en cada test para que estén aislados

---

### TC-I02 | `CardSalon` (componente con estado de auth y favoritos)
**Archivo**: `frontend/src/test/integration/CardSalon.test.tsx`
**Módulo testeado**: `frontend/src/features/salones/components/CardSalon.tsx`

#### Qué hace el componente
Es la tarjeta que se muestra en el listado de salones. Tiene un botón de corazón para marcar favoritos. El comportamiento del botón cambia según el estado de autenticación:
- Si el usuario **no está logueado** → redirige a `/login`
- Si el usuario **está logueado** → ejecuta la mutación de toggle favorito

#### Por qué es un test de INTEGRACIÓN y no unitario
Prueba la **integración entre**:
1. El componente `CardSalon` (UI)
2. El store de autenticación Zustand (`useAuthStore`)
3. El hook `useToggleFavorite` (lógica de favoritos)
4. El QueryClient (caché)

Mockeo solo el router de TanStack (para capturar la navegación) y Supabase (red). El estado real de Zustand se manipula directamente con `useAuthStore.setState`.

#### Los dos test cases

**Caso 1 — El botón muestra "Quitar de favoritos" cuando `isFavorite` es true**
```
Setup: salón con isFavorite: true
Verifico: el botón tiene aria-label "Quitar de favoritos"
```
Verifica que el componente refleja correctamente el estado del favorito en su accesibilidad. El `aria-label` es importante también para screen readers.

**Caso 2 — Click sin autenticación redirige a login**
```
Setup: usuario en null (no autenticado)
       salón con isFavorite: false
Acción: click en el botón de corazón
Verifico: `navigate` fue llamado con { to: '/login' }
```
Verifica que la protección de rutas del botón de favorito funciona: un usuario no autenticado no puede marcar favoritos, lo mandamos a registrarse primero.

#### Vocabulario para la oral
- `useAuthStore.setState(...)` → manipulación directa del store de Zustand en el test (no llamo a `setSession`, voy directo al estado)
- `fireEvent.click(...)` → simula un click del usuario en el DOM renderizado
- `screen.getByRole('button', { name: '...' })` → busca el botón por su rol ARIA y su nombre accesible
- Mock de `useNavigate` → capturo la función de navegación para verificar a dónde redirige sin necesidad de un router real

---

## Test Cases End-to-End

### TC-E01 | Login exitoso y acceso a Mis Favoritos
**Archivo**: `e2e/TC-E01_LoginFavoritos.groovy`
**Herramienta**: Katalon Studio

#### Qué prueba
El flujo completo de autenticación: desde que el usuario llega a la página de login, ingresa sus credenciales, hace click en el botón, y queda autenticado con acceso a páginas protegidas.

#### Por qué es E2E y no integración
Usa un **navegador real** (Chrome). El test no sabe nada del código interno; solo interactúa con la pantalla como lo haría un usuario. Prueba toda la cadena: React → Supabase Auth → sesión guardada → acceso a ruta protegida.

#### Los pasos del test
```
1. Abrir Chrome en http://localhost:5173/login
2. Esperar que cargue el input de email
3. Escribir el email de prueba
4. Escribir la contraseña
5. Click en "Iniciar sesión"
6. Verificar que la URL cambió a / (redirección post-login)
7. Navegar a /mis-favoritos
8. Verificar que aparece el texto "Mis favoritos" en la página
9. Cerrar el browser
```

#### Por qué estos pasos son los más importantes
El login es el flujo más crítico de la aplicación. Si falla, ningún usuario puede usar las funcionalidades de favoritos, reservas ni perfil. Verificar también la navegación a `/mis-favoritos` confirma que la sesión quedó guardada y que las rutas protegidas funcionan.

#### Vocabulario para la oral
- `WebUI.openBrowser('')` → abre Chrome (o el browser configurado en Katalon)
- `WebUI.navigateToUrl(...)` → navega a la URL indicada
- `WebUI.waitForPageLoad(10)` → espera hasta 10 segundos a que cargue la página (evita falsos positivos por carga lenta)
- `WebUI.verifyElementPresent(...)` → assertion: verifica que el elemento existe en el DOM
- `WebUI.verifyMatch(url, patron, isRegex)` → assertion: verifica que la URL coincide con el patrón
- `findTestObject` / `css(selector)` → forma de referenciar elementos del DOM por selector CSS
- `WebUI.closeBrowser()` → cierra el browser al final

---

### TC-E02 | Búsqueda de salones por nombre
**Archivo**: `e2e/TC-E02_BusquedaSalones.groovy`
**Herramienta**: Katalon Studio

#### Qué prueba
El flujo de búsqueda: el usuario escribe en el campo de búsqueda de la página de salones y verifica que los resultados se filtran correctamente.

#### Por qué es E2E
Prueba la integración real entre:
- El input de búsqueda en React
- El routing con parámetros en la URL
- La query a Supabase con el filtro `ilike`
- El renderizado de los resultados en pantalla

Ningún test unitario ni de integración puede verificar que este flujo completo funciona en el browser real.

#### Los pasos del test
```
1. Abrir Chrome en http://localhost:5173/salones
2. Verificar que el input "Buscar por nombre de salón..." está presente
3. Escribir el término de búsqueda ("La")
4. Esperar 2 segundos a que el filtro aplique (debounce / re-render)
5. Verificar que aparece al menos un card de salón (article.group)
6. Obtener el nombre del primer resultado y verificar que contiene el término buscado
7. Cerrar el browser
```

#### Por qué el `delay(2)`
El componente tiene un efecto React que actualiza la URL cuando el usuario escribe. Luego TanStack Query hace una nueva llamada a Supabase y re-renderiza los resultados. Este proceso lleva un momento, por eso esperamos antes de hacer las assertions.

> **Alternativa más robusta**: en lugar de `delay`, usar `WebUI.waitForElementPresent(article, 5)` que espera activamente hasta que aparezca el elemento. Es mejor práctica que un tiempo fijo.

#### Vocabulario para la oral
- `WebUI.setText(...)` → escribe texto en un input, reemplaza el contenido actual
- `WebUI.getText(...)` → obtiene el texto visible de un elemento
- `WebUI.verifyMatch(text, regex, true)` → verifica que el texto coincide con una expresión regular
- `article.group` → el selector CSS del card de salón, cuyo componente React tiene `className="group ..."`
- `article.group:first-of-type h3` → toma el primer card y dentro busca el `<h3>` con el nombre del salón

---

## Resumen de los 6 Test Cases

| ID | Tipo | Qué prueba | Herramienta |
|----|------|-----------|-------------|
| TC-U01 | Unitario | `salonPriceDisplay` — formateo de precios | Vitest |
| TC-U02 | Unitario | `effectivePrice` / `formatBookingPrice` — precio de reserva | Vitest |
| TC-I01 | Integración | `useToggleFavorite` — optimistic update y rollback | Vitest + React Query |
| TC-I02 | Integración | `CardSalon` — auth + toggle favorito en el componente | Vitest + Testing Library |
| TC-E01 | E2E | Login completo + acceso a ruta protegida | Katalon Studio |
| TC-E02 | E2E | Búsqueda y filtrado de salones | Katalon Studio |

---

## Cómo correr los tests

### Unit + Integración (Vitest)
```bash
# Desde la carpeta del proyecto
npm --prefix frontend run test
```

### E2E (Katalon Studio)
1. Abrir Katalon Studio
2. Abrir el proyecto existente o crear uno nuevo
3. Crear un nuevo Test Case para cada script Groovy
4. Asegurarse de que la app esté corriendo: `npm --prefix frontend run dev`
5. Reemplazar las credenciales en TC-E01 con una cuenta real de prueba
6. Ejecutar cada Test Case

---

## Posibles preguntas del profesor

**¿Por qué mockeas Supabase en los tests de integración?**
> Porque Supabase es una dependencia externa (una API de red). Si no la mockeo, el test depende de tener conexión a internet y de que la base de datos tenga datos específicos. Los tests deben ser deterministas: siempre dar el mismo resultado. Mockeo solo la capa de red; el resto del código (hooks, cache, componentes) es real.

**¿Cuál es la diferencia entre tu test de integración y el E2E si ambos prueban el CardSalon?**
> El test de integración (TC-I02) prueba la lógica del componente con jsdom (un DOM simulado en Node.js). No hay browser real, no hay CSS real, y Supabase es un mock. El test E2E (TC-E01/E2E02) usa Chrome real, con la app corriendo de verdad, y Supabase real. El E2E prueba la experiencia completa del usuario, el de integración prueba solo la lógica interna.

**¿Qué es el optimistic update y por qué lo probás?**
> Es cuando la app actualiza la UI *antes* de que el servidor confirme la operación, para que se sienta más rápida. Por ejemplo, al dar like a un salón, el corazón se llena al instante aunque Supabase todavía no respondió. Lo pruebo porque si falla el rollback (cuando el servidor da error), el usuario ve un estado incorrecto que nunca se guardó en la base de datos.

**¿Por qué elegiste `salonPriceDisplay` para test unitario?**
> Porque es una función pura con múltiples ramas lógicas: tiene 5 casos diferentes según el tipo de precio. Es el tipo de función más fácil de testear y con más valor de cobertura: si alguien rompe una de las ramas al hacer un cambio, el test lo detecta inmediatamente.
