<template>
  <div class="contain">
    <div class="sidebar-wrapper">
      <!-- 新对话 -->
      <div class="sidebar-header">
        <button class="new-chat-btn" @click="resetConversation">+ 新对话</button>
      </div>

      <!-- 历史记录 -->
      <div class="history-container">
        <div class="history-title">历史记录</div>
        <div class="history-list">
          <!-- 历史记录示例项 -->
          <div class="history-item">如何使用 Vue3 开发组件</div>
          <div class="history-item">Element Plus 布局技巧</div>
          <div class="history-item">前端性能优化方案</div>
        </div>
      </div>

      <!-- 底部 -->
      <div class="sidebar-footer">
        <!-- 根据登录状态显示不同内容 -->
        <template v-if="currentUser">
          <div class="user-info">
            <span class="username">{{ currentUser.username }}</span>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
          </div>
        </template>
        <template v-else>
          <button class="login-btn" @click="openLogin">登录 / 注册</button>
        </template>
      </div>
    </div>
  </div>
 
  <!-- 登录弹窗 -->
  <div class="loginmask" v-if="islogin" @click.self="closeLogin">
    <div class="logindialog">
      <button class="dialog-close" @click="closeLogin" aria-label="关闭登录窗口">×</button>
      <h3>登录</h3>
      <form class="login-form" @submit.prevent="handleSubmit">
        <label class="form-label" for="username">用户名</label>
        <input
          id="username"
          type="text"
          class="form-input"
          placeholder="请输入用户名"
          v-model="username"
        />

        <label class="form-label" for="password">密码</label>
        <input
          id="password"
          type="password"
          class="form-input"
          placeholder="请输入密码"
          v-model="password"
        />

        <div class="form-actions">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>记住登录状态</span>
          </label>
        </div>

        <button class="primary-btn" type="submit" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '立即登录' }}
        </button>

        <p class="alternate-action">
          还没有账号？
          <button class="link-btn" type="button" @click="islogin=false,isreguser=true">立即注册</button>
        </p>
      </form>
    </div>
  </div>

  <!-- 注册弹窗 -->
  <div class="loginmask" v-if="isreguser">
    <div class="logindialog">
      <button class="dialog-close" @click="isreguser=false" aria-label="关闭注册窗口">×</button>
      <h3>注册</h3>
      <form class="login-form" @submit.prevent="handleSignup">
        <label class="form-label" for="reg-username">用户名</label>
        <input
          id="reg-username"
          type="text"
          class="form-input"
          placeholder="请输入用户名"
          v-model="username"
        />

        <label class="form-label" for="email">邮箱</label>
        <input
          id="email"
          type="email"
          class="form-input"
          placeholder="请输入邮箱号"
          v-model="email"
        />

        <label class="form-label" for="reg-password">密码</label>
        <input
          id="reg-password"
          type="password"
          class="form-input"
          placeholder="请输入密码"
          v-model="password"
        />

        <button class="primary-btn" type="submit" :disabled="isLoading">
          {{ isLoading ? '注册中...' : '立即注册' }}
        </button>

        <p class="alternate-action">
          已有账号？
          <button class="link-btn" type="button" @click="isreguser=false,islogin=true">去登录</button>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/index';
import {useChatStore} from '../stores/chat'
// 状态管理
const islogin = ref(false);
const isreguser = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const currentUser = ref(null); // 存储当前登录用户信息
const chatStore = useChatStore();

// 初始化时检查登录状态
onMounted(() => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (savedUser && token) {
    currentUser.value = JSON.parse(savedUser);
  }
});

// 打开登录弹窗
const openLogin = () => {
  islogin.value = true;
};

// 关闭登录弹窗
const closeLogin = () => {
  islogin.value = false;
};

