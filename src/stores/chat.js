import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/index';

export const useChatStore = defineStore('chat', () => {
  const messages = ref([]);
  const currentInput = ref('');
  const isLoading = ref(false);
  const currentChatId = ref(null); // 当前对话ID

  const appendUserMessage = (content) => {
    messages.value.push({ role: 'user', content });
    return messages.value.length - 1;
  };

  const appendAIPlaceholder = () => {
    messages.value.push({ role: 'assistant', content: '正在思考...' });
    return messages.value.length - 1;
  };

  const updateMessage = (index, content) => {
    if (messages.value[index]) {
      messages.value[index].content = content;
    }
  };

  const resetConversation = () => {
    messages.value = [];
    currentInput.value = '';
    currentChatId.value = null;
  };

  // 加载历史对话
  const loadConversation = (chatId, messageList) => {
    currentChatId.value = chatId;
    messages.value = messageList || [];
  };

  const sendMessage = async () => {
    if (isLoading.value || !currentInput.value.trim()) return;

    const userMessage = currentInput.value.trim();
    currentInput.value = '';

    appendUserMessage(userMessage);
    const aiIndex = appendAIPlaceholder();
    isLoading.value = true;

    try {
      const response = await api.post('/chat', {
        message: userMessage,
        chatId: currentChatId.value
      });

      if (response.success && response.content) {
        updateMessage(aiIndex, response.content);
        // 如果是新对话，保存返回的 chatId
        if (response.chatId) {
          currentChatId.value = response.chatId;
        }
      } else {
        updateMessage(aiIndex, '抱歉，我没有收到回复');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      updateMessage(aiIndex, '请求出错，请稍后再试');
    } finally {
      isLoading.value = false;
    }
  };

  return {
    messages,
    currentInput,
    isLoading,
    currentChatId,
    resetConversation,
    sendMessage,
    loadConversation
  };
});