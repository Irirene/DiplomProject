<template>

    <div class="button">

      <button class="req_buttons" @click="onButtonClick" title="Распределить заявку">
        <img src="/src/images/rasp.png" alt="" />
      </button>

    </div>


    <h5>Нераспределенные заявки</h5>
    <ag-grid-vue
    class="unrequests-list" 
    :rowData="rowData" 
    :columnDefs="columnDefs" 
    :rowSelection="{ 
                mode: 'singleRow',
                enableClickSelection: true 
                }"
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

        watch(() => [props.taskId, props.taskDate], async ([newTaskId, newTaskDate]) => {
            if (!newTaskId || !newTaskDate) return;
            await GetUnRequests(newTaskId, newTaskDate);
        }, { immediate: true });

        async function GetUnRequests(taskId, taskDate) {
            try {
                const session = getCookie('session');
                const dateWithTime = props.taskDate;
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
                alert("Выберите нераспределенную заявку");
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
                alert("Заявка распределена");
                await GetUnRequests(props.taskId, props.taskDate);
            } catch (error) {
                console.error("Ошибка при выполнении запроса:", error);
                alert("Ошибка при распределении заявки");
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