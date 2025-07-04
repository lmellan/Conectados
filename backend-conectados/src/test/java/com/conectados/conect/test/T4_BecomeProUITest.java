package com.conectados.conect.test;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class T4_BecomeProUITest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String baseUrl = "http://localhost:3000";
    private final String email = "alo@alo.com";
    private final String password = "1234";

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments(
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--headless=new",
            "--disable-gpu",
            "--remote-debugging-port=9222"
        );

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testBecomeProfessionalFlow() {
        try {
            // 1. Login
            driver.get(baseUrl + "/login");
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys(email);
            driver.findElement(By.id("password")).sendKeys(password);
            driver.findElement(By.xpath("//button[@type='submit']")).click();

            // 2. Ir a la vista de completar perfil
            wait.until(ExpectedConditions.urlContains("/dashboard"));
            driver.get(baseUrl + "/become-professional");

            // 3. Verificar si existe el botón (sólo si aún no es prestador)
            boolean botonPresente = driver.findElements(
                By.xpath("//button[contains(text(),'Completar Perfil y Ofrecer Servicios')]")
            ).size() > 0;
            if (!botonPresente) {
                System.out.println("El usuario ya es prestador, no se muestra el formulario.");
                return;
            }

            JavascriptExecutor js = (JavascriptExecutor) driver;
            Actions actions = new Actions(driver);

            // 4. Categoría
            js.executeScript("document.querySelector(\"input[type='checkbox'][value='Electricista']\").click();");

            // 5. Zona de atención
            Select zona = new Select(wait.until(ExpectedConditions.elementToBeClickable(By.id("zonaAtencion"))));
            zona.selectByVisibleText("Valparaíso");

            // 6. Descripción
            WebElement descripcion = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("descripcion")));
            descripcion.clear();
            descripcion.sendKeys("Descripción desde Selenium UI test");
            Thread.sleep(200);
            js.executeScript("arguments[0].blur();", descripcion);

            // 7. Disponibilidad semanal
            js.executeScript("document.getElementById('day-Lunes').click();");
            js.executeScript("document.getElementById('day-Martes').click();");

            // 8. Horarios
            js.executeScript("document.getElementById('horaInicio').value = '08:00';");
            js.executeScript("document.getElementById('horaFin').value = '17:00';");

            // 9. Enviar formulario
            WebElement submitBtn = driver.findElement(
                By.xpath("//button[contains(text(),'Completar Perfil y Ofrecer Servicios')]")
            );
            wait.until(ExpectedConditions.elementToBeClickable(submitBtn));
            js.executeScript("arguments[0].scrollIntoView(true);", submitBtn);
            js.executeScript("arguments[0].click();", submitBtn);

            // 10. Verificar redirección
            wait.until(ExpectedConditions.urlContains("/dashboard"));
            assertTrue(driver.getCurrentUrl().contains("/dashboard"));

        } catch (Exception e) {
            takeScreenshot("become_pro_debug.png");
            e.printStackTrace();
            fail("Fallo en flujo BecomePro: " + e.getMessage());
        }
    }

    private void takeScreenshot(String fileName) {
        try {
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Files.copy(screenshot.toPath(), Path.of(fileName));
            System.out.println("Screenshot guardado: " + fileName);
        } catch (Exception e) {
            System.err.println("Error al guardar screenshot: " + e.getMessage());
        }
    }
}
