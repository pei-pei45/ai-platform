import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import api from '../api/index';

export const useChatStore = defineStore('chat', () => {
  const messages = ref([]);
  const currentInput = ref('');
  const isLoading = ref(false);
  const currentChatId = ref(null); // 当前对话ID
  const chatTitle = ref('新对话'); // 当前对话标题

  const appendUserMessage = (content) => {
    messages.value.push({ role: 'user', content });
    return messages.value.length - 1;
  };

  const appendAIMessage = (content) => {
    messages.value.push({ role: 'assistant', content });
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
    chatTitle.value = '新对话';
  };

  // 加载历史对话
  const loadConversation = (chatId, messageList, title = '新对话') => {
    currentChatId.value = chatId;
    chatTitle.value = title;
    // 确保消息格式正确，包含created_at字段
    messages.value = (messageList || []).map(msg => ({
      role: msg.role,
      content: msg.content,
      created_at: msg.created_at
    }));
  };

  // 保存消息到数据库
  const saveMessageToDatabase = async (chatId, role, content) => {
    try {
      await api.post(`/conversations/${chatId}/messages`, {
        role,
        content
      });
      return true;
    } catch (error) {
      console.error(`保存${role}消息失败:`, error);
      return false;
    }
  };

  // 根据第一条消息自动更新对话标题
  const updateChatTitleIfNeeded = async (chatId, firstMessage) => {
    try {
      // 只有当对话标题是默认值时才更新
      if (chatTitle.value === '新对话' && firstMessage) {
        // 截取前20个字符作为标题
        const newTitle = firstMessage.substring(0, 20) + (firstMessage.length > 20 ? '...' : '');
        await api.put(`/conversations/${chatId}`, {
          title: newTitle
        });
        chatTitle.value = newTitle;
      }
    } catch (error) {
      console.error('更新对话标题失败:', error);
    }
  };

  const sendMessage = async () => {
    if (isLoading.value || !currentInput.value.trim()) return;

    const userMessage = currentInput.value.trim();
    currentInput.value = '';

    const userMessageIndex = appendUserMessage(userMessage);
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
        if (response.chatId && !currentChatId.value) {
          currentChatId.value = response.chatId;
          // 如果是新创建的对话，尝试更新标题
          await updateChatTitleIfNeeded(response.chatId, userMessage);
        }
        
        // 如果有当前对话ID，保存消息到数据库
        if (currentChatId.value) {
          // 并行保存用户和AI消息，提高性能
          await Promise.all([
            saveMessageToDatabase(currentChatId.value, 'user', userMessage),
            saveMessageToDatabase(currentChatId.value, 'assistant', response.content)
          ]);
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

  // 创建新对话
  const createNewConversation = async (title = '新对话') => {
    try {
      const response = await api.post('/conversation', { title });
      if (response.conversation) {
        resetConversation();
        currentChatId.value = response.conversation.id;
        chatTitle.value = response.conversation.chat_name;
        return response.conversation.id;
      }
    } catch (error) {
      console.error('创建新对话失败:', error);
      // 即使创建对话失败，也重置当前状态
      resetConversation();
    }
    return null;
  };

  // 删除当前对话
  const deleteCurrentConversation = async () => {
    if (!currentChatId.value) return false;
    
    try {
      await api.delete(`/conversations/${currentChatId.value}`);
      resetConversation();
      return true;
    } catch (error) {
      console.error('删除对话失败:', error);
      return false;
    }
  };

  // 更新对话标题
  const updateCurrentChatTitle = async (newTitle) => {
    if (!currentChatId.value || !newTitle || !newTitle.trim()) return false;
    
    try {
      const response = await api.put(`/conversations/${currentChatId.value}`, {
        title: newTitle.trim()
      });
      if (response.conversation) {
        chatTitle.value = response.conversation.chat_name;
        return true;
      }
    } catch (error) {
      console.error('更新对话标题失败:', error);
    }
    return false;
  };

  // 监听聊天ID变化，触发相关组件更新
  watch(currentChatId, (newId) => {
    console.log('当前对话ID已更新:', newId);
    // 这里可以触发其他副作用，比如更新本地存储等
  });

  return {
    messages,
    currentInput,
    isLoading,
    currentChatId,
    chatTitle,
    resetConversation,
    sendMessage,
    loadConversation,
    createNewConversation,
    deleteCurrentConversation,
    updateCurrentChatTitle
  };
});