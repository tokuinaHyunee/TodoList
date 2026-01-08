import { useState, useEffect, useRef } from "react";
import { login, register, checkUsername } from "../api/todoApi";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // 실시간 검증 오류 메시지
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Debounce를 위한 타이머
  const usernameTimerRef = useRef<number | null>(null);

  // 아이디 중복 검사
  const handleCheckUsername = async (value: string) => {
    if (!value.trim()) {
      setUsernameError("");
      return;
    }
    
    try {
      const res = await checkUsername(value);
      if (res.data.exists) {
        setUsernameError("이미 존재하는 아이디입니다.");
      } else {
        setUsernameError("");
      }
    } catch {
      // 에러 발생 시 중복 검사 실패로 처리하지 않음
      setUsernameError("");
    }
  };


  // 비밀번호 조건 검증
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("");
      return;
    }
    
    const errors: string[] = [];
    
    if (!value.match(/[a-z]/)) {
      errors.push("영어 소문자");
    }
    
    if (!value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
      errors.push("특수문자");
    }
    
    if (errors.length > 0) {
      setPasswordError(`${errors.join(", ")}를 포함해주세요.`);
    } else {
      setPasswordError("");
    }
  };

  // 아이디 변경 핸들러 (debounce 적용)
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    if (isRegister) {
      // 이전 타이머 취소
      if (usernameTimerRef.current) {
        clearTimeout(usernameTimerRef.current);
      }
      
      // 500ms 후에 중복 검사 실행
      usernameTimerRef.current = setTimeout(() => {
        handleCheckUsername(value);
      }, 500);
    }
  };


  // 비밀번호 변경 핸들러 (실시간 검증)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (isRegister) {
      validatePassword(value);
    }
  };

  // 회원가입/로그인 전환 시 오류 메시지 초기화
  useEffect(() => {
    setUsernameError("");
    setPasswordError("");
    setError("");
  }, [isRegister]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (usernameTimerRef.current) {
        clearTimeout(usernameTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    setError(""); // 오류 메시지 초기화
    
    // 회원가입 시 필수 필드 및 검증 오류 확인
    if (isRegister) {
      if (!username.trim()) {
        setError("아이디를 입력해주세요.");
        return;
      }
      if (usernameError) {
        setError(usernameError);
        return;
      }
      if (!password.trim()) {
        setError("비밀번호를 입력해주세요.");
        return;
      }
      if (passwordError) {
        setError(passwordError);
        return;
      }
    } else {
      // 로그인 시 필수 필드 검증
      if (!username.trim()) {
        setError("아이디를 입력해주세요.");
        return;
      }
      if (!password.trim()) {
        setError("비밀번호를 입력해주세요.");
        return;
      }
    }

    try {
      if (isRegister) {
        await register(username, password);
        alert("회원가입 성공!");
        setIsRegister(false);
        setUsername("");
        setPassword("");
      } else {
        await login(username, password);
        // 백엔드가 쿠키로 토큰을 보내므로, 성공만 확인
        onLoginSuccess();
      }
    } catch (e: unknown) {
      const error = e as { 
        response?: { 
          data?: { 
            message?: string;
            error?: string;
          };
          status?: number;
        };
        message?: string;
      };
      
      // 백엔드에서 보낸 오류 메시지 추출
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message ||
        (error.response?.status === 403 ? "접근이 거부되었습니다." : "오류가 발생했습니다.");
      
      setError(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-modal">
        <h3>{isRegister ? "회원가입" : "로그인"}</h3>

        <div>
          <input
            placeholder="아이디"
            value={username}
            onChange={handleUsernameChange}
          />
          {isRegister && usernameError && (
            <div className="error-message" style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
              {usernameError}
            </div>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          {isRegister && passwordError && (
            <div className="error-message" style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
              {passwordError}
            </div>
          )}
        </div>


        {error && <div className="error-message">{error}</div>}

        <button className="primary-btn" onClick={handleSubmit}>
          {isRegister ? "가입하기" : "로그인"}
        </button>

        <button className="secondary-btn" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "로그인으로" : "회원가입으로"}
        </button>

        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
