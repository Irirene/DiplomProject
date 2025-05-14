<template>
<div class="tasks-outer">
    <div class="buttons">
        <AddForm></AddForm>
        <button class="task_buttons"><img src="/src/images/edit.png" alt=""></button>
        <button class="task_buttons"><img src="/src/images/del.png" alt=""></button>
    </div>
        
    <h5>Список заданий экспедитору</h5>

    <div class="tasks-grid-row">
        <ag-grid-vue
            class="task-list ag-theme-alpine"
            :rowData="rowData"
            :columnDefs="columnDefs"
            rowSelection="multiple"             
        >
        </ag-grid-vue>
    </div>
</div>

</template>



<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import { ref, onMounted } from 'vue';
import "ag-grid-community/styles/ag-theme-alpine.css"

import AddForm from './UI/AddForm.vue';

ModuleRegistry.registerModules([AllCommunityModule]);



export default {
    components: {
        AgGridVue, AddForm
    },
    setup() {
        const columnDefs = ref([]);
        const rowData = ref([]);
        
        onMounted(async () => {
            try {
                const response = await fetch("/tasks.json");
                const data = await response.json();
                if (data.FieldsOut && Array.isArray(data.FieldsOut)) {
                    columnDefs.value = data.FieldsOut
                    .filter((field) => field.FIELD_VISIBLE === "1")
                    .map((field) => ({
                        headerName: field.FIELD_NAME,
                        field: field.FIELD_CODE,
                        //встроенная фильтрация и сортировка
                        sortable: false,
                        filter: false,
                    }));
                }
                if (data.ALL_DATA && Array.isArray(data.ALL_DATA.result)) {
                    rowData.value = data.ALL_DATA.result;
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        });
        return {
            columnDefs,
            rowData,
        };},
};
</script>

<style>
.tasks-outer {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.tasks-grid-row {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
}

.task-list{
    flex: 1 1 auto;
    min-height: 0;
    height: 100%;
}
h5{
    color: #4D7CBF;
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    box-sizing: border-box;
    margin-left: 15px;    
}

/* img{
    width: 5%;
    display: flex;
} */

button{
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    background-color: white;
}

.ag-cell{
    background-color: #CFE1F4;
}

.ag-header{
    background-color: #4D7CBF;    
}

.task-grid{
    display: flex;
}

.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  padding: 0;
  margin: 0;
}

.task_buttons{
  width: 20px;
  height: 20px;
  padding: 0;
  margin: 0;
  background-color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.task_buttons img {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
}

</style>