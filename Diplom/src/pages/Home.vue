<template>
    <Header></Header>


    <div class="auth">
        <form>
            <h4>Авторизация</h4>

            <input 
            v-model="login"
            class="input"
            type="text"
            placeholder="Логин">

            <input 
            v-model="password"
            class="input"
            type="password"
            placeholder="Пароль">

            <div class="btn-line">
                <button type="button" class="btn" @click="reg">Войти</button>
                <button type="button" class="btn" @click="logout">Выйти</button>
            </div>

        </form>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';

import axios from 'axios';

export default {
    components: {
        Header,
    },

    data() {
        return {
            login: '', //АндиеваИК
            password: '' //448257
        }
    },

    methods: {
        async reg() {
            try {

                //Получение сессии
                const sessionResponse = await axios.post(
                    'http://localhost:8010/proxy/aextrip/GetSession',
                    {
                        login: this.login,
                        password: this.password
                    },
                    {
                        headers: {
                            'Authorization': 'Basic 0JDQvdC00LjQtdCy0LDQmNCaOjQ0ODI1Nw==',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const session = sessionResponse.data.Pragma;

                localStorage.setItem('session', session);
                this.session = session;

                //Установка станции
                await axios.post(
                    'http://localhost:8010/proxy/aextrip/SetUserMst',
                    {
                        mst: "2252083363908310"
                    },
                    {
                        headers: {
                            'Pragma': session,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                this.$router.push({ name: 'Expeditor' });

            } catch (error) {
                console.error('Ошибка:', error);
                alert(`Ошибка авторизации: ${error.response?.data?.message || error.message}`);
            }
        },

        logout() {
            localStorage.removeItem('session');
            localStorage.clear(); //очистить все ключи
            this.$router.push({ name: 'Auth' });
            alert('Вы вышли!!');
        }
    }
}
</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    box-sizing: border-box;
}

h4 {
    text-align: center;
    font-size: 24px;
    color: #4D7CBF;
}

form {
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
    margin-right: 5px;
    border: 1px solid #4D7CBF;
    color: #4D7CBF;
    padding: 5px 5px;
    background-color: none;
}

.auth {
    padding: 0px 20px 0px 25px;
}
</style>