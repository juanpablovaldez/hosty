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

// ─── PASO 5: Verificar redirección a home (login exitoso) ───────────────────
WebUI.waitForPageLoad(10)
WebUI.verifyMatch(WebUI.getUrl(), BASE_URL + '/', false)

// ─── PASO 6: Navegar a Mis Favoritos ────────────────────────────────────────
WebUI.navigateToUrl("${BASE_URL}/mis-favoritos")
WebUI.waitForPageLoad(10)

// ─── PASO 7: Verificar que la página de favoritos cargó correctamente ────────
WebUI.verifyTextPresent('Mis favoritos', false)

// ─── Fin del test ────────────────────────────────────────────────────────────
WebUI.closeBrowser()
