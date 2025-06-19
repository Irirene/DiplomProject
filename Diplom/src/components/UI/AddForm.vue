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
            <button type="submit">Добавить</button>
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
  watch:{
    isOpen(newVal){
      if (newVal) { 
        this.fetchCars();
        this.fetchTrailers()
        this.fetchDriversAndForwarders();
        this.fetchStations();
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
   
    async fetchCars() {
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
              ID_TRS: "0",
              TRS_PR: "2"
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
            this.form.auto = this.cars.length ? this.cars[0].id : '';
        }

      } catch (error) {
        console.error('Ошибка при загрузке автомобилей:', error);
        alert('Не удалось загрузить список авто');
      }
    },


    async fetchTrailers() {
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
              ID_TRS: "0",
              TRS_PR: "12"
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
          this.trailers = response.data.ALL_DATA.result
            .filter(item => item.ID_TRS && item.TRS_SID)
            .map(item => ({
              id: item.ID_TRS,
              name: item.TRS_SID
            }));
            this.form.trailer = this.trailers.length ? this.trailers[0].id : '';
        }

      } catch (error) {
        console.error('Ошибка при загрузке прицепов:', error);
        alert('Не удалось загрузить список прицепов');
      }
    },

    async fetchDriversAndForwarders() {
      try {
        const session = this.getCookie('session');

        const response = await axios.post(
          'http://localhost:8010/proxy/aextrip/rt',
          {
            init: {
              type: "table",
              report: "at.getListDriver.r"
            },
            params: {
              ID_SOTR1: "0",
              ID_KG: "1",
              PR_DRV: "1"
            }
          },
          {
            headers: {
              Pragma: session,
              "Content-Type": "application/json"
            }
          },

        );        
        
        const data = response.data.ALL_DATA.result;

        this.drivers = data
        .filter(item => item.VID_SOTR && item.VSOTR_FULLNAME)
        .map(item => ({
          id: item.VID_SOTR,
          name: item.VSOTR_FULLNAME
        }));

        this.form.driver = this.drivers.length ? this.drivers[0].id : '';
        
        this.forwarders = data
        .filter(item => item.VID_SOTR && item.VSOTR_FULLNAME)
        .map(item => ({
          id: item.VID_SOTR,
          name: item.VSOTR_FULLNAME
        }));

        this.form.forwarder = this.forwarders.length ? this.forwarders[0].id : '';

      } catch (error) {
        console.error('Ошибка при загрузке водителей:', error);
        alert('Не удалось загрузить список водителей');
      }
    },

    async fetchStations() {
      try {
        const session = this.getCookie('session');
        const response = await axios.post(
          'http://localhost:8010/proxy/aextrip/rt',
          {
            init: {
              type: "table",
              report: "at.getListMstAexTrip.r"
            },
            params: {
              "ID_MST": "0"
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
          this.stations = response.data.ALL_DATA.result
            .filter(item => item.ID_MST && item.MST_NAME)
            .map(item => ({
              id: item.ID_MST,
              name: item.MST_NAME,
              cityId: item.MST_ID_KG
            }));

            this.form.station = this.stations.length ? this.stations[0].id : '';
        }
      } catch (error) {
        console.error('Ошибка при загрузке станций:', error);
        alert('Не удалось загрузить список станций');
      }
    },

    formatCustomDate(dateTimeString) {
      const dateObj = new Date(dateTimeString);

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }, 
    

    async submitForm() {
      try {
        const session = this.getCookie('session');
        
        // Город по выбранной станции
        const selectedStation = this.stations.find(st => st.id === this.form.station);
        const cityId = selectedStation ? selectedStation.cityId : null;

        const formattedDeparture = this.formatCustomDate(this.form.departure);
        const formattedArrival = this.formatCustomDate(this.form.arrival);

        const response = await axios.post(
          'http://localhost:8010/proxy/aextrip/rt',
          {
            init: {
              type: "data",
              report: "at.setInsUpdAexTrip.w"
            },
            params: {
              // ID_AEX_TRIP: "",
              "AEX_TRIP_ID_TRS": this.form.auto,             // ТС
              "AEX_TRIP_ID_KG": cityId,                       // Город станции
              "AEX_TRIP_ID_MST": this.form.station,           // Станция начала
              "AEX_TRIP_ID_SOTR1": this.form.driver,          // Водитель
              "AEX_TRIP_ID_EXP": this.form.forwarder,         // Экспедитор
              "AEX_TRIP_DT_BG": formattedDeparture,          // Дата и время начала
              "AEX_TRIP_DT_END": formattedArrival,           // Дата и время конца
              "AEX_TRIP_VID": 0,                              // Всегда 0
              "AEX_TRIP_ID_MST_FINISH": this.form.station,    // Станция завершения
              "AEX_TRIP_ID_TRS_PRIC": this.form.trailer,      // Прицеп
              "AEX_TRIP_TXT": this.form.note                  // Примечание
            }
          },
          {
            headers: {
              Pragma: session,
              "Content-Type": "application/json"
            }
          }
        );
        
        // console.log('Ответ сервера:', response.data);
        alert('Задание успешно добавлено!');
        this.isOpen = false;
      
      } catch (error) {
        console.error('Ошибка при добавлении задания:', error);
        alert('Ошибка при добавлении задания');
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
