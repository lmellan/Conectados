package com.conectados.conect.test;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class CreateServiceUITest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String baseUrl = "http://localhost:3000";
    private final String email = "alo@alo.com";
    private final String password = "1234";

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testCreateService() {
        try {
            // Login
            driver.get(baseUrl + "/login");
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys(email);
            driver.findElement(By.id("password")).sendKeys(password);
            driver.findElement(By.xpath("//button[@type='submit']")).click();
            wait.until(ExpectedConditions.urlContains("/dashboard"));

            // Completar perfil si es necesario
            driver.get(baseUrl + "/become-professional");
            boolean debeConvertirse = driver.findElements(
                By.xpath("//button[contains(text(),'Completar Perfil y Ofrecer Servicios')]")
            ).size() > 0;

            if (debeConvertirse) {
                JavascriptExecutor js = (JavascriptExecutor) driver;
                new Select(driver.findElement(By.id("zonaAtencion"))).selectByVisibleText("Valparaíso");
                js.executeScript("document.querySelector(\"input[type='checkbox'][value='Electricista']\").click();");
                driver.findElement(By.name("descripcion")).sendKeys("Perfil temporal desde Selenium");
                js.executeScript("document.getElementById('day-Lunes').click();");
                js.executeScript("document.getElementById('horaInicio').value = '09:00';");
                js.executeScript("document.getElementById('horaFin').value = '17:00';");

                WebElement submitBtn = driver.findElement(
                    By.xpath("//button[contains(text(),'Completar Perfil y Ofrecer Servicios')]")
                );
                js.executeScript("arguments[0].scrollIntoView(true); arguments[0].click();", submitBtn);
                wait.until(ExpectedConditions.urlContains("/dashboard"));
            }

            // Ir a crear servicio
            WebElement linkNuevoServicio = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("a[href='/create-service']"))
            );
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true); arguments[0].click();", linkNuevoServicio);
            wait.until(ExpectedConditions.urlContains("/create-service"));

            JavascriptExecutor js = (JavascriptExecutor) driver;

            // Título del servicio
            js.executeScript(
                "const input = document.getElementById('nombre');" +
                "input.value = 'Servicio Selenium Automatizado';" +
                "input.dispatchEvent(new Event('input', { bubbles: true }));" +
                "input.dispatchEvent(new Event('change', { bubbles: true }));"
            );

            // Categoría y zona
            new Select(driver.findElement(By.id("categoria"))).selectByVisibleText("Electricidad");
            new Select(driver.findElement(By.id("zonaAtencion"))).selectByVisibleText("Valparaíso");

            // Descripción
            js.executeScript(
                "const desc = document.getElementById('descripcion');" +
                "desc.value = arguments[0];" +
                "desc.dispatchEvent(new Event('input', { bubbles: true }));" +
                "desc.dispatchEvent(new Event('change', { bubbles: true }));",
                "Servicio creado automáticamente con Selenium."
            );

            // Precio
            js.executeScript(
                "const input = document.getElementById('precio');" +
                "input.value = arguments[0];" +
                "input.dispatchEvent(new Event('input', { bubbles: true }));" +
                "input.dispatchEvent(new Event('change', { bubbles: true }));",
                "9990"
            );

            // Crear servicio
            driver.findElement(By.xpath("//button[contains(text(),'Crear Servicio')]")).click();

            // Verificar redirección
            wait.until(ExpectedConditions.urlToBe(baseUrl + "/dashboard"));
            assertEquals(baseUrl + "/dashboard", driver.getCurrentUrl());

        } catch (Exception e) {
            try {
                File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                Files.copy(screenshot.toPath(), Path.of("create_service_error.png"));
            } catch (Exception ignored) {}

            e.printStackTrace();
            fail("Error al crear servicio: " + e.getMessage());
        }
    }
}