// 登录功能实现
const handleSubmit = async () => {
  if (isLoading.value) return;
  if (!username.value || !password.value) {
    alert('请填写用户名和密码');
    return;
  }
  isLoading.value = true;
  try {
    const response = await api.post('/login', {
      username: username.value,
      password: password.value
    });
    
    // 保存 token 和用户信息
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (rememberMe.value) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      // 更新当前用户信息
      currentUser.value = response.user;
      alert('登录成功！');
      closeLogin();
      // 清空表单
      username.value = '';
      password.value = '';
    }
  } catch (error) {
    console.error('登录失败:', error);
    const errorMessage = error.response?.data?.error || error.response?.data?.message || '登录失败，请检查用户名和密码';
    alert(errorMessage);
  } finally {
    isLoading.value = false;
  }
};


// 注册功能实现
const handleSignup = async () => {
  if (isLoading.value) return;
  if (!username.value || !email.value || !password.value) {
    alert('请填写完整的注册信息');
    return;
  }
  
  // 简单邮箱验证
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(email.value)) {
    alert('请输入有效的邮箱地址');
    return;
  }
  
  isLoading.value = true;
  try {
    await api.post('/reguser', {
      username: username.value,
      email: email.value,
      password: password.value
    });  
    alert('注册成功，请登录！');
    isreguser.value = false;
    islogin.value = true;
  } catch(error) {
    console.error('注册失败:', error);
    const errorMessage = error.response?.data?.error || error.response?.data?.message || '注册失败，请重试';
    alert(errorMessage);
  } finally {
    isLoading.value = false;
    // 清空表单
    username.value = '';
    email.value = '';
    password.value = '';
  }
};

// 退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser.value = null;
    alert('已退出登录');
  }
};

const resetConversation = () => {
  chatStore.resetConversation();
  };
</script>
<style>
.contain {
  width: 240px; 
  background-color: #f0f0f0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05); 
}

/* 侧边栏整体布局 - flex 垂直分布 */
.sidebar-wrapper {
  height: 100vh; 
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
}

/* 顶部新对话按钮 */
.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5; 
}

.new-chat-btn {
  width: 100%;
  padding: 10px 0;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.new-chat-btn:hover {
  background-color: #66b1ff; 
}

/* 中间历史记录区域 */
.history-container {
  flex: 1; 
  padding: 16px;
  overflow-y: auto; 
}

.history-title {
  font-size: 12px;
  color: #888;
  margin-bottom: 12px;
  font-weight: 500;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-item {
  padding: 10px 12px;
  background-color: white;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap; 
  overflow: hidden; 
}

.history-item:hover {
  background-color: #f5f5f5;
}


/* 底部登录区域 - 固定在底部 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e5e5e5; /* 分隔线 */
}

.login-btn {
  width: 100%;
  padding: 10px 0;
  background-color: white;
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover {
  background-color: #f0f7ff;
}

/* 滚动条美化（仅针对历史记录区域） */
.history-container::-webkit-scrollbar {
  width: 6px;
}

.history-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}

.history-container::-webkit-scrollbar-track {
  background-color: transparent;
}

.loginmask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保弹窗在最上层 */
}

/* 登录/注册模块容器样式 */
.logindialog {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 360px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
  position: relative;
  animation: popIn 0.3s ease;
}

.logindialog h3 {
  font-size: 20px;
  color: #1f2d3d;
  text-align: center;
  margin-bottom: 8px;
}

.dialog-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  border: none;
  background: #f5f7fa;
  border-radius: 50%;
  font-size: 18px;
  color: #4e5969;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.dialog-close:hover {
  background: #e5e6eb;
  color: #1d2129;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  font-size: 13px;
  color: #4e5969;
  font-weight: 500;
}

.form-input {
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
  outline: none;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4e5969;
}

.link-btn {
  border: none;
  background: transparent;
  color: #409eff;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
}

.link-btn:hover {
  text-decoration: underline;
}

.primary-btn {
  margin-top: 8px;
  width: 100%;
  padding: 12px 0;
  background: linear-gradient(135deg, #409eff, #36cfc9);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alternate-action {
  text-align: center;
  font-size: 13px;
  color: #86909c;
  margin-top: 14px;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.user-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.username {
  color: #333;
  font-size: 14px;
  text-align: center;
  padding: 5px 0;
}

.logout-btn {
  width: 100%;
  padding: 8px 0;
  background-color: #f5f7fa;
  color: #f56c6c;
  border: 1px solid #f56c6c;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #fff5f5;
}
</style>