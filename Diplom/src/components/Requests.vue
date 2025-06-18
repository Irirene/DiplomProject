<template>

    <div id="buttom-section">
        <div class="request-table">

            <h5>Распределенные заявки</h5>

            <ag-grid-vue 
            class="task-list ag-theme-alpine" 
            :rowData="rowData" 
            :columnDefs="columnDefs"
            :rowSelection="{ mode: 'singleRow' }">
            </ag-grid-vue>
        </div>

        <ButtonC 
            class="btn-left" 
            @click="toggleHistory">
                {{ showHistory ? '>' : '<' }}
        </ButtonC>
        
        <HistoryRequests 
            v-if="showHistory" 
            class="history-list">
        </HistoryRequests>
    </div>

</template>

<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-theme-alpine.css"

import { ref, watch } from 'vue';
import axios from 'axios';

import HistoryRequests from './HistoryRequests.vue';
import ButtonC from './UI/ButtonC.vue'

ModuleRegistry.registerModules([AllCommunityModule]);

export default {
    components: {
        AgGridVue, HistoryRequests, ButtonC,
    },

    props: {
        taskId: { type: String, required: true }
    },

    setup(props) {
        const columnDefs = ref([]);
        const rowData = ref([]);
        const showHistory = ref(false);

        watch(() => props.taskId, async (newTaskId) => {
            if (!newTaskId) return;
            await GetRequests(newTaskId);
        }, { immediate: true });

        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i=0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
            }
            return null;
        }

        async function GetRequests(taskId) {
            try {
                const session = getCookie('session');

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
                            sortable: true,
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
                            headerStyle: {
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

        function toggleHistory() {
            showHistory.value = !showHistory.value;
        }

        return {
            columnDefs,
            rowData,
            showHistory,
            toggleHistory,
        };
    },
};
</script>

<style scoped>
#buttom-section {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 100%;
    width: 100%;
    gap: 0;
}

.request-table {
    flex: 1 1 auto;
    min-width: 0;
}

.history-list {
    flex: 1 1 150px;
    min-width: 0;
    height: 100%;
}

</style>