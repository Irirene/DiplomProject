<template>
  <div class="filters-container">
    <div class="Upper_filters">
      <!-- Фильтр "Удалённые" -->
      <fieldset class="filter first_row">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="deletedFilter.enabled" @change="emitDeletedFilter" />
            Удалённые
          </label>
        </legend>
        <div class="filter_inputs">
          <label class="filter_radio-option">
            <input type="radio" v-model="deletedFilter.value" value="yes" :disabled="!deletedFilter.enabled"
              name="deleted-filter" @change="emitDeletedFilter" />
            Да
          </label>
          <label class="filter_radio-option">
            <input type="radio" v-model="deletedFilter.value" value="no" :disabled="!deletedFilter.enabled"
              name="deleted-filter" @change="emitDeletedFilter" />
            Нет
          </label>
        </div>
      </fieldset>

      <!-- Фильтр "Дата с... по..." -->
      <fieldset class="filter second_row">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="dateFilter.enabled" />
            Дата с... по...
          </label>
        </legend>
        <div class="filter_inputs">
          <span>c</span>
          <input type="date" v-model="dateFilter.from" :disabled="!dateFilter.enabled"
            :max="dateFilter.to || undefined" />
          <span>по</span>
          <input type="date" v-model="dateFilter.to" :disabled="!dateFilter.enabled"
            :min="dateFilter.from || undefined" />
        </div>
      </fieldset>


      <!-- Фильтр "Город" -->
      <fieldset class="filter">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="townFilter.enabled" />
            Город
          </label>
        </legend>
        <div class="filter_inputs">
          <select v-model="townFilter.town" :disabled="!townFilter.enabled">
            <option value="">Выберите город</option>
            <option v-for="town in towns" :key="town" :value="town">{{ town }}</option>
          </select>
        </div>
      </fieldset>


      <!-- Фильтр "Номер тр. средства" -->
      <fieldset class="filter">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="numberFilter.enabled" />
            Номер тр. средства
          </label>
        </legend>
        <div class="filter_inputs">
          <select v-model="numberFilter.selected" :disabled="!numberFilter.enabled" class="filter_select">
            <option value="">abc...</option>
            <option v-for="search in searches" :key="search" :value="search">{{ search }}</option>
          </select>
          <input type="text" v-model="numberFilter.input" :disabled="!numberFilter.enabled" placeholder="Введите номер"
            class="filter_input"></input>
        </div>
      </fieldset>

      <!-- Фильтр "Ст. получателя" -->
      <fieldset class="filter">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="stationFilter.enabled" />
            Ст. получателя
          </label>
        </legend>
        <div class="filter_inputs">
          <select v-model="stationFilter.station" :disabled="!stationFilter.enabled">
            <option value="">Выберите станцию</option>
            <option v-for="station in stations" :key="station" :value="station">{{ station }}</option>
          </select>
        </div>
      </fieldset>

      <!-- Фильтр "СДГ (ст. назн)" -->
      <fieldset class="filter">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="sdgFilter.enabled" />
            СДГ (ст. назн)
          </label>
        </legend>
        <div class="filter_inputs">
          <select v-model="sdgFilter.sdg" :disabled="!sdgFilter.enabled">
            <option value="">Выберите станцию</option>
            <option v-for="station in stations" :key="station" :value="station">{{ station }}</option>
          </select>
        </div>
      </fieldset>
    </div>

    <div class="Low_filters">
      <!-- Вид перевозки -->
      <fieldset class="filter first_row">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="transportFilter.enabled" />
            Вид перевозки
          </label>
        </legend>
        <div class="filter_inputs">
          <select v-model="transportFilter.vid" :disabled="!transportFilter.enabled">
            <option value="">Выберите вид</option>
            <option v-for="vid in vids" :key="vid" :value="vid">{{ vid }}</option>
          </select>
        </div>
      </fieldset>


      <!-- Фильтр "№ задания" -->
      <fieldset class="filter second_row">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="taskNumberFilter.enabled" @change="emitTaskNumberFilter" />
            № задания
          </label>
        </legend>
        <div class="filter_inputs">
          <input type="text" v-model="taskNumberFilter.input" :disabled="!taskNumberFilter.enabled"
            placeholder="Введите номер задания" @change="emitTaskNumberFilter"></input>
        </div>
      </fieldset>


      <!-- Фильтр "Экспедитор" -->
      <fieldset class="filter">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="expeditorFilter.enabled" />
            Экспедитор
          </label>
        </legend>
        <div class="filter_inputs">
          <select v-model="expeditorFilter.selected" :disabled="!expeditorFilter.enabled" class="filter_select">
            <option value="">abc...</option>
            <option v-for="search in searches" :key="search" :value="search">{{ search }}</option>
          </select>
          <input type="text" v-model="expeditorFilter.input" :disabled="!expeditorFilter.enabled" placeholder="Введите"
            class="filter_input"></input>
        </div>
      </fieldset>


      <!-- Фильтр "Наименование груза" -->
      <fieldset class="filter">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="cargoNameFilter.enabled" />
            Наименование груза
          </label>
        </legend>
        <div class="filter_inputs">
          <select v-model="cargoNameFilter.selected" :disabled="!cargoNameFilter.enabled" class="filter_select">
            <option value="">abc...</option>
            <option v-for="search in searches" :key="search" :value="search">{{ search }}</option>
          </select>
          <input type="text" v-model="cargoNameFilter.input" :disabled="!cargoNameFilter.enabled" placeholder="Введите"
            class="filter_input"></input>
        </div>
      </fieldset>

      <!-- Фильтр "Клиент-отправитель" -->
      <fieldset class="filter">
        <legend>
          <label class="filter_legend-label">
            <input type="checkbox" v-model="clientFilter.enabled" />
            Клиент-отправитель
          </label>
        </legend>
        <div class="filter_inputs">
          <select v-model="clientFilter.selected" :disabled="!clientFilter.enabled" class="filter_select">
            <option value="">abc...</option>
            <option v-for="search in searches" :key="search" :value="search">{{ search }}</option>
          </select>
          <input type="text" v-model="clientFilter.input" :disabled="!clientFilter.enabled" placeholder="Введите"
            class="filter_input"></input>
        </div>
      </fieldset>


    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
      searches: ['...abc', '...abc...', 'abc'],

      deletedFilter: {
        enabled: false,
        value: 'no'
      },

      dateFilter: {
        enabled: false,
        from: '',
        to: ''
      },

      townFilter: {
        enabled: false,
        town: ''
      },
      towns: ['Москва', 'Санкт-Петербург', 'Новосибирск'],

      numberFilter: {
        enabled: false,
        selected: '',
        input: ''
      },

      stationFilter: {
        enabled: false,
        station: ""
      },
      stations: ['Москва', 'Санкт-Петербург', 'Новосибирск'],

      sdgFilter: {
        enabled: false,
        sdg: ""
      },

      transportFilter: {
        enabled: false,
        vid: ""
      },
      vids: ['Обычный', '1', '5к'],

      taskNumberFilter: {
        enabled: false,
        input: ''
      },

      expeditorFilter: {
        enabled: false,
        selected: '',
        input: ''
      },

      cargoNameFilter: {
        enabled: false,
        selected: '',
        input: ''
      },

      clientFilter: {
        enabled: false,
        selected: '',
        input: ''
      },
    }
  },
  methods: {

    emitTaskNumberFilter() {
      this.$emit('update-task-number-filter', {
        enabled: this.taskNumberFilter.enabled,
        input: this.taskNumberFilter.input.trim()
      });
    },

    emitDeletedFilter() {
      this.$emit('update-deleted-filter', {
        enabled: this.deletedFilter.enabled,
        value: this.deletedFilter.value,
      });
    },
  }
}
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: rgb(207, 225, 244, 0.5);
  font-family: Arial, sans-serif;
  padding: 10px 0px 10px 35px;
}

