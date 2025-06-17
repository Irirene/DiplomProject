<template>

    <div class="button">

      <button class="req_buttons" @click="onButtonClick">
        <img src="/src/images/rasp.png" alt="" />
      </button>

    </div>


    <h5>Нераспределенные заявки</h5>
    <ag-grid-vue
    ref="agGrid" 
    class="unrequests-list" 
    :rowData="rowData" 
    :columnDefs="columnDefs" 
    rowSelection="multiple"
     @rowClicked="onRowClicked">
    </ag-grid-vue>

</template>

<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-theme-alpine.css"

import { ref, watch } from 'vue';
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
        const selectedRow = ref(null);

        watch(() => [props.taskId, props.taskDate], async ([newTaskId, newTaskDate]) => {
            if (!newTaskId || !newTaskDate) return;
            await GetUnRequests(newTaskId, newTaskDate);
        }, { immediate: true });

        async function GetUnRequests(taskId, taskDate) {
            try {
                const session = localStorage.getItem("session");
                const onlyDate = taskDate ? taskDate.split(' ')[0] : '';

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

        function onRowClicked(event) {
            selectedRow.value = event.data;
        }

        async function onButtonClick() {
            if (!selectedRow.value) {
                alert("Выберите строку для отправки запроса");
                return;
            }
            const body = {
                "init": {
                    "type": "data",
                    "report": "at.setAexoToAexTrip.w"
                },
                "params": {
                    "IN_ID_AEXTRIP": props.taskId,
                    "IN_ID_AEXO": selectedRow.value.ID_REC,
                    "IN_TIP": selectedRow.value.REC_TIP === "1" ? 0 : 1
                }
            };
            
            try {
                const session = localStorage.getItem("session");
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
                alert("Запрос выполнен успешно");
                await GetUnRequests(props.taskId, props.taskDate);
            } catch (error) {
                console.error("Ошибка при выполнении запроса:", error);
                alert("Ошибка при выполнении запроса");
            }
        }

        return {
            columnDefs,
            rowData,
            onRowClicked,
            onButtonClick,
        };
    },
};
</script>

<style scoped>

.unrequests-list {
    height: 100%;
}

/* .button {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  padding: 0;
  margin: 0;
} */

.req_buttons {
  width: 20px;
  height: 25px;
  padding: 0;
  margin: 0;
  background-color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.req_buttons img {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
}
</style>