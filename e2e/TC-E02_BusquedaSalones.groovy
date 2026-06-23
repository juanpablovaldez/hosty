// TC-E02 | Búsqueda de salones por nombre y verificación de resultados
// Herramienta: Katalon Studio
// Prerequisito: la app debe estar corriendo en http://localhost:5173
//               y debe existir al menos un salón cargado en la base de datos.

import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

def BASE_URL    = 'http://localhost:5173'
def NOMBRE_BUSCAR = 'La'   // término que devuelve resultados en la BD de prueba

// ─── Helper: crea un TestObject a partir de un selector CSS ─────────────────
def css(String selector) {
    TestObject obj = new TestObject(selector)
    obj.addProperty('css', ConditionType.EQUALS, selector)
    return obj
}

// ─── PASO 1: Abrir la página de salones ─────────────────────────────────────
WebUI.openBrowser('')
WebUI.navigateToUrl("${BASE_URL}/salones")
WebUI.waitForPageLoad(10)

// ─── PASO 2: Verificar que el input de búsqueda está presente ───────────────
def inputBusqueda = css('input[placeholder="Buscar por nombre de salón..."]')
WebUI.verifyElementPresent(inputBusqueda, 5)

// ─── PASO 3: Escribir el término de búsqueda ────────────────────────────────
WebUI.setText(inputBusqueda, NOMBRE_BUSCAR)

// ─── PASO 4: Esperar a que los resultados se actualicen (el filtro es en tiempo real) ──
WebUI.delay(2)

// ─── PASO 5: Verificar que aparece al menos un resultado ────────────────────
// Los cards de salones se renderizan como elementos <article>
WebUI.verifyElementPresent(css('article.group'), 5)

// ─── PASO 6: Verificar que el nombre del salón en los resultados
//             contiene el término buscado ──────────────────────────────────────
def primerCard = css('article.group:first-of-type h3')
def nombreEncontrado = WebUI.getText(primerCard)
WebUI.verifyMatch(nombreEncontrado.toLowerCase(), '.*' + NOMBRE_BUSCAR.toLowerCase() + '.*', true)

// ─── Fin del test ────────────────────────────────────────────────────────────
WebUI.closeBrowser()
