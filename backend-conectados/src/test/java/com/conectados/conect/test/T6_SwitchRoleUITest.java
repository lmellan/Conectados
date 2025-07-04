package com.conectados.conect.test;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.*;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class T6_SwitchRoleUITest {

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
    public void testSwitchRoleFromBuscadorToPrestador() {
        try {
            // 1. Ir a login
            driver.get(baseUrl + "/login");

            // 2. Completar login
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys(email);
            driver.findElement(By.id("password")).sendKeys(password);
            driver.findElement(By.xpath("//button[@type='submit']")).click();

            // 3. Esperar redirección al dashboard
            wait.until(ExpectedConditions.urlContains("/dashboard"));

            // 4. Verificar existencia del select de roles
            WebElement roleSelect = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("role-select")));
            assertNotNull(roleSelect, "El dropdown de roles no se encontró");

            // 5. Obtener rol actual
            Select select = new Select(roleSelect);
            String rolActual = select.getFirstSelectedOption().getText();
            System.out.println("Rol actual: " + rolActual);

            // 6. Cambiar al otro rol (si es posible)
            String nuevoRol = rolActual.equals("Buscador") ? "Profesional" : "Buscador";
            select.selectByVisibleText(nuevoRol);
            Thread.sleep(500); // esperar UI update

            // 7. Verificar que el rol activo ha cambiado
            String rolActualizado = new Select(driver.findElement(By.id("role-select")))
                    .getFirstSelectedOption().getText();

            assertEquals(nuevoRol, rolActualizado, "El rol no cambió correctamente");
            System.out.println("Cambio de rol exitoso a: " + rolActualizado);

        } catch (Exception e) {
            e.printStackTrace();
            fail("Falló la prueba de cambio de rol: " + e.getMessage());
        }
    }
}
