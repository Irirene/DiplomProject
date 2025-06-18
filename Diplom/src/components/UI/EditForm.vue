<template>
  <div>
    <button @click="isOpen = true" class="task_buttons"><img src="/src/images/edit.png" alt=""></button>
    <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
      <div class="modal">
        <h2>Задание экспедитору</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label>Авто:</label>
            <select v-model="form.auto">
              <option v-for="car in cars" 
              :key="car.id" 
              :value="car.id"> {{ car.name }} </option>
            </select>
          </div>
          <div>
            <label>Прицеп:</label>
            <select v-model="form.trailer">
              <option v-for="trailer in trailers" 
              :key="trailer.id" 
              :value="trailer.id"> {{ trailer.name }} </option>
            </select>
          </div>
          <div>
            <label>Водитель:</label>
            <select v-model="form.driver">
              <option v-for="driver in drivers" 
              :key="driver.id" 
              :value="driver.id"> {{ driver.name }} </option>
            </select>
          </div>
          <div>
            <label>Экспедитор:</label>
            <select v-model="form.forwarder">
              <option v-for="forwarder in forwarders" 
              :key="forwarder.id" 
              :value="forwarder.id"> {{ forwarder.name }} </option>
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
              <option v-for="station in stations" 
              :key="station.id" 
              :value="station.id"> {{ station.name }} </option>
            </select>
          </div>
          <div>
            <label>Примечание:</label>
            <textarea v-model="form.note"></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit">Изменить</button>
            <button type="button" @click="isOpen = false">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      isOpen: false,
      cars: [],
      trailers: [],
      drivers: [],
      forwarders: [],
      stations: [],
      form: {
        auto: '',
        trailer: '',
        driver: '',
        forwarder: '',
        departure: '',
        arrival: '',
        station: '',
        note: ''
      }
    };
  },

  props: { 
    task: { type: Object, default: null },
    idTrs: { type: [String, Number], default: null }
  },

  watch:{
    isOpen(newVal) {
      if (newVal) {
        this.fetchCars(this.idTrs);
      }
    },
    idTrs(newVal) {
      if (this.isOpen && newVal) {
        this.fetchCars(newVal);
      }
    }
  },

  
  methods: {

    getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
      }
      return null;
    },

    async fetchCars(idTrs) {
      try {
        const session = this.getCookie('session');
        const response = await axios.post(
          'http://localhost:8010/proxy/aextrip/rt',
          {
            init: {
              type: "table",
              report: "at.getListTrs.r"
            },
            params: {
              ID_TRS: idTrs,
              TRS_PR: "100"
            }
          },
          {
            headers: {
              Pragma: session,
              "Content-Type": "application/json"
            }
          }
        );
        
        if (response.data?.ALL_DATA?.result) {
          this.cars = response.data.ALL_DATA.result
            .filter(item => item.ID_TRS && item.TRS_SID)
            .map(item => ({
              id: item.ID_TRS,
              name: item.TRS_SID
            }));
            this.form.auto = this.cars.length ? this.cars[this.cars.length - 1].id : '';
        }

      } catch (error) {
        console.error('Ошибка при загрузке автомобилей:', error);
        alert('Не удалось загрузить список авто');
      }
    },   
    
  }
};


</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
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

.modal-actions button {
  font-size: 16px;
  background-color: #F0F0F0;
  border: 1px solid #4D7CBF;
  border-radius: 5px;
  min-height: 25px;
  min-width: 100px;
}

input,
select,
textarea {
  border: 1px solid #4D7CBF;
  border-radius: 5px;
}

textarea {
  width: 100%;
  min-height: 50px;
}

label {
  margin-right: 10px;
  text-align: left;
  margin-right: 5px;
}


form>div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

input,
select {
  flex-grow: 1;
  max-width: 300px;
  border: 1px solid #4D7CBF;
  border-radius: 5px;
  padding: 2px;
  margin: 2px 0;
}
</style>
