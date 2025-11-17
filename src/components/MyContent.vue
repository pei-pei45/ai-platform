<template>
  <div class="page-container">
    <!-- 聊天内容区域 -->
    <div class="chat-content">
      <!-- 初始消息列表 -->
      <div class="message-list" v-if="messages.length > 0">
        <div 
          class="message-item user-message" 
          v-for="(msg, index) in messages" 
          :key="index"
        >
          {{ msg.content }}
        </div>
      </div>
      
      <!-- 初始状态提示 -->
      <div class="initial-prompt" v-else>
        <h1 class="title">人工智能助手</h1>
        <p>请输入你的问题，开始对话吧~</p>
      </div>
    </div>

    <!-- 底部输入框容器（始终显示） -->
    <div class="input-container-bottom">
      <div class="question-input">
        <textarea
          placeholder="请输入你的问题..." 
          @focus="isFocused = true"
          @blur="isFocused = false"
          v-model="currentInput"
          @keyup.enter="handleSend"
        ></textarea>
        <div class="button-example">
          <div class="button-row">
            <el-button>链接</el-button>
            <el-button type="primary">深度思考</el-button>
          </div>
        </div>
      </div>
      <button class="send-btn" @click="handleSend">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElButton } from 'element-plus';

// 响应式变量
const currentInput = ref(''); // 输入框内容
const messages = ref([]); // 消息列表
const isFocused = ref(false);

// 发送消息处理
const handleSend = () => {
  // 验证输入内容
  if (!currentInput.value.trim()) {
    alert('请输入内容后再发送');
    return;
  }

  // 添加消息到列表
  messages.value.push({
    content: currentInput.value.trim(),
    type: 'user'
  });

  // 清空输入框
  currentInput.value = '';

  // 自动滚动到底部（后续添加消息时也会触发）
  scrollToBottom();
};

// 滚动到最新消息
const scrollToBottom = () => {
  const messageList = document.querySelector('.message-list');
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight;
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

/* 页面容器 - 关键：使用flex布局实现内容区+底部输入框结构 */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
    width: 100%;
  background-color: #f9fafb;
  padding: 20px;
}

/* 聊天内容区域 - 自动填充剩余空间 */
.chat-content {
  flex: 1;

  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  overflow-y: auto; /* 内容过多时可滚动 */
  padding-bottom: 20px;
}

/* 初始提示样式 */
.initial-prompt {
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #64748b;
  text-align: center;
  padding: 20px;
}

.initial-prompt .title {
  color: #2d3748;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 28px;
}

/* 消息列表样式 */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0;
}

/* 消息项样式 */
.message-item {
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 18px;
  line-height: 1.5;
  word-wrap: break-word;
}

/* 用户消息样式 */
.user-message {
  align-self: flex-end; /* 靠右显示 */
  background-color: #3182ce;
  color: white;
}

/* 底部输入框容器 - 固定在底部 */
.input-container-bottom {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

/* 输入框样式 */
.question-input {
  flex: 1;
  padding: 15px 25px;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  font-size: 16px;
  transition: all 0.3s ease;
  color: #4a5568;
}

/* 文本输入区域 */
textarea {
  width: 100%;
  min-height: 60px;
  border: none;
  outline: none;
  font-size: 16px;
  resize: vertical;
  margin-bottom: 10px;
  resize: none;
}

.question-input:focus-within {
  border-color: #63b3ed;
  box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.2);
}

/* 发送按钮 */
.send-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3182ce;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-top: 45px;
}

.send-btn:hover {
  background: #2b6cb0;
  transform: scale(1.05);
}

.send-btn:active {
  transform: scale(0.95);
}

.button-example {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.button-row > * {
  margin: 0;
}
</style>