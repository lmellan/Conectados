package com.conectados.conect.test;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class T7_BuscarServicioPorNombreUITest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String baseUrl = "http://localhost:3000";
    private final String email = "alo@alo.com";
    private final String password = "1234";

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();
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

            // 3. Escribir el término en el input
            WebElement searchInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[type='text']")));
            searchInput.clear();
            searchInput.sendKeys("Servicio Selenium Automatizado");

            // 4. Presionar el botón de búsqueda (submit)
            WebElement buscarBtn = driver.findElement(By.cssSelector("form[aria-label='Buscador de servicios'] button[type='submit']"));
            buscarBtn.click();

            // 5. Esperar redirección con parámetro q en URL
            wait.until(ExpectedConditions.urlContains("q=Servicio+Selenium+Automatizado"));

            // 6. Esperar al menos un resultado
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(
                    By.xpath("//button[contains(text(),'Ver detalles')]"), 0));

            // 7. Hacer clic en el primer botón "Ver detalles"
            WebElement verDetalle = driver.findElements(
                    By.xpath("//button[contains(text(),'Ver detalles')]")).get(0);
            verDetalle.click();

            // 8. Verificar que fue redirigido al detalle del servicio
            wait.until(ExpectedConditions.urlMatches(".*/service/\\d+"));
            assertTrue(driver.getCurrentUrl().contains("/service/"));

        } catch (Exception e) {
            e.printStackTrace();
            fail("Falló la prueba de búsqueda y redirección a detalle: " + e.getMessage());
        }
    }
}
