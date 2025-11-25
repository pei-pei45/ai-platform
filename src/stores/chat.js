import {defineStore} from 'pinia';
import {ref} from 'vue';
import api from '../api/index';

export const useChatStore=defineStore('chat',()=>{
    const messages=ref([]);
    const currentInput=ref('');
    const isLoading=ref(false);
    const isFocused = ref(false);

    const appendUserMessage=(content)=>{
        messages.value.push({role:'user',content});
        return messages.value.length - 1;
    }

    const appendAIPlaceholder=(content)=>{
        messages.value.push({role:'assistant',content:'正在思考...'});
    }

    const appendAIMessage=(content)=>{
        if(messages.value[index]) messages.value[index].content=content;
    }

    const resetConversation=()=>{
        messages.value=[];
        currentInput.value='';
    }

    const sendMessage=async()=>{
        if(isLoading.value || !currentInput.value.trim()) return;
        const userMessage=currentInput.value.trim();
        appendUserMessage(userMessage);
        currentInput.value='';
        appendAIPlaceholder();
        isLoading.value=true;

         try{
        const response=await api.post('/chat',{message:userMessage});
        if(response.success && response.content){
            appendAIMessage(response.content);
        }else{
            appendAIMessage('抱歉，我没有收到回复');
        }
    } catch(error){
        appendAIMessage('请求出错，请稍后再试');
    } finally{
        isLoading.value=false;
    }
    }  
         return {
    messages,
    currentInput,
    isLoading,
    resetConversation,
    sendMessage
 }
});

