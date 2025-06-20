<template>
    <div>
        <div class="buttons">
            <button class="his_buttons" @click="loadTtnHistory">
                <label for="">История по поручению</label>
            </button>

            <button class="his_buttons" @click="loadTaskHistiry">
                <label for="">История по заданию </label>
            </button>
        </div>

        <h5>История</h5>
        <ag-grid-vue 
            @grid-ready="onGridReady"
            class="history-list"
            :rowData="rowData"
            :columnDefs="columnDefs"
            :rowSelection="{ mode: 'singleRow', enableClickSelection: true }">
        </ag-grid-vue>
    </div>
</template>

<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import { ref } from 'vue';
import axios from 'axios';
import "ag-grid-community/styles/ag-theme-alpine.css"

ModuleRegistry.registerModules([AllCommunityModule]);

export default {
    components: {
        AgGridVue,
    },
    props: {
        taskId: { type: String, required: true },
        idRec: { type: [String, Number], required: true }
    },
    setup(props) {
        console.log('Полученный taskId:', props.taskId);
        const columnDefs = ref([]);
        const rowData = ref([]);
        const gridApi = ref(null);

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

        function onGridReady(params) {
            gridApi.value = params.api;
        }

        async function loadTaskHistiry() {
            if (gridApi.value) {
                gridApi.value.showLoadingOverlay();
            }
            // console.log('loadTaskHistory вызвана');
            const session = getCookie('session');
            const body = {
                init: {
                    type: "table",
                    report: "at.getListAexStrip.r"
                },
                params: {
                    ID_AEX_TRIP: props.taskId,
                    ID_VLST_10026: "10026",
                    VID_00: "0",
                    VID_01: "1"
                }
            };

            try {
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
                // console.log('Ответ сервера:', data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                if (gridApi.value) {
                    gridApi.value.hideOverlay();
                }
            }
        }

        async function loadTtnHistory() {
            if (gridApi.value) {
                gridApi.value.showLoadingOverlay();
            }
            // console.log('loadTtnHistory вызвана');
            if (!props.idRec) {
                alert('Не выбрана заявка');
                return;
            
            }
            const session = getCookie('session');
            const body = {
                init: {
                    type: "table",
                    report: "at.getListTtnAexStrip.r"
                },
                params: {
                    ID_REC: props.idRec,
                    A_ID_VLST_10026: "10026"
                }
            };

            try {
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
                        .filter(field => field.FIELD_VISIBLE === "1")
                        .map(field => ({
                            headerName: field.FIELD_NAME,
                            field: field.FIELD_CODE,
                            sortable: true,
                            filter: false,
                            width: 150,
                            suppressMovable: true,
                            cellStyle: {
                                display: 'flex',
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

                // console.log('Ответ сервера:', data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                if (gridApi.value) {
                    gridApi.value.hideOverlay();
                }
            }
        }

        return {
            columnDefs,
            rowData,
            gridApi,
            onGridReady,
            loadTaskHistiry,
            loadTtnHistory,
        };
    }
};
</script>


<style scoped>
.ag-cell {
    background-color: #FFF9EF;
}

.history-list {
    height: 100%;
}


.his_buttons {
  width: 35px;
  height: 25px;
  padding: 0;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  background-color: white;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 3px;
  white-space: nowrap;
}

.his_buttons label {
  border: 1px solid #4D7CBF;
  padding: 3px;
  border-radius: 5px;
}

.buttons {
  display: flex;
  gap: 115px;
  align-items: center;
  flex-wrap: wrap;
  margin-left: 5px;  
}
</style>