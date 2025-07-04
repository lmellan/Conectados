package com.conectados.conect.test;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.*;

import java.time.Duration;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class T7_BuscarServicioPorNombreUITest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String baseUrl = "http://localhost:3000";
    private final String email = "alo@alo.com";
    private final String password = "1234";

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments(
                "--headless=new",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--incognito",
                "--disable-extensions",
                "--disable-notifications",
                "--no-default-browser-check",
                "--disable-blink-features=AutomationControlled",
                "--disable-features=PasswordManagerEnabled,AutofillServerCommunication,AutofillEnableAccountWalletStorage"
        );
        options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
        options.setExperimentalOption("useAutomationExtension", false);
        options.setExperimentalOption("prefs", new HashMap<String, Object>() {{
            put("credentials_enable_service", false);
            put("profile.password_manager_enabled", false);
        }});

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    private void escribirCampoLetraPorLetra(WebElement input, String texto) throws InterruptedException {
        input.clear();
        for (char c : texto.toCharArray()) {
            input.sendKeys(String.valueOf(c));
            Thread.sleep(30);
        }
    }

    @Test
    public void testBuscarServicioPorNombre() {
        try {
            // 1. Login
            driver.get(baseUrl + "/login");
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys(email);
            driver.findElement(By.id("password")).sendKeys(password);
            driver.findElement(By.xpath("//button[@type='submit']")).click();
            wait.until(ExpectedConditions.urlContains("/dashboard"));

            // 2. Ir a la vista de búsqueda
            driver.get(baseUrl + "/search");

            // 3. Escribir en el campo del buscador
            WebElement buscador = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.cssSelector("form[aria-label='Buscador de servicios'] input[type='text']")
            ));
            escribirCampoLetraPorLetra(buscador, "Servicio Selenium Automatizado");

            // 4. Click en botón "Buscar"
            WebElement botonBuscar = driver.findElement(
                    By.cssSelector("form[aria-label='Buscador de servicios'] button[type='submit']")
            );
            botonBuscar.click();

            // 5. Validar que aparece el título del servicio buscado
            wait.until(ExpectedConditions.textToBePresentInElementLocated(
                    By.cssSelector("h3.text-lg"), "Servicio Selenium Automatizado"));

            // 6. Esperar que el <a> "Ver detalles" esté presente
            wait.until(ExpectedConditions.presenceOfElementLocated(
                    By.xpath("//a[contains(text(),'Ver detalles')]")));

            // 7. Click en el primer link de "Ver detalles"
            WebElement linkVerDetalles = driver.findElement(
                    By.xpath("//a[contains(text(),'Ver detalles')]"));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", linkVerDetalles);
            linkVerDetalles.click();

            // 8. Verificar redirección a la vista de detalle
            wait.until(ExpectedConditions.urlMatches(".*/service/\\d+"));
            assertTrue(driver.getCurrentUrl().contains("/service/"));

        } catch (Exception e) {
            e.printStackTrace();
            fail("Falló la búsqueda y redirección a detalle: " + e.getMessage());
        }
    }
}
