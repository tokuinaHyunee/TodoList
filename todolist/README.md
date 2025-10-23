# TodoList Backend (Spring Boot)

## 프로젝트 개요
Spring Boot 기반의 RESTful API 서버로, 할 일(Todo)과 세부 할 일(SubTodo)을 관리하는 백엔드 애플리케이션입니다.

## 기술 스택
- **Java 21**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **MySQL 8.0**
- **Docker Compose**
- **Lombok**
- **Jackson (JSON 직렬화)**

## 프로젝트 구조
```
src/main/java/com/todolist/
├── config/          # 설정 클래스
├── controller/       # REST API 컨트롤러
│   ├── TodoController.java
│   └── SubTodoController.java
├── domain/          # JPA 엔티티
│   ├── Todo.java
│   └── SubTodo.java
├── repository/      # 데이터 접근 계층
│   ├── TodoRepository.java
│   └── SubTodoRepository.java
├── service/         # 비즈니스 로직
│   ├── TodoService.java
│   └── SubTodoService.java
└── jwt/             # JWT 관련 (향후 확장용)
```

## 데이터베이스 설계

### Todo 엔티티
- `id`: 기본키 (자동 증가)
- `title`: 할 일 제목
- `checked`: 완료 여부 (boolean)
- `createdAt`: 생성 시간
- `subTodos`: 세부 할 일 목록 (1:N 관계)

### SubTodo 엔티티
- `id`: 기본키 (자동 증가)
- `title`: 세부 할 일 제목
- `checked`: 완료 여부 (boolean)
- `createdAt`: 생성 시간
- `todo`: 상위 할 일 (N:1 관계)

## API 엔드포인트

### Todo API (`/api/todos`)
- `GET /api/todos` - 모든 할 일 조회
- `POST /api/todos` - 할 일 생성
- `DELETE /api/todos/{id}` - 할 일 삭제
- `PATCH /api/todos/{id}/check` - 할 일 완료 토글

### SubTodo API (`/api/subtodos`)
- `GET /api/subtodos/{todoId}` - 특정 할 일의 세부 할 일 조회
- `POST /api/subtodos/{todoId}` - 세부 할 일 생성
- `PATCH /api/subtodos/{id}/check` - 세부 할 일 완료 토글
- `DELETE /api/subtodos/{id}` - 세부 할 일 삭제

## 주요 기능

### 1. 할 일 관리
- 할 일 생성, 조회, 삭제, 완료 토글
- 제목 기반 할 일 생성
- 완료 상태 관리

### 2. 세부 할 일 관리
- 상위 할 일에 종속된 세부 할 일
- 계층적 구조로 할 일 세분화
- 독립적인 완료 상태 관리

### 3. 데이터 무결성
- `@JsonIgnore`로 순환 참조 방지
- `@Builder.Default`로 기본값 설정
- `CascadeType.ALL`로 연관 엔티티 관리

## 설정 파일

### application.yml
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/todolist
    username: myblog
    password: myblog123!
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### docker-compose.yml
```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: todolist
      MYSQL_USER: myblog
      MYSQL_PASSWORD: myblog123!
    ports:
      - "3307:3306"
```

## 실행 방법

### 1. 데이터베이스 시작
```bash
cd todolist
docker-compose up -d
```

### 2. 애플리케이션 실행
```bash
./gradlew bootRun
```

### 3. API 테스트
- 서버: `http://localhost:8080`
- API 문서: `http://localhost:8080/api/todos`

## CORS 설정
프론트엔드(`http://localhost:5173`)에서의 요청을 허용하도록 CORS가 설정되어 있습니다.

## 데이터 흐름

1. **요청 수신**: REST Controller가 HTTP 요청 수신
2. **비즈니스 로직**: Service 계층에서 로직 처리
3. **데이터 접근**: Repository를 통해 JPA로 DB 조작
4. **응답 반환**: JSON 형태로 클라이언트에 응답

## 개발 환경
- **IDE**: IntelliJ IDEA / Eclipse
- **빌드 도구**: Gradle
- **데이터베이스**: MySQL 8.0 (Docker)
- **포트**: 8080

## 주요 특징
- **RESTful API 설계**
- **JPA/Hibernate ORM**
- **Docker 컨테이너화**
- **JSON 직렬화 최적화**
- **계층형 아키텍처**
- **에러 처리 및 로깅**
