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

import static org.junit.jupiter.api.Assertions.*;

public class T3_DashboardRedirectionUITest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String baseUrl = "http://localhost:3000";

    private final String emailExistente = "alo@alo.com";
    private final String contrasenaExistente = "1234";

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
        driver.get(baseUrl + "/login");
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testRedireccionABecomeProfessionalDesdeDashboard() {
        try {
            WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
            WebElement passwordInput = driver.findElement(By.id("password"));
            WebElement loginButton = driver.findElement(By.xpath("//button[@type='submit']"));

            emailInput.sendKeys(emailExistente);
            passwordInput.sendKeys(contrasenaExistente);
            loginButton.click();

            wait.until(ExpectedConditions.urlContains("/dashboard"));

            var elementos = driver.findElements(By.xpath("//a[contains(text(),'Conviértete en Profesional')]"));
            if (elementos.isEmpty()) {
                System.out.println("Botón no presente: usuario ya es prestador");
                return;
            }

            WebElement btnBecomePro = elementos.get(0);
            btnBecomePro.click();

            wait.until(ExpectedConditions.urlContains("/become-professional"));
            String currentUrl = driver.getCurrentUrl();
            assertTrue(currentUrl.contains("/become-professional"), "No se redirigió correctamente");

        } catch (Exception e) {
            takeScreenshot("dashboard_to_becomepro_error.png");
            e.printStackTrace();
            fail("Error durante la prueba: " + e.getMessage());
        }
    }

    private void takeScreenshot(String fileName) {
        try {
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Files.copy(screenshot.toPath(), Path.of(fileName));
            System.out.println("Captura de pantalla guardada: " + fileName);
        } catch (Exception e) {
            System.err.println("Error guardando screenshot: " + e.getMessage());
        }
    }
}
