<template>
    <h5>Нераспределенные заявки</h5>
    <ag-grid-vue
        class="unrequests-list"
        :rowData="rowData"
        :columnDefs="columnDefs"
        rowSelection="multiple"             
    >
    </ag-grid-vue>
</template>

<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-theme-alpine.css"

import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

ModuleRegistry.registerModules([AllCommunityModule]);



export default {
    components: {
        AgGridVue,
    },

    props: {
    taskId: { type: String, default: null },
    taskDate: { type: String, default: null }
    },

    setup(props) {
        const columnDefs = ref([]);
        const rowData = ref([]);

        watch(() => [props.taskId, props.taskDate], async ([newTaskId, newTaskDate]) => {
            if (!newTaskId || !newTaskDate) return;
            await GetUnRequests(newTaskId, newTaskDate);
        }, { immediate: true });


        async function GetUnRequests(taskId, taskDate) {
            try {
                const session = localStorage.getItem("session");
                const dateWithTime = props.tripDate;
                const onlyDate = dateWithTime ? dateWithTime.split(' ')[0] : '';

                const body = {
                    "init": {
                        "type": "table",
                        "report": "at.aexTTNTripAexoFree.r"
                    },
                    "params": {
                        "DATA_S": onlyDate,
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
                            backgroundColor: '#FFF9EF',
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

/* .ag-cell{
    background-color: #FFF9EF;
} */

.unrequests-list{
    /* width: 100; */
    height: 100%;
}

</style>