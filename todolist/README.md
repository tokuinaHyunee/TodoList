# TodoList Backend (Spring Boot)

## 프로젝트 개요
Spring Boot 기반의 RESTful API 서버로, 할 일(Todo)과 세부 할 일(SubTodo)을 관리하는 백엔드 애플리케이션입니다. 사용자 인증 및 권한 관리를 포함한 완전한 할 일 관리 시스템입니다.

## 기술 스택
- **Java 21**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **Spring Security Crypto** (BCrypt 패스워드 암호화)
- **MySQL 8.0**
- **Docker Compose**
- **Lombok**
- **Jackson (JSON 직렬화)**

## 프로젝트 구조
```
src/main/java/com/todolist/
├── config/          # 설정 클래스
│   └── FilterConfig.java
├── controller/      # REST API 컨트롤러
│   ├── AuthController.java
│   ├── TodoController.java
│   ├── SubTodoController.java
│   └── GlobalExceptionHandler.java
├── domain/          # JPA 엔티티
│   ├── User.java
│   ├── Todo.java
│   └── SubTodo.java
├── dto/            # 데이터 전송 객체
│   ├── UserLoginRequest.java
│   └── UserRegisterRequest.java
├── repository/     # 데이터 접근 계층
│   ├── UserRepository.java
│   ├── TodoRepository.java
│   └── SubTodoRepository.java
├── service/        # 비즈니스 로직
│   ├── UserService.java
│   ├── TodoService.java
│   └── SubTodoService.java
└── util/           # 유틸리티 클래스
```

## 데이터베이스 설계

### User 엔티티
- `id`: 기본키 (자동 증가)
- `username`: 사용자명 (고유값)
- `password`: 암호화된 비밀번호 (BCrypt)

### Todo 엔티티
- `id`: 기본키 (자동 증가)
- `title`: 할 일 제목
- `checked`: 완료 여부 (boolean)
- `createdAt`: 생성 시간
- `user`: 작성자 (N:1 관계)
- `subTodos`: 세부 할 일 목록 (1:N 관계)

### SubTodo 엔티티
- `id`: 기본키 (자동 증가)
- `title`: 세부 할 일 제목
- `checked`: 완료 여부 (boolean)
- `createdAt`: 생성 시간
- `todo`: 상위 할 일 (N:1 관계)

## API 엔드포인트

### 인증 API (`/api/auth`)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인 (세션 기반)
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 로그인한 사용자 조회
- `GET /api/auth/check-username` - 아이디 중복 검사

### Todo API (`/api/todos`)
- `GET /api/todos` - 모든 할 일 조회
- `GET /api/todos/my` - 내가 작성한 할 일 조회 (로그인 필요)
- `POST /api/todos` - 할 일 생성 (로그인 필요)
- `PATCH /api/todos/{id}` - 할 일 제목 수정 (작성자만 가능)
- `PATCH /api/todos/{id}/check` - 할 일 완료 토글 (작성자만 가능)
- `DELETE /api/todos/{id}` - 할 일 삭제 (작성자만 가능)

### SubTodo API (`/api/subtodos`)
- `GET /api/subtodos/{todoId}` - 특정 할 일의 세부 할 일 조회
- `POST /api/subtodos/{todoId}` - 세부 할 일 생성 (Todo 작성자만 가능)
- `PATCH /api/subtodos/{id}` - 세부 할 일 제목 수정 (Todo 작성자만 가능)
- `PATCH /api/subtodos/{id}/check` - 세부 할 일 완료 토글 (Todo 작성자만 가능)
- `DELETE /api/subtodos/{id}` - 세부 할 일 삭제 (Todo 작성자만 가능)

## 주요 기능

### 1. 사용자 인증 및 보안
- **세션 기반 인증**: HTTP 세션을 사용한 사용자 인증
- **BCrypt 패스워드 암호화**: 비밀번호를 안전하게 저장
- **비밀번호 검증**: 영어 소문자 + 특수문자 필수
- **아이디 중복 검사**: 회원가입 시 중복 확인

### 2. 할 일 관리
- 할 일 생성, 조회, 수정, 삭제, 완료 토글
- 작성자별 할 일 조회
- 작성자만 수정/삭제 가능한 권한 관리

### 3. 세부 할 일 관리
- 상위 할 일에 종속된 세부 할 일
- 계층적 구조로 할 일 세분화
- 독립적인 완료 상태 관리
- Todo 작성자만 세부 항목 관리 가능

### 4. 데이터 무결성
- `@JsonIgnore`로 순환 참조 방지
- `@Builder.Default`로 기본값 설정
- `CascadeType.ALL`로 연관 엔티티 관리
- 작성자 확인을 통한 권한 검증

## 설정 파일

### application.yml
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/todolist?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: myblog
    password: myblog123!
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-todolist
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 1q2w3e4r
      MYSQL_DATABASE: todolist
      MYSQL_USER: myblog
      MYSQL_PASSWORD: myblog123!
    ports:
      - "3307:3306"
    volumes:
      - ./mysql_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password
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
- API 엔드포인트: `http://localhost:8080/api/*`

## CORS 설정
프론트엔드(`http://localhost:5173`)에서의 요청을 허용하도록 각 컨트롤러에 `@CrossOrigin` 어노테이션이 설정되어 있습니다. 세션 기반 인증을 위해 `allowCredentials = true` 옵션이 활성화되어 있습니다.

## 인증 및 보안

### 세션 기반 인증
- 로그인 시 HTTP 세션에 사용자 정보 저장
- 세션을 통해 사용자 인증 상태 관리
- 로그아웃 시 세션 무효화

### 패스워드 보안
- BCrypt 알고리즘을 사용한 단방향 해시 암호화
- 비밀번호는 평문으로 저장되지 않음
- 로그인 시 암호화된 비밀번호와 비교

### 권한 관리
- 할 일 및 세부 할 일의 작성자만 수정/삭제 가능
- 세션을 통해 현재 사용자 확인
- 작성자 확인 실패 시 예외 발생

## 데이터 흐름

1. **요청 수신**: REST Controller가 HTTP 요청 수신
2. **인증 확인**: 세션을 통해 사용자 인증 상태 확인 (필요 시)
3. **권한 검증**: 작성자 확인 등 권한 검증 수행
4. **비즈니스 로직**: Service 계층에서 로직 처리
5. **데이터 접근**: Repository를 통해 JPA로 DB 조작
6. **응답 반환**: JSON 형태로 클라이언트에 응답

## 개발 환경
- **IDE**: IntelliJ IDEA / Eclipse
- **빌드 도구**: Gradle
- **데이터베이스**: MySQL 8.0 (Docker)
- **포트**: 8080 (백엔드), 5173 (프론트엔드)

## 주요 특징
- **RESTful API 설계**
- **세션 기반 인증 시스템**
- **BCrypt 패스워드 암호화**
- **JPA/Hibernate ORM**
- **Docker 컨테이너화**
- **JSON 직렬화 최적화**
- **계층형 아키텍처**
- **에러 처리 및 로깅**
- **작성자 기반 권한 관리**