.Upper_filters,
.Low_filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}


.filter {
  border: 2px solid #4D7CBF;
  border-radius: 7px;
  padding: 5px 5px 5px 5px;
  margin: 0;
  position: relative;
}

.filter legend {
  font-size: 12px;
  font-weight: normal;
  color: #222;
  line-height: 1;
}

.filter_legend-label {
  display: flex;
  align-items: center;
  gap: 1px;
}

.filter_radio-option {
  font-size: 14px;
  display: flex;
  align-items: center;
}

select {
  border-radius: 5px;
  border: 2px solid #4D7CBF;
  background: #fff;
  font-size: 12px;
}

input {
  border-radius: 5px;
  border: 2px solid #4D7CBF;
  background: #fff;
  font-size: 12px;
}

input[type="radio"]:disabled,
input[type="checkbox"]:disabled,
input[type="text"]:disabled,
input[type="date"]:disabled,
select:disabled {

  opacity: 0.5;
}

input[type="radio"],
input[type="checkbox"] {
  cursor: pointer;
  accent-color: black;
}

.filter_input {
  border-radius: 0px 5px 5px 0px;
  border: 2px solid #4D7CBF;
  background: #fff;
  font-size: 12px;
  padding: 2px 5px;
}

.filter_select {
  border-radius: 5px 0px 0px 5px;
  border: 2px solid #4D7CBF;
  background: #fff;
  font-size: 12px;
}

.filter {
  width: 220px;
  min-width: 220px;
  max-width: 220px;
  box-sizing: border-box;
}

.filter_inputs {
  width: 100%;
  display: flex;
  gap: 5px;
}

.filter select,
.filter input[type="text"],
.filter input[type="date"] {
  width: 100%;
  box-sizing: border-box;
}

.filter_select,
.filter_input {
  flex: 1 1 0;
  min-width: 0;
  height: 20px;
}

.filter.first_row {
  width: 165px;
  min-width: 160px;
  max-width: 180px;
}

.filter.second_row {
  /* width: 280px; */
  min-width: 270px;
  max-width: 260px;
}
</style>