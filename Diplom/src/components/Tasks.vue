<template>
  <div class="tasks-outer">
    <div class="buttons">

      <AddForm></AddForm>

      <EditForm :idTask="selectedTaskId"
      :idTrs="selectedTrsId"
      :idTrsPric="selectedTrsPricId"
      :idSotr="selectedSotrId"
      :idKg="selectedKgId"
      :idExp="selectedExpId"
      :idMst="selectedMstId"
      :dateBg="selectedDateBg"
      :dateEnd="selectedDateEnd"
      :note="selectedNote"
      @updated="loadData"> </EditForm>

      <div class="dropdown">
        <button class="task_buttons" @click="toggleDropdown">Диспетчер</button>
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <button @click="planning">В планировании</button>
          <button @click="ready">Готово к выполнению</button>
          <button @click="done">Завершено</button>
        </div>
      </div>

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
    const selectedTrsPricId = ref(null);
    const selectedSotrId = ref(null);
    const selectedKgId = ref(null);
    const selectedExpId = ref(null);
    const selectedMstId = ref(null);
    const selectedDateBg = ref(null);
    const selectedDateEnd = ref(null);
    const selectedNote = ref(null);

    const selectedTaskId = ref(null);

    const isDropdownOpen = ref(false);

    function getCurrentDateTime() {
      const now = new Date();
      const pad = (n) => n < 10 ? '0' + n : n;
      return (
        pad(now.getDate()) + '.' +
        pad(now.getMonth() + 1) + '.' +
        now.getFullYear() + ' ' +
        pad(now.getHours()) + ':' +
        pad(now.getMinutes()) + ':' +
        pad(now.getSeconds())
      );
    }


    async function sendStatusUpdate(reportName) {
      if (!selectedTaskId.value) {
        alert("Выберите задание в таблице");
        return;
      }

      const session = getCookie('session');
      const selectedRow = rowData.value.find(row => row.ID_AEX_TRIP === selectedTaskId.value);
      if (!selectedRow) {
        alert("Выбранное задание не найдено");
        return;
      }
      
      const body = {
        init: {
          type: "data",
          report: reportName
        },
        params: {
          aex_strip_id_aex_trip: selectedRow.ID_AEX_TRIP,
          aex_strip_dt: getCurrentDateTime()
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
        alert("Статус успешно обновлен");
        await loadData();

      } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
        alert("Ошибка при обновлении статуса");
      }
    }


    function toggleDropdown() {
      isDropdownOpen.value = !isDropdownOpen.value;
      
    }

    async function planning() {
      isDropdownOpen.value = false;
      await sendStatusUpdate("at.setInsSTrip01710.w");
      await loadData();
    }

    async function ready() {
      isDropdownOpen.value = false;
      await sendStatusUpdate("at.setInsSTrip01711.w");
      await loadData();
    }

    async function done() {
      isDropdownOpen.value = false;
      await sendStatusUpdate("at.setInsSTrip01712.w");
      await loadData();
    }

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
      selectedTrsPricId,
      selectedSotrId,
      selectedKgId,
      selectedExpId,
      selectedMstId,
      selectedDateBg,
      selectedDateEnd,
      selectedNote,

      selectedTaskId,

      isDropdownOpen,
      toggleDropdown,
      planning,
      ready,
      done,

      loadData,
    };
  },

  methods: {
    onRowClicked(event) {
      this.selectedTrsId = event.data.AEX_TRIP_ID_TRS;
      this.selectedTrsPricId = event.data.AEX_TRIP_ID_TRS_PRIC;
      this.selectedSotrId = event.data.AEX_TRIP_ID_SOTR1;
      this.selectedKgId = event.data.AEX_TRIP_ID_KG;
      this.selectedExpId = event.data.AEX_TRIP_ID_EXP;
      this.selectedMstId = event.data.AEX_TRIP_ID_MST;
      this.selectedDateBg = event.data.AEX_TRIP_DT_BG;
      this.selectedDateEnd = event.data.AEX_TRIP_DT_END;
      this.selectedNote = event.data.AEX_TRIP_TXT;

      this.selectedTaskId = event.data.ID_AEX_TRIP;

      this.$emit('select-task', {
        id: event.data.ID_AEX_TRIP,
        date: event.data.AEX_TRIP_DT_BG,
      });
    },
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



.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  min-width: 100px;
  z-index: 1000;
}

.dropdown-menu button {
  padding: 5px 10px;
  border-top: 1px solid #dad8d8;
  border-bottom: 1px solid #dad8d8;
  background: none;
  text-align: left;
  cursor: pointer;
  width: 170px;
}

.dropdown-menu button:hover {
  background-color: #eee;
}

</style>