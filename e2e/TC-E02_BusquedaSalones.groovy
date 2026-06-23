// TC-E02 | Búsqueda de salones por nombre con filtro activo
// Herramienta: Katalon Studio
// Prerequisito: la app debe estar corriendo en http://localhost:5173
//               y debe existir al menos un salón cuyo nombre contenga NOMBRE_BUSCAR.

import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.webui.driver.DriverFactory
import org.openqa.selenium.By
import org.openqa.selenium.Keys
import org.openqa.selenium.interactions.Actions

def EMAIL         = 'test@hosty.com'
def PASSWORD      = 'Test1234!'
def BASE_URL      = 'http://localhost:5173'
def NOMBRE_BUSCAR = 'Terraza'

def css(String selector) {
    TestObject obj = new TestObject(selector)
    obj.addProperty('css', ConditionType.EQUALS, selector)
    return obj
}

// ─── PASO 1: Abrir el navegador y hacer login ────────────────────────────────
WebUI.openBrowser('')
WebUI.navigateToUrl("${BASE_URL}/login")
WebUI.waitForPageLoad(10)
WebUI.verifyElementPresent(css('input#email'), 5)
WebUI.setText(css('input#email'), EMAIL)
WebUI.setText(css('input[type="password"]'), PASSWORD)
WebUI.click(css('button[type="submit"]'))

int intentosLogin = 0
while (WebUI.getUrl().contains('/login') && intentosLogin < 10) {
    WebUI.delay(1)
    intentosLogin++
}
WebUI.verifyElementNotPresent(css('input#email'), 3)

// ─── PASO 2: Navegar a la página de salones ──────────────────────────────────
WebUI.navigateToUrl("${BASE_URL}/salones")
WebUI.waitForPageLoad(10)

// ─── PASO 3: Verificar que el buscador está presente ────────────────────────
def inputSelector = 'input[placeholder="Buscar por nombre de salón..."]'
WebUI.verifyElementPresent(css(inputSelector), 5)

// ─── PASO 4: Escribir el término y presionar Enter ───────────────────────────
// El input es controlado por React: onChange actualiza estado local y
// onKeyDown(Enter) aplica el filtro actualizando la URL con ?busqueda=...
// Usamos Actions de Selenium para simular teclado real (click + type + Enter).
def driver = DriverFactory.getWebDriver()
def inputElement = driver.findElement(By.cssSelector(inputSelector))

new Actions(driver)
    .click(inputElement)
    .sendKeys(NOMBRE_BUSCAR)
    .sendKeys(Keys.ENTER)
    .perform()

// ─── PASO 5: Esperar a que la URL refleje el filtro aplicado ─────────────────
int intentosFiltro = 0
while (!WebUI.getUrl().contains('busqueda=') && intentosFiltro < 10) {
    WebUI.delay(1)
    intentosFiltro++
}
WebUI.verifyMatch(WebUI.getUrl(), '.*busqueda=.*', true)

// ─── PASO 6: Verificar que aparece al menos un resultado ────────────────────
WebUI.verifyElementPresent(css('article.group'), 5)

// ─── Fin del test ────────────────────────────────────────────────────────────
WebUI.closeBrowser()
