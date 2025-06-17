<template>
  <div :class="['app-grid', { 'with-right': showUnRequests }]">

    <Header class="header"></Header>
    <Filters class="filters"
      @update-deleted-filter="onDeletedFilterUpdate"
      @update-task-number-filter="onTaskNumberFilterUpdate"
      @update-date-filter="onDateFilterUpdate">
      
    </Filters>

    <div class="main-content">
      <Tasks class="task-grid"
        :taskNumberFilter="taskNumberFilter"
        :deletedFilter="deletedFilter"
        :dateFilter="dateFilter"
        @select-task="onSelectTask">
      </Tasks>

      <ButtonC class="btn-buttom" @click="toggleRequests">
        {{ showRequests ? 'Скрыть заявки' : 'Показать заявки' }}
      </ButtonC>
      <Requests v-if="showRequests" :taskId="selectedTaskId"></Requests>
    </div>

    <template v-if="showUnRequests">

      <div class="toggle-unrequests">
        <ButtonC class="btn-left" @click="toggleUnRequests">
          {{ showUnRequests ? '>' : '<' }} </ButtonC>
      </div>

      <div class="left-section">
        <UndistribRequests :taskId="selectedTaskId" :taskDate="selectedTaskDate"></UndistribRequests>
      </div>
    </template>

    <template v-else>
      <div class="toggle-unrequests">
        <ButtonC class="btn-left" @click="toggleUnRequests">
          {{ showUnRequests ? '>' : '<' }} </ButtonC>
      </div>
    </template>
  </div>
</template>




<script>
import Header from '@/components/Header.vue';
import Filters from '@/components/Filters.vue';
import Tasks from '@/components/Tasks.vue';
import ButtonC from '@/components/UI/ButtonC.vue'
import Requests from '@/components/Requests.vue';
import UndistribRequests from '@/components/UndistribRequests.vue';

export default {
  components: {
    Header, Filters, Tasks, ButtonC, Requests, UndistribRequests,
  },
  data() {
    return {
      showRequests: false,
      showUnRequests: false,
      selectedTaskId: '',
      selectedTaskDate: '',

      
      taskNumberFilter: {
        enabled: false,
        input: ''
      },

      deletedFilter: {
        enabled: false,
        value: 'no',
      },

      dateFilter:{
        enabled: false,
        from: '',
        to: ''
      },
    };
  },
  methods: {
    toggleRequests() {
      this.showRequests = !this.showRequests;
    },

    toggleUnRequests() {
      this.showUnRequests = !this.showUnRequests;
    },

    onTaskNumberFilterUpdate(filter) {
      this.taskNumberFilter = filter;
    },

    onDeletedFilterUpdate(filter) {
      this.deletedFilter = filter;
    },

    onSelectTask(task) {
      this.selectedTaskId = task.id;
      this.selectedTaskDate = task.date;
    },

    onDateFilterUpdate(filter){
      this.dateFilter = filter
    },


  }
}
</script>


<style scoped>
.app-grid {
  display: grid;
  grid-template-areas:
    "header header header"
    "filters filters filters"
    "tasks toggle-unrequests left-section";
  grid-template-columns: 3fr minmax(40px, 60px) 1.5fr;
  grid-template-rows: auto auto 1fr;
  height: 100vh;
  gap: 0;
}


.app-grid:not(.with-right) {
  grid-template-areas:
    "header header"
    "filters filters"
    "tasks toggle-unrequests";
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto 1fr;
  gap: 0;
}

.header {
  grid-area: header;
}

.filters {
  grid-area: filters;
}

.main-content {
  grid-area: tasks;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  min-width: 0;
}

.task-grid {
  height: 100%;
  min-height: 0;
  margin: 0;
  padding: 0;
}

.left-section {
  grid-area: left-section;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  margin: 0;
  padding: 0;
}

.buttom-section {
  grid-area: buttom-section;
}

.btn-buttom {
  margin: 5px auto 0 auto;
  display: block;
}

.toggle-unrequests {
  grid-area: toggle-unrequests;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: 0;
  margin: 0;
}
</style>
