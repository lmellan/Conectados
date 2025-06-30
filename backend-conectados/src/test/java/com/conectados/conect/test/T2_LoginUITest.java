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

public class T2_LoginUITest {

    private WebDriver driver;
    private WebDriverWait wait;

    private final String baseUrl = "http://localhost:3000";
    private final String emailExistente = "alo@alo.com";
    private final String contrasenaExistente = "1234";

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--user-data-dir=/tmp/selenium-profile-" + System.currentTimeMillis());
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
    public void testLoginUsuarioExistente() {
        try {
            WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
            WebElement passwordInput = driver.findElement(By.id("password"));
            WebElement loginButton = driver.findElement(By.xpath("//button[@type='submit']"));

            emailInput.sendKeys(emailExistente);
            passwordInput.sendKeys(contrasenaExistente);
            loginButton.click();

            // Debug: esperar máximo 10 segundos a que cambie la URL
            wait.until(ExpectedConditions.or(
                    ExpectedConditions.urlContains("/dashboard"),
                    ExpectedConditions.presenceOfElementLocated(By.className("text-red-600"))
            ));

            String currentUrl = driver.getCurrentUrl();
            String pageTitle = driver.getTitle();
            System.out.println("URL actual: " + currentUrl);
            System.out.println("Título actual: " + pageTitle);

            // Si NO redirigió al dashboard, probablemente hubo error
            if (!currentUrl.contains("/dashboard")) {
                // Buscar mensaje de error si existe
                try {
                    WebElement errorMsg = driver.findElement(By.className("text-red-600"));
                    System.out.println("Mensaje de error: " + errorMsg.getText());
                } catch (NoSuchElementException ignored) {
                    System.out.println("No se encontró mensaje de error visible.");
                }
                takeScreenshot("login_debug_error.png");
                fail("No se redirigió al dashboard. URL actual: " + currentUrl);
            }

            // Validación final
            assertTrue(currentUrl.contains("/dashboard"), "Redirección a dashboard falló.");

        } catch (Exception e) {
            takeScreenshot("login_debug_exception.png");
            e.printStackTrace();
            fail("Excepción en testLoginUsuarioExistente: " + e.getMessage());
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
