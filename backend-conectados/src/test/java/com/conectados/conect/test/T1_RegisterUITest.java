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

public class T1_RegisterUITest {

    private WebDriver driver;
    private WebDriverWait wait;

    private final String baseUrl = "http://localhost:3000";
    private final String correo = "alo@alo.com";
    private final String contrasena = "1234";
    private final String numero = "56912345678";


    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();

        // Forzar directorio único de perfil temporal
        String tempProfile = "/tmp/selenium-profile-" + System.currentTimeMillis();
        options.addArguments(
            "--headless=new",
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--user-data-dir=" + tempProfile
        );

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get(baseUrl + "/register");
    }



    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testRegistroUsuario() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("nombre"))).sendKeys("Usuario Test");
            driver.findElement(By.id("correo")).sendKeys(correo);
            driver.findElement(By.id("numero")).sendKeys(numero);
            driver.findElement(By.id("contrasena")).sendKeys(contrasena);
            driver.findElement(By.id("confirmPassword")).sendKeys(contrasena);

            WebElement boton = driver.findElement(By.xpath("//button[@type='submit']"));
            boton.click();

            boolean redirigeALogin = wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/login"),
                ExpectedConditions.presenceOfElementLocated(By.className("text-red-600"))
            ));

            String currentUrl = driver.getCurrentUrl();
            System.out.println("URL actual después de registrarse: " + currentUrl);

            if (currentUrl.contains("/login")) {
                System.out.println("Registro exitoso. Redirigido al login.");
                assertTrue(true);
            } else {
                WebElement errorMsg = driver.findElement(By.className("text-red-600"));
                String msg = errorMsg.getText();
                System.out.println("Mensaje de error: " + msg);
                assertTrue(msg.toLowerCase().contains("registrado") || msg.toLowerCase().contains("correo"));
            }

        } catch (Exception e) {
            takeScreenshot("registro_error.png");
            e.printStackTrace();
            fail("Excepción durante el test de registro: " + e.getMessage());
        }
    }

    private void takeScreenshot(String fileName) {
        try {
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Files.copy(screenshot.toPath(), Path.of(fileName));
            System.out.println("Captura guardada: " + fileName);
        } catch (Exception e) {
            System.err.println("No se pudo guardar el screenshot: " + e.getMessage());
        }
    }
}
