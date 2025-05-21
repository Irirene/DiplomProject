<template>

    <div id="buttom-section">
        <div class="request-table">
            <h5>Распределенные заявки</h5>
            <ag-grid-vue
                class="task-list ag-theme-alpine"
                :rowData="rowData"
                :columnDefs="columnDefs"
                rowSelection="single"             
            >
            </ag-grid-vue>
            
        </div>
        <HistoryRequests class="history-list"></HistoryRequests>
    </div>

</template>

<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-theme-alpine.css"

import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

import HistoryRequests from './HistoryRequests.vue';

ModuleRegistry.registerModules([AllCommunityModule]);



export default {
    components: {
        AgGridVue, HistoryRequests
    },

    props: {
        taskId: { type: String, required: true }
    },

    setup(props) {
        const columnDefs = ref([]);
        const rowData = ref([]);

        watch(() => props.taskId, async (newTaskId) => {
            if (!newTaskId) return;
            await GetRequests(newTaskId);
        }, { immediate: true });

        async function GetRequests(taskId) {
            try {
                const session = localStorage.getItem("session");
                
                const body = {
                    "init": {
                        "type": "table",
                        "report": "at.aexTTNTrip.r"
                    },
                    "params": {
                        "ID_AEX_TRIP": taskId
                    }
                };
                
                const response = await axios.post(
                    "http://localhost:8010/proxy/aextrip/rt",
                    body,
                    {
                        headers: {
                            Pragma: `${session}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                
                const data = response.data;
                if (data.FieldsOut && Array.isArray(data.FieldsOut)) {
                    columnDefs.value = data.FieldsOut
                    .filter((field) => field.FIELD_VISIBLE === "1")
                    .map((field) => ({
                        headerName: field.FIELD_NAME,
                        field: field.FIELD_CODE,
                        //встроенная фильтрация и сортировка
                        sortable: false,
                        filter: false,
                        width: 150,
                        suppressMovable: true,
                        cellStyle: { 
                            display: 'flex', 
                            // justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            backgroundColor: '#FFF9EF'
                        },
                        headerStyle:{
                            backgroundColor: '#4D7CBF',
                        },
                    }));
                }
                if (data.ALL_DATA && Array.isArray(data.ALL_DATA.result)) {
                    rowData.value = data.ALL_DATA.result;
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }        
        }
        
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

.request-table{
    /* width: 100; */
    height: 100%;
}

</style>