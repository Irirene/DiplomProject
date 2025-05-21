<template>
  <div>
    <button @click="isOpen = true" class="task_buttons"><img src="/src/images/add.png" alt=""></button>
    <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
      <div class="modal">
        <h2>Задание экспедитору</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label>Авто:</label>
            <select v-model="form.auto">
              <option v-for="car in cars" :key="car" :value="car">{{ car }}</option>
            </select>
          </div>
          <div>
            <label>Водитель:</label>
            <select v-model="form.driver">
              <option v-for="driver in drivers" :key="driver" :value="driver">{{ driver }}</option>
            </select>
          </div>
          <div>
            <label>Экспедитор:</label>
            <select v-model="form.forwarder">
              <option v-for="forwarder in forwarders" :key="forwarder" :value="forwarder">{{ forwarder }}</option>
            </select>
          </div>
          <div>
            <label>MSK: Время убытия (план):</label>
            <input type="datetime-local" v-model="form.departure" />
          </div>
          <div>
            <label>MSK: Время прибытия (план):</label>
            <input type="datetime-local" v-model="form.arrival" />
          </div>
          <div>
            <label>Станция:</label>
            <select v-model="form.station">
              <option v-for="station in stations" :key="station" :value="station">{{ station }}</option>
            </select>
          </div>
          <div>
            <label>Примечание:</label>
            <textarea v-model="form.note"></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit">Добавить</button>
            <button type="button" @click="isOpen = false">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      cars: ['197У809ВМ', '222В333КК'],
      drivers: ['Пужалин Александр Николаевич', 'Иванов Иван Иванович'],
      forwarders: ['Пужалин Александр Николаевич', 'Петров Петр Петрович'],
      stations: ['Новосибирск-Ногина', 'Москва-Киевская'],
      form: {
        auto: '197У809ВМ',
        driver: 'Пужалин Александр Николаевич',
        forwarder: 'Пужалин Александр Николаевич',
        departure: '',
        arrival: '',
        station: 'Новосибирск-Ногина',
        note: ''
      }
    };
  },
  methods: {
    submitForm() {
      console.log(this.form);
      this.isOpen = false;
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #f7f7f7;
  padding: 20px;
  border-radius: 10px;
  min-width: 500px;
  min-height: 200px;
}
.modal-actions {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 10px;
}

.modal-actions button{
    font-size: 16px;
    background-color: #F0F0F0;
    border: 1px solid #4D7CBF;
    border-radius: 5px;
    min-height: 25px;
    min-width: 100px;
}

input, select, textarea{
    border: 1px solid #4D7CBF;
    border-radius: 5px;
}

textarea{
    width: 100%;
    min-height: 50px;
}

label{
  margin-right: 10px;
  text-align: left;
  margin-right: 5px;
}


form > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

input, select {
  flex-grow: 1;
  max-width: 300px;
  border: 1px solid #4D7CBF;
  border-radius: 5px;
  padding: 2px;
  margin: 2px 0;
}


</style>
