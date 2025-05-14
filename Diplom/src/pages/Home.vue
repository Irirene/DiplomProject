<template>
    <Header></Header>

    
    <div class="auth">
        <form @submit.prevent="handleLogin">
            <h4>Авторизации</h4>
            
            <input 
            v-model="login"
            class="input"
            type="text"
            placeholder="Логин">

            <input 
            v-model="password"
            class="input"
            type="text"
            placeholder="Пароль">

            <button class="btn">Войти</button>
        </form>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import api from '@/api';

export default {
        components:  {
            Header,
        },

        data(){
            return{
                login: 'АндиеваИК',
                password: '448257'
            }
        },

        methods:{async handleLogin() {
      try {

        const authHeader = 'Basic 0JDQvdC00LjQtdCy0LDQmNCaOjQ0ODI1Nw==';
        
        const sessionResponse = await api.post('GetSession', {}, {
          headers: { Authorization: authHeader }
        });

        const dssession = sessionResponse.data?.sessionId; 
        localStorage.setItem('dssession', dssession);

        await api.post('SetUserMst', {
          mst: "2252083363908310"
        });

        this.$router.push('/dashboard');

      } catch (error) {
        console.error('Ошибка авторизации:', error);
        alert('Ошибка входа!');
      }
    }
    }
    };
</script>

<style scoped>
*{
padding: 0;
margin: 0;
outline: none;
border: none;
box-sizing: border-box;
}

h4 {
    text-align: center;
    color: #4D7CBF;
}

form{
    display: flex;
    flex-direction: column;
}

.input {
    width: 500px;
    border: 1px solid #4D7CBF;
    padding: 10px 15px;
    margin-top: 10px;
}

.btn {
    align-self: flex-start;
    margin-top: 10px;
    border: 1px solid #4D7CBF;
    color: #4D7CBF;
    padding: 5px 5px;
    background-color: none;
}

</style>