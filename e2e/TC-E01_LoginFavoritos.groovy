// TC-E01 | Login exitoso y acceso a Mis Favoritos
// Herramienta: Katalon Studio
// Prerequisito: la app debe estar corriendo en http://localhost:5173
//               y debe existir una cuenta registrada con las credenciales de prueba.

import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

// ─── Credenciales de prueba (reemplazar con una cuenta real) ────────────────
def EMAIL    = 'test@hosty.com'
def PASSWORD = 'password123'
def BASE_URL = 'http://localhost:5173'

// ─── Helper: crea un TestObject a partir de un selector CSS ─────────────────
def css(String selector) {
    TestObject obj = new TestObject(selector)
    obj.addProperty('css', ConditionType.EQUALS, selector)
    return obj
}

// ─── PASO 1: Abrir el navegador y navegar al login ──────────────────────────
WebUI.openBrowser('')
WebUI.navigateToUrl("${BASE_URL}/login")
WebUI.waitForPageLoad(10)

// ─── PASO 2: Verificar que la página de login cargó ─────────────────────────
WebUI.verifyElementPresent(css('input#email'), 5)

// ─── PASO 3: Ingresar credenciales ──────────────────────────────────────────
WebUI.setText(css('input#email'), EMAIL)
WebUI.setText(css('input[type="password"]'), PASSWORD)

// ─── PASO 4: Hacer click en el botón de login ───────────────────────────────
WebUI.click(css('button[type="submit"]'))

// ─── PASO 5: Esperar a que Supabase autentique y la app redirija ─────────────
// Hosty es una SPA: el login no recarga la página, cambia la URL via React Router.
// Hacemos polling manual hasta que la URL deje de ser /login (máx 10 segundos).
int intentos = 0
while (WebUI.getUrl().contains('/login') && intentos < 10) {
    WebUI.delay(1)
    intentos++
}
WebUI.verifyElementNotPresent(css('input#email'), 3)

// ─── PASO 6: Navegar a Mis Favoritos ────────────────────────────────────────
// Esperamos un segundo extra para que Supabase termine de hidratar la sesión
// antes de navegar a una ruta protegida por requireAuth.
WebUI.delay(1)
WebUI.navigateToUrl("${BASE_URL}/mis-favoritos")

// ─── PASO 7: Verificar que la página de favoritos cargó correctamente ────────
// Buscamos el h1 por su texto parcial usando XPath — evita problemas con
// el punto (.) que React renderiza en un <span> separado y el case exacto.
WebUI.verifyElementPresent(
    new com.kms.katalon.core.testobject.TestObject()
        .addProperty('xpath', com.kms.katalon.core.testobject.ConditionType.EQUALS,
            '//h1[contains(text(), "Mis Favoritos")]'),
    10
)

// ─── Fin del test ────────────────────────────────────────────────────────────
WebUI.closeBrowser()
