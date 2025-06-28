import { makeAutoObservable } from 'mobx';

// 用户信息接口
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

// 应用状态接口
export interface AppState {
  isLoading: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
}

// 用户状态管理
class UserStore {
  user: User | null = null;
  isAuthenticated = false;
  token: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initFromStorage();
  }

  // 从本地存储初始化
  initFromStorage() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        this.token = token;
        this.user = JSON.parse(userStr);
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Failed to parse user data:', error);
        this.logout();
      }
    }
  }

  // 设置用户信息
  setUser(user: User) {
    this.user = user;
    this.isAuthenticated = true;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // 设置 token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // 登录
  login(user: User, token: string) {
    this.setUser(user);
    this.setToken(token);
  }

  // 登出
  logout() {
    this.user = null;
    this.isAuthenticated = false;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // 更新用户信息
  updateUser(userData: Partial<User>) {
    if (this.user) {
      this.user = { ...this.user, ...userData };
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }
}

// 应用状态管理
class AppStore {
  isLoading = false;
  sidebarCollapsed = false;
  theme: 'light' | 'dark' = 'light';

  constructor() {
    makeAutoObservable(this);
    this.initFromStorage();
  }

  // 从本地存储初始化
  initFromStorage() {
    const theme = localStorage.getItem('theme') as 'light' | 'dark';
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    
    if (theme) {
      this.theme = theme;
    }
    if (sidebarCollapsed !== null) {
      this.sidebarCollapsed = JSON.parse(sidebarCollapsed);
    }
  }

  // 设置加载状态
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  // 切换侧边栏
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
  }

  // 设置侧边栏状态
  setSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }

  // 切换主题
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
  }

  // 设置主题
  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }
}

// 根状态管理
export class RootStore {
  userStore: UserStore;
  appStore: AppStore;

  constructor() {
    this.userStore = new UserStore();
    this.appStore = new AppStore();
  }
}

// 创建根状态实例
export const rootStore = new RootStore(); 