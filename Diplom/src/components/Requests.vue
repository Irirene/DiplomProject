<template>

    <div id="buttom-section">
        <div class="request-table">

            <div class="buttons">
                <div class="dropdown">
                    <button class="requ_buttons" @click="toggleDropdown">
                        <img src="/src/images/disp.jpg" alt="" />
                        Диспетчер</button>
                    <div v-if="isDropdownOpen" class="dropdown-menu">
                        <button @click="receiving"
                        :disabled="taskStatus === 2">Получения груза от клиента</button>
                        <button @click="delivery">Выдача груза клиенту</button>
                    </div>                    
                </div>

                <button class="requ_buttons" @click="onButtonClick" title="Удалить заявку">
                        <img src="/src/images/del.png" alt="" />
                    </button>
            </div>

            <h5>Распределенные заявки</h5>

            <ag-grid-vue
            @grid-ready="onGridReady" 
            class="task-list ag-theme-alpine" 
            :rowData="rowData" 
            :columnDefs="columnDefs"
            :rowSelection="{ 
                mode: 'singleRow',
                enableClickSelection: true 
                }"
            @rowClicked="onRowClicked">
            </ag-grid-vue>
        </div>

        <ButtonC 
            class="btn-left" 
            @click="toggleHistory">
                {{ showHistory ? '>' : '<' }}
        </ButtonC>
        
        <HistoryRequests 
            v-if="showHistory" 
            class="history-list"
            :taskId="taskId"
            :idRec="selectedIdRec">
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
        taskId: { type: String, required: true },
        taskStatus: { type: Number, required: true  },
    },

    setup(props) {
        const columnDefs = ref([]);
        const rowData = ref([]);
        const showHistory = ref(false);
        const gridApi = ref(null);

        const selectedRow = ref(null);

        const isDropdownOpen = ref(false);

        const selectedIdRec = ref("");

        watch(() => props.taskId, async (newTaskId) => {
            if (!newTaskId) return;
            await GetRequests(newTaskId);
        }, { immediate: true });

        // watch(() => props.taskStatus, (newVal) => {
        //     console.log("Получено значение taskStatus:", newVal);
        // }, { immediate: true });

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

        function getCurrentDateTime() {
            const now = new Date();
            const pad = (n) => n < 10 ? '0' + n : n;
            return (
                pad(now.getDate()) + '.' +
                pad(now.getMonth() + 1) + '.' +
                now.getFullYear() + ' ' +
                pad(now.getHours()) + ':' +
                pad(now.getMinutes())
            );
        }
        
        function onGridReady(params) {
            gridApi.value = params.api;
        }

        function toggleDropdown() {
            isDropdownOpen.value = !isDropdownOpen.value;
        }

        async function receiving() {
            isDropdownOpen.value = false;

            if (props.taskStatus == 2) {
                alert("Нельзя выполнить для заданий со статусом 2");
                return;
            }

            if (!selectedRow.value) {
                alert("Выберите заявку в таблице");
                return;
            }
            const session = getCookie('session');
            
            const body = {
                init: {
                    type: "data",
                    report: "at.setInsSTrip02490.w"
                },
                params: {
                    aex_strip_id_aex_trip: props.taskId,             
                    aex_strip_id_aex_ttntrip: selectedRow.value.ID_AEX_TTNTRIP,       
                    aex_strip_id_ttn: selectedRow.value.ID_REC,                        
                    aex_strip_dt: getCurrentDateTime()                                
                }
            };
            
            try {
                await axios.post(
                    "http://localhost:8010/proxy/aextrip/rt",
                    body,
                    {
                        headers: {
                            Pragma: `${session}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                alert("Событие получения груза успешно отправлено");
                await GetRequests(props.taskId);
            } catch (error) {
                console.error("Ошибка при отправке события получения груза:", error);
                alert("Ошибка при отправке события");
            }
        }
        

        async function delivery() {
            isDropdownOpen.value = false;

            if (!selectedRow.value) {
                alert("Выберите заявку в таблице");
                return;
            }
            const session = getCookie('session');
            
            const body = {
                init: {
                    type: "data",
                    report: "at.setInsSTrip0259.w"
                },
                params: {
                    aex_strip_id_aex_trip: props.taskId,             
                    aex_strip_id_aex_ttntrip: selectedRow.value.ID_AEX_TTNTRIP,        
                    aex_strip_id_ttn: selectedRow.value.ID_REC,                        
                    aex_strip_dt: getCurrentDateTime(),
                    aex_strip_ptip: "0"
                }
            };
            
            try {
                await axios.post(
                    "http://localhost:8010/proxy/aextrip/rt",
                    body,
                    {
                        headers: {
                            Pragma: `${session}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                alert("Событие получения груза успешно отправлено");
                await GetRequests(props.taskId);
            } catch (error) {
                console.error("Ошибка при отправке события получения груза:", error);
                alert("Ошибка при отправке события");
            }
        }

        function onRowClicked(event) {
            selectedRow.value = event.data;
            selectedIdRec.value = String(event.data.ID_REC);
        }


        async function GetRequests(taskId) {
            if (gridApi.value) {
                gridApi.value.showLoadingOverlay();
            }
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
            } finally {
                if (gridApi.value) {
                    gridApi.value.hideOverlay();
                }
            }
        }

        function toggleHistory() {
            showHistory.value = !showHistory.value;
        }


        async function onButtonClick() {
            if (!selectedRow.value) {
                alert("Выберите нераспределенную заявку");
                return;
            }
            const body = {
                "init": {
                    "type": "data",
                    "report": "at.setAexTTNTripDel.w"
                },
                "params": {
                    "id_aex_ttntrip": selectedRow.value.ID_AEX_TTNTRIP
                }
            };
            
            try {
                const session = getCookie('session');
                await axios.post(
                    "http://localhost:8010/proxy/aextrip/rt",
                    body,
                    {
                        headers: {
                            Pragma: `${session}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                alert("Заявка удалена");
                await GetRequests(props.taskId);
            } catch (error) {
                console.error("Ошибка при выполнении запроса:", error);
                alert("Ошибка при удалении заявки");
            }
        }

        return {
            columnDefs,
            rowData,
            gridApi,
            onGridReady,


            showHistory,
            toggleHistory,
            isDropdownOpen,
            toggleDropdown,
            receiving,
            delivery,
            onRowClicked,
            onButtonClick,

            selectedIdRec,
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
    height: 325px;
}

.history-list {
    flex: 1 1 150px;
    min-width: 0;
    height: 100%;
}


.dropdown {
  position: relative;
  display: flex;
  gap: 10px;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 10px;
  background-color: white;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  min-width: 100px;
  z-index: 1000;
}

.dropdown-menu button {
  padding: 5px 10px ;
  border-top: 1px solid #dad8d8;
  border-bottom: 1px solid #dad8d8;
  background: none;
  text-align: left;
  cursor: pointer;
  width: 200px;
}

.dropdown-menu button:hover {
  background-color: #eee;
}

.requ_buttons {
  width: 35px;
  height: 35px;
  padding: 0;
  margin-left: 10px ;
  background-color: white;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.requ_buttons img {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  margin-right: 5px;
}

.buttons {
  display: flex;
  gap: 65px;
  align-items: center;
  flex-wrap: wrap;
}
</style>