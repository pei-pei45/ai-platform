<template>
    <div class="container">
        <div class="chat-card">
            <h1 class="title">人工智能助手</h1>
            <div class="input-container">
               <div class="question-input">
                 <textarea
                    type="text" 
                    placeholder="请输入你的问题..." 
                    
                    @focus="isFocused = true"
                    @blur="isFocused = false"
                ></textarea>
                <div class="button-example">
                 <div class="button-row">
                        <el-button>链接</el-button>
                        <el-button type="primary">深度思考</el-button>
                  </div>
               </div>
               </div>
                <button class="send-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isFocused: false
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 容器样式 */
.container {
    width: 1000px;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin: 50px auto;
}

/* 卡片样式 */
.chat-card {
    width: 100%;
    max-width: 850px;
    background: #ffffff;
    border-radius: 20px;
    padding: 40px 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}
/* 标题样式 */
.title {
    text-align: center;
    color: #2d3748;
    margin-bottom: 40px;
    font-weight: 600;
    font-size: 28px;
    letter-spacing: 0.5px;
}

/* 输入容器 */
.input-container {
    display: flex;
    gap: 15px;
    width: 100%;
}

/* 输入框样式 */
.question-input {
    flex: 1;
    height: 100px;
    padding: 5px 25px;
    border: 1px solid #e2e8f0;
    border-radius: 15px;
    font-size: 16px;
    resize: none;
    transition: all 0.3s ease;
    color: #4a5568;
    vertical-align: top;
}
  /* 文本输入 */
textarea {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-size: 16px;
     resize: none;
}

.question-input::placeholder {

    color: #a0aec0;
    transition: color 0.3s ease;
}

.question-input:focus {
    outline: none;
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
    margin-top: 25px;
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