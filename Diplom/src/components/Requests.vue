<template>

    <div id="buttom-section">
        <div class="request-table">
            <h5>Распределенные заявки</h5>
            <ag-grid-vue
                class="task-list ag-theme-alpine"
                :rowData="rowData"
                :columnDefs="columnDefs"
                rowSelection="multiple"             
            >
            </ag-grid-vue>
            
        </div>
        <HistoryRequests class="history-list"></HistoryRequests>
    </div>

</template>

<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import { ref, onMounted } from 'vue';
import "ag-grid-community/styles/ag-theme-alpine.css"

import HistoryRequests from './HistoryRequests.vue';

ModuleRegistry.registerModules([AllCommunityModule]);



export default {
    components: {
        AgGridVue, HistoryRequests
    },
    setup() {
        const columnDefs = ref([]);
        const rowData = ref([]);
        
        onMounted(async () => {
            try {
                const response = await fetch("/requests.json");
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

<style scoped>

#buttom-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;    
}

.requests-list{
    width: 100;
    height: 250px;
}

</style>