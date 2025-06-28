import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Fade,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Refresh,
  Lock,
  Person,
  Security,
  Error
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useUserStore } from '../stores/StoreProvider';

// 图形验证码组件
interface CaptchaProps {
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  error?: boolean;
}

const Captcha: React.FC<CaptchaProps> = ({ value, onChange, onRefresh, error }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 生成随机验证码
  const generateCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsGenerating(true);

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 生成随机字符
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let text = '';
    for (let i = 0; i < 4; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);

    // 创建渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格背景
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // 绘制干扰线
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `hsla(${Math.random() * 360}, 70%, 70%, 0.6)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 绘制干扰点
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 70%, 0.4)`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3 + 1,
        Math.random() * 3 + 1
      );
    }

    // 绘制文字
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < text.length; i++) {
      const x = 25 + i * 22;
      const y = canvas.height / 2;
      
      // 文字阴影
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillText(text[i], x + 1, y + 1);
      
      // 主文字
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 40%)`;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    setTimeout(() => setIsGenerating(false), 300);
  };

  // 初始化验证码
  useEffect(() => {
    generateCaptcha();
  }, []);

  // 刷新验证码
  const handleRefresh = () => {
    generateCaptcha();
    onRefresh();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField
        label="验证码"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        sx={{ flex: 1 }}
        error={error}
        helperText={error ? "验证码错误" : ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Security sx={{ fontSize: 20, color: error ? 'error.main' : 'inherit' }} />
            </InputAdornment>
          ),
        }}
      />
      <Paper
        sx={{
          width: 120,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
          border: error ? '2px solid #d32f2f' : '1px solid #ddd',
          borderRadius: 1,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)'
          }
        }}
        onClick={handleRefresh}
      >
        <canvas
          ref={canvasRef}
          width={120}
          height={40}
          style={{ display: 'block' }}
        />
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            right: 2,
            top: 2,
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)'
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleRefresh();
          }}
        >
          <Refresh sx={{ fontSize: 16 }} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export const Login: React.FC = observer(() => {
  const userStore = useUserStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 清除错误信息
    if (error) {
      setError('');
    }
    if (captchaError && field === 'captcha') {
      setCaptchaError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCaptchaError(false);

    try {
      // 验证表单
      if (!formData.username || !formData.password || !formData.captcha) {
        setError('请填写所有必填字段');
        return;
      }

      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟验证码验证
      if (formData.captcha.toUpperCase() !== 'ABCD') {
        setCaptchaError(true);
        setError('验证码错误，请重新输入');
        return;
      }

      // 模拟用户数据
      const mockUser = {
        id: '1',
        username: formData.username,
        email: `${formData.username}@example.com`,
        role: 'admin',
        avatar: ''
      };

      const mockToken = 'mock-token-' + Date.now();

      // 登录成功
      userStore.login(mockUser, mockToken);

      // 如果记住我，保存用户名
      if (formData.rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      // 跳转到仪表盘
      window.location.href = '/dashboard';

    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  // 加载记住的用户名
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setFormData(prev => ({
        ...prev,
        username: rememberedUsername,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 2,
        boxSizing: 'border-box'
      }}
    >
      <Fade in timeout={800}>
        <Card
          sx={{
            maxWidth: 400,
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.95)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                欢迎登录
              </Typography>
              <Typography variant="body2" color="textSecondary">
                请输入您的账户信息
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="用户名"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  size="medium"
                  error={!!error && !formData.username}
                  helperText={error && !formData.username ? "请输入用户名" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ fontSize: 20, color: error && !formData.username ? 'error.main' : 'inherit' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="密码"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  size="medium"
                  error={!!error && !formData.password}
                  helperText={error && !formData.password ? "请输入密码" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: 20, color: error && !formData.password ? 'error.main' : 'inherit' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Captcha
                  value={formData.captcha}
                  onChange={(value) => handleInputChange('captcha', value)}
                  onRefresh={() => handleInputChange('captcha', '')}
                  error={captchaError}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="记住我"
                  />
                  <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                    忘记密码？
                  </Link>
                </Box>

                {error && (
                  <Alert severity="error" icon={<Error />}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    boxShadow: '0 3px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                      boxShadow: '0 5px 20px rgba(102, 126, 234, 0.6)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #ccc 30%, #999 90%)',
                      boxShadow: 'none',
                    }
                  }}
                >
                  {loading ? '登录中...' : '登录'}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    或
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    还没有账户？{' '}
                    <Link href="#" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                      立即注册
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}); 