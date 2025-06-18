<template>
  <div class="tasks-outer">
    <div class="buttons">

      <AddForm></AddForm>

      <EditForm :idTrs="selectedTrsId"> </EditForm>

      <button class="task_buttons">
        <img src="/src/images/del.png" alt="" />
      </button>

    </div>

    <h5>Список заданий экспедитору</h5>

    <div class="tasks-grid">
      <ag-grid-vue
      class="task-list ag-theme-alpine" 
      :rowData="rowData" 
      :columnDefs="columnDefs"
      :rowSelection="{ mode: 'singleRow' }" 
      @rowClicked="onRowClicked">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { watch, ref, onMounted, computed } from "vue";
import axios from "axios";

import AddForm from "./UI/AddForm.vue";
import EditForm from "./UI/EditForm.vue";

ModuleRegistry.registerModules([AllCommunityModule]);

export default {
  components: {
    AgGridVue, AddForm, EditForm
  },

  props: {
    taskNumberFilter: { type: Object, required: true, },
    deletedFilter: { type: Object, required: true, },
    dateFilter: { type: Object, required: true },
    numberFilter: { type: Object, required: true },
  },
  
  emits: ['select-task'],


  setup(props) {
    const columnDefs = ref([]);
    const rowData = ref([]);

    const selectedTrsId = ref(null);

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

    function formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    }

    async function loadData() {
      try {
        const session = getCookie('session');

        const body = {
          init: {
            type: "table",
            report: "at.aexTripListKgDt.r"
          },
          params: {
            dtBg: formatDate(props.dateFilter.from),
            dtEnd: formatDate(props.dateFilter.to),

            isDel: props.deletedFilter.enabled ? 
            (props.deletedFilter.value === "yes" ? 1 : 0) : -1,
            
            trsSid: props.numberFilter.enabled ? (props.numberFilter.input || "") : "",

            idAexTrip: props.taskNumberFilter.enabled && props.taskNumberFilter.input
            ? props.taskNumberFilter.input : 0,
          }
        };

        //запрос
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
              sortable: true,
              filter: false,
              width: 160,
              suppressMovable: true,
              cellStyle: {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#CFE1F4'
              },
              headerStyle: {
                backgroundColor: '#4D7CBF',
              },
            }));
        }
        if (data.ALL_DATA && Array.isArray(data.ALL_DATA.result)) {
          rowData.value = data.ALL_DATA.result;
        } else {
          rowData.value = [];
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    onMounted(loadData);

    watch(
      [() => props.dateFilter, () => props.taskNumberFilter, () => props.deletedFilter, () => props.numberFilter],
      loadData,
      { deep: true }
    );

    // const filteredRowData = computed(() => {
    //   let filtered = rowData.value;

    //   // Фильтр № задания
    //   if (props.taskNumberFilter.enabled && props.taskNumberFilter.input) {
    //     const filterValue = props.taskNumberFilter.input.toLowerCase();
    //     filtered = filtered.filter((item) => {
    //       const fieldValue = item.ID_AEX_TRIP ? String(item.ID_AEX_TRIP).toLowerCase() : "";
    //       return fieldValue.includes(filterValue);
    //     });
    //   }

    //   // Фильтр "Удалённые"
    //   if (!props.deletedFilter.enabled || props.deletedFilter.value === "no") {
    //     filtered = filtered.filter((item) => item.AEX_TRIP_DEL == 0);
    //   }

    //   return filtered;
    // });

    

    return {
      columnDefs,
      rowData,
      selectedTrsId,
    };
  },

  methods: {
    onRowClicked(event) {
      this.selectedTrsId = event.data.AEX_TRIP_ID_TRS;

      this.$emit('select-task', {
        id: event.data.ID_AEX_TRIP,
        date: event.data.AEX_TRIP_DT_BG,
      });
    }
  }
};
</script>



<style>
.tasks-outer {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.tasks-grid {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
}

.task-list {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
}

h5 {
  color: #4D7CBF;
  padding: 0;
  margin: 0;
  outline: none;
  border: none;
  box-sizing: border-box;
  margin-left: 15px;
}

button {
  padding: 0;
  margin: 0;
  outline: none;
  border: none;
  background-color: white;
}


.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  padding: 0;
  margin: 0;
}

.task_buttons {
  width: 25px;
  height: 30px;
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