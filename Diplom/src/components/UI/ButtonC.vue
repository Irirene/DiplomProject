<template>
    <button>
        <slot></slot>
    </button>
</template>

<script>
</script>

<style>
    .btn-buttom{
        margin-top: 2px;
        background: none;
        color: #4D7CBF;
        border: 2px solid #4D7CBF;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .btn-left{
        min-width: 0;
        background: none;
        color: #4D7CBF;
        border: 2px solid #4D7CBF;
        border-radius: 5px;
        height: 100%;
        width: 20px;
    }

</style>