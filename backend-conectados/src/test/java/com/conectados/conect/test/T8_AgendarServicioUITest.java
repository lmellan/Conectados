package com.conectados.conect.test;

import java.time.temporal.TemporalAdjusters;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.*;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class T8_AgendarServicioUITest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String baseUrl = "http://localhost:3000";
    private final String email = "alo@alo.com";
    private final String password = "1234";

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--incognito", "--disable-extensions", "--disable-notifications");
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
        if (driver != null) driver.quit();
    }

    @Test
    public void testAgendarServicio() {
        try {
            // 1. Login
            driver.get(baseUrl + "/login");
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys(email);
            driver.findElement(By.id("password")).sendKeys(password);
            driver.findElement(By.xpath("//button[@type='submit']")).click();
            wait.until(ExpectedConditions.urlContains("/dashboard"));

            // 2. Buscar el servicio
            driver.get(baseUrl + "/search");
            WebElement buscador = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.cssSelector("form[aria-label='Buscador de servicios'] input[type='text']")));
            buscador.sendKeys("Servicio Selenium Automatizado");

            WebElement botonBuscar = driver.findElement(
                    By.cssSelector("form[aria-label='Buscador de servicios'] button[type='submit']"));
            botonBuscar.click();

            wait.until(ExpectedConditions.textToBePresentInElementLocated(
                    By.cssSelector("h3.text-lg"), "Servicio Selenium Automatizado"));

            WebElement linkVerDetalles = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//a[contains(text(),'Ver detalles')]")));
            linkVerDetalles.click();

            // 3. Esperar vista de detalle
            wait.until(ExpectedConditions.urlMatches(".*/service/\\d+"));

            // 4. Seleccionar fecha (próximo lunes)
            String fecha = getNextMondayDate();
            WebElement inputFecha = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("date")));
            inputFecha.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
            inputFecha.sendKeys(fecha);

            // 5. Seleccionar hora 16:00
            WebElement selectHora = driver.findElement(By.id("time"));
            selectHora.click();
            WebElement opcionHora = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//select[@id='time']/option[@value='13:00']")));
            opcionHora.click();

            // 6. Presionar botón para solicitar servicio
            WebElement botonSolicitar = driver.findElement(By.xpath("//button[contains(text(),'Solicitar Servicio')]"));
            botonSolicitar.click();

            // 7. Verificar si se agendó con éxito o apareció alerta que inidca que ya estaba el servicio creado en esa fecha
            boolean agendadaConExito = false;
            boolean huboAlerta = false;

            try {
                WebDriverWait shortWait = new WebDriverWait(driver, Duration.ofSeconds(3));
                Alert alert = shortWait.until(ExpectedConditions.alertIsPresent());
                String texto = alert.getText();
                alert.accept();
                assertTrue(texto.contains("Hubo un error al agendar la cita"),
                        "El texto del alert no es el esperado.");
                huboAlerta = true;
            } catch (TimeoutException e) {
                try {
                    wait.until(ExpectedConditions.visibilityOfElementLocated(
                            By.xpath("//*[contains(text(),'¡Servicio agendado!')]")));
                    agendadaConExito = true;
                } catch (TimeoutException ex) {
                }
            }

            assertTrue(huboAlerta || agendadaConExito, "El test no cumplió ninguna de las condiciones válidas.");

        } catch (Exception e) {
            e.printStackTrace();
            fail("Falló el proceso de agendamiento del servicio: " + e.getMessage());
        }
    }

    private String getNextMondayDate() {
        LocalDate today = LocalDate.now();
        LocalDate nextMonday = today.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        return nextMonday.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
}
