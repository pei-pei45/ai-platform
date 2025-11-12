
<template>
  <div class="contain">
    <div class="sidebar-wrapper">
      <!-- 新对话 -->
      <div class="sidebar-header">
        <button class="new-chat-btn">+ 新对话</button>
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

      <!-- 底部-->
      <div class="sidebar-footer">
        <button class="login-btn">登录 / 注册</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

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
</style>