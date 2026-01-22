# ⚙️ Backend Setup Guide
## Kotlin + Spring Boot

Este guia vai te ajudar a configurar o ambiente de desenvolvimento backend do zero.

---

## 📋 Pré-requisitos

### 1. Instalar Java JDK (versão 17 ou 21)

```bash
# Verificar se já está instalado
java --version
javac --version

# Instalar OpenJDK 21 (recomendado)
sudo apt update
sudo apt install openjdk-21-jdk -y

# Verificar instalação
java --version  # Deve mostrar openjdk 21.x.x
```

### 2. Configurar JAVA_HOME

```bash
# Adicionar ao ~/.bashrc
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$PATH:$JAVA_HOME/bin' >> ~/.bashrc

# Recarregar
source ~/.bashrc

# Verificar
echo $JAVA_HOME
```

---

## 🚀 Criando o Projeto Spring Boot

### Opção A: Usando Spring Initializr (Recomendado)

#### 3a. Via linha de comando (curl)

```bash
# Navegue até a pasta backend
cd /root/projects/meu-site-pessoal/backend

# Baixar projeto do Spring Initializr
curl https://start.spring.io/starter.zip \
  -d type=gradle-project-kotlin \
  -d language=kotlin \
  -d bootVersion=3.2.2 \
  -d baseDir=. \
  -d groupId=com.meusitepessoal \
  -d artifactId=backend \
  -d name=backend \
  -d description="Backend do meu site pessoal" \
  -d packageName=com.meusitepessoal.backend \
  -d packaging=jar \
  -d javaVersion=21 \
  -d dependencies=web,data-jpa,postgresql,validation,devtools,actuator \
  -o backend.zip

# Extrair
unzip backend.zip -d temp && mv temp/*/* . && rm -rf temp backend.zip
```

#### 3b. Via navegador (alternativa)

1. Acesse: https://start.spring.io
2. Configure:
   - **Project:** Gradle - Kotlin
   - **Language:** Kotlin
   - **Spring Boot:** 3.2.x (última estável)
   - **Group:** com.meusitepessoal
   - **Artifact:** backend
   - **Packaging:** Jar
   - **Java:** 21
3. **Dependencies** (clique em ADD DEPENDENCIES):
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Validation
   - Spring Boot DevTools
   - Spring Boot Actuator
4. Clique em **GENERATE** e extraia na pasta `backend/`

---

## 📁 Estrutura de Pastas (após criação)

```
backend/
├── src/
│   ├── main/
│   │   ├── kotlin/
│   │   │   └── com/meusitepessoal/backend/
│   │   │       ├── BackendApplication.kt    # Classe principal
│   │   │       ├── controller/              # Criar: endpoints REST
│   │   │       ├── service/                 # Criar: lógica de negócio
│   │   │       ├── repository/              # Criar: acesso a dados
│   │   │       ├── model/                   # Criar: entidades/DTOs
│   │   │       └── config/                  # Criar: configurações
│   │   └── resources/
│   │       ├── application.properties       # Configurações
│   │       └── application.yml              # Alternativa (YAML)
│   └── test/
│       └── kotlin/                          # Testes
├── build.gradle.kts                         # Dependências (Gradle Kotlin DSL)
├── settings.gradle.kts                      # Configurações Gradle
└── gradlew                                  # Wrapper do Gradle
```

---

## ⚙️ Configurando o Banco de Dados

### 4. Editar `src/main/resources/application.yml`

Crie ou edite o arquivo:

```yaml
spring:
  application:
    name: meu-site-pessoal-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/meusitepessoal
    username: postgres
    password: sua_senha_aqui
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # create, update, validate, none
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect

server:
  port: 8080

# Configuração de CORS para o frontend
cors:
  allowed-origins: http://localhost:3000
```

---

## 🏃 Comandos Essenciais

### 5. Rodando o projeto

```bash
# Dar permissão ao gradlew (se necessário)
chmod +x gradlew

# Compilar o projeto
./gradlew build

# Rodar em desenvolvimento
./gradlew bootRun
```

A API estará disponível em: **http://localhost:8080**

### 6. Outros comandos úteis

```bash
# Limpar build anterior
./gradlew clean

# Rodar testes
./gradlew test

# Build do JAR de produção
./gradlew bootJar

# Ver dependências
./gradlew dependencies
```

---

## 📝 Exemplo: Criando seu Primeiro Endpoint

### 7. Criar estrutura de pastas

```bash
mkdir -p src/main/kotlin/com/meusitepessoal/backend/{controller,service,repository,model,config}
```

### 8. Criar uma entidade (Model)

