<template>
    <nav>
        <div class="nav-logo">
            <a href="/auth">
                <img src="../images/logo.png" alt="">
            </a>
        </div>

        <ul class="nav-links">

            <li class="link"><a href="#">Руководитель</a></li>
            <li class="link"><a href="#">ОРК</a></li>
            <li class="link"><a href="#">ПГР</a></li>
            <li class="link"><a href="#">Склад</a></li>
            <li class="link"><a href="#">ТовСклад</a></li>

            <li class="link"><a href="/expeditor">Экспедирование</a></li>

            <li class="link"><a href="#">Проводники</a></li>
            <li class="link"><a href="#">Кадры</a></li>
            <li class="link"><a href="#">Бухгалтер</a></li>
            <li class="link"><a href="#">Прайсы</a></li>
            <li class="link"><a href="#">Логистика</a></li>
            <li class="link"><a href="#">Тр.средства</a></li>
            <li class="link"><a href="#">Модель</a></li>
            <li class="link"><a href="#">ШК</a></li>
            <li class="link"><a href="#">Настройки</a></li>
        </ul>

    </nav>
</template>

<script>
</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    box-sizing: border-box;
}

img {
    width: 85%;
    display: flex;
}

a {
    text-decoration: none;
}

nav {
    max-width: 100%;
    margin: auto;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 21px;
}

.nav-logo {
    max-width: 100px;
    flex-shrink: 0;
}

.nav-links {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 21px;
    margin: 0 auto;
    flex-wrap: nowrap;
}

.link a {
    position: relative;
    text-decoration: none;
    color: #000000;
}

.link a::after {
    content: "";
    position: absolute;
    height: 25px;
    width: 0;
    bottom: -5px;
    left: 0;
    background-color: #CFE1F4;
    border-radius: 8px;
    transition: all 0.7s ease;
    z-index: -1;
}

.link a:hover::after {
    width: 115%;
    left: -7.5%;
}
</style>