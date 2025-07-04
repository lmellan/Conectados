package com.conectados.conect.test;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class T5_CreateServiceUITest {

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
            "--remote-debugging-port=9222",
            "--incognito",
            "--disable-extensions",
            "--disable-notifications",
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
            Thread.sleep(300);

            // Completar campos
            new Select(driver.findElement(By.id("categoria"))).selectByVisibleText("Electricidad");
            new Select(driver.findElement(By.id("zonaAtencion"))).selectByVisibleText("Valparaíso");
            escribirCampoLetraPorLetra(driver.findElement(By.id("nombre")), "Servicio Selenium Automatizado");
            escribirCampoLetraPorLetra(driver.findElement(By.id("descripcion")), "Servicio creado automáticamente con Selenium.");
            escribirCampoLetraPorLetra(driver.findElement(By.id("precio")), "9990");

            driver.findElement(By.xpath("//button[contains(text(),'Crear Servicio')]")).click();
            wait.until(ExpectedConditions.urlToBe(baseUrl + "/dashboard"));
            assertEquals(baseUrl + "/dashboard", driver.getCurrentUrl());

        } catch (Exception e) {
            tomarCaptura("create_service_error.png");
            e.printStackTrace();
            fail("Error al crear servicio: " + e.getMessage());
        }
    }

    private void escribirCampoLetraPorLetra(WebElement input, String texto) throws InterruptedException {
        input.click();
        for (char c : texto.toCharArray()) {
            input.sendKeys(Character.toString(c));
            Thread.sleep(50);
        }
    }

    private void tomarCaptura(String nombreArchivo) {
        try {
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Files.copy(screenshot.toPath(), Path.of(nombreArchivo));
            System.out.println("Captura guardada: " + nombreArchivo);
        } catch (Exception e) {
            System.err.println("Error guardando screenshot: " + e.getMessage());
        }
    }
}