```kotlin
// src/main/kotlin/com/meusitepessoal/backend/model/Projeto.kt
package com.meusitepessoal.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "projetos")
data class Projeto(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    val titulo: String,
    
    @Column(columnDefinition = "TEXT")
    val descricao: String,
    
    val tecnologias: String,
    
    val urlGithub: String? = null,
    
    val urlDemo: String? = null,
    
    @Column(name = "criado_em")
    val criadoEm: LocalDateTime = LocalDateTime.now()
)
```

### 9. Criar Repository

```kotlin
// src/main/kotlin/com/meusitepessoal/backend/repository/ProjetoRepository.kt
package com.meusitepessoal.backend.repository

import com.meusitepessoal.backend.model.Projeto
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjetoRepository : JpaRepository<Projeto, Long> {
    fun findByTituloContainingIgnoreCase(titulo: String): List<Projeto>
}
```

### 10. Criar Service

```kotlin
// src/main/kotlin/com/meusitepessoal/backend/service/ProjetoService.kt
package com.meusitepessoal.backend.service

import com.meusitepessoal.backend.model.Projeto
import com.meusitepessoal.backend.repository.ProjetoRepository
import org.springframework.stereotype.Service

@Service
class ProjetoService(private val repository: ProjetoRepository) {
    
    fun listarTodos(): List<Projeto> = repository.findAll()
    
    fun buscarPorId(id: Long): Projeto? = repository.findById(id).orElse(null)
    
    fun criar(projeto: Projeto): Projeto = repository.save(projeto)
    
    fun atualizar(id: Long, projeto: Projeto): Projeto? {
        return if (repository.existsById(id)) {
            repository.save(projeto.copy(id = id))
        } else null
    }
    
    fun deletar(id: Long): Boolean {
        return if (repository.existsById(id)) {
            repository.deleteById(id)
            true
        } else false
    }
}
```

### 11. Criar Controller

```kotlin
// src/main/kotlin/com/meusitepessoal/backend/controller/ProjetoController.kt
package com.meusitepessoal.backend.controller

import com.meusitepessoal.backend.model.Projeto
import com.meusitepessoal.backend.service.ProjetoService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projetos")
@CrossOrigin(origins = ["http://localhost:3000"])
class ProjetoController(private val service: ProjetoService) {
    
    @GetMapping
    fun listarTodos(): List<Projeto> = service.listarTodos()
    
    @GetMapping("/{id}")
    fun buscarPorId(@PathVariable id: Long): ResponseEntity<Projeto> {
        val projeto = service.buscarPorId(id)
        return if (projeto != null) {
            ResponseEntity.ok(projeto)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PostMapping
    fun criar(@RequestBody projeto: Projeto): ResponseEntity<Projeto> {
        val novoProjeto = service.criar(projeto)
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProjeto)
    }
    
    @PutMapping("/{id}")
    fun atualizar(@PathVariable id: Long, @RequestBody projeto: Projeto): ResponseEntity<Projeto> {
        val atualizado = service.atualizar(id, projeto)
        return if (atualizado != null) {
            ResponseEntity.ok(atualizado)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @DeleteMapping("/{id}")
    fun deletar(@PathVariable id: Long): ResponseEntity<Void> {
        return if (service.deletar(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
```

### 12. Configurar CORS globalmente

```kotlin
// src/main/kotlin/com/meusitepessoal/backend/config/CorsConfig.kt
package com.meusitepessoal.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class CorsConfig {
    
    @Bean
    fun corsFilter(): CorsFilter {
        val config = CorsConfiguration().apply {
            allowCredentials = true
            addAllowedOrigin("http://localhost:3000")
            addAllowedHeader("*")
            addAllowedMethod("*")
        }
        
        val source = UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/api/**", config)
        }
        
        return CorsFilter(source)
    }
}
```

---

## 🐳 Preparando para Docker (futuro)

Quando estiver pronto, crie o `Dockerfile`:

```dockerfile
# Build stage
FROM gradle:8.5-jdk21-alpine AS builder
WORKDIR /app
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle
COPY src ./src
RUN gradle bootJar --no-daemon

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## ✅ Checklist de Setup

- [ ] Java JDK 21 instalado
- [ ] JAVA_HOME configurado
- [ ] Projeto Spring Boot criado
- [ ] Dependências baixadas (`./gradlew build`)
- [ ] PostgreSQL rodando (ver `../database/SETUP.md`)
- [ ] `application.yml` configurado
- [ ] API rodando em http://localhost:8080

---

## 📚 Recursos para Estudar

- [Documentação Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Kotlin Lang](https://kotlinlang.org/docs/home.html)
- [Spring + Kotlin Guide](https://spring.io/guides/tutorials/spring-boot-kotlin/)
- [Baeldung - Spring Boot](https://www.baeldung.com/spring-boot)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

---

**Próximo passo:** Configure o banco de dados em `../database/SETUP.md` antes de rodar o backend! 🚀
