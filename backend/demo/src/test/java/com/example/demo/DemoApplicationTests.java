package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import javax.sql.DataSource;

@SpringBootTest(properties = {
    "spring.jpa.hibernate.ddl-auto=none"
})
class DemoApplicationTests {

    @MockBean
    private DataSource dataSource;

    @Test
    void contextLoads() {
    }

}
