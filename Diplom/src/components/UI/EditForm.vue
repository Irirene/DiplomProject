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
    idTask: { type: [String, Number], default: null },
    idTrs: { type: [String, Number], default: null },
    idTrsPric: { type: [String, Number], default: null },
    idSotr: { type: [String, Number], default: null },
    idKg: { type: [String, Number], default: null },
    idExp: { type: [String, Number], default: null },
    idMst: { type: [String, Number], default: null },
    dateBg: { type: [String, Number], default: null },
    dateEnd: { type: [String, Number], default: null },
    note: { type: [String, Number], default: null },
  },

  watch:{
    isOpen(newVal) {
      if (newVal) {
        this.resetForm();
        this.fetchCars(this.idTrs);
        this.fetchTrailers(this.idTrsPric);
        this.fetchDrivers(this.idSotr, this.idKg);
        this.fetchForwarders(this.idExp, this.idKg);
        this.fetchStations(this.idMst);
        this.DateAndNote(this.dateBg, this.dateEnd, this.note)
      }
    },
    idTrs(newVal) {
      if (this.isOpen && newVal) {
        this.fetchCars(newVal);       
      }
    },
    idTrsPric(newVal){
      if (this.isOpen && newVal) {
        this.fetchTrailers(newVal);        
      }
    },
    idSotr(newVal) {
      if (this.isOpen && newVal) {
        this.fetchDrivers(newVal, this.idKg);
      }
    },
    idKg(newVal) {
      if (this.isOpen && newVal) {
        this.fetchDrivers(this.idSotr, newVal);
      }
    },
    idExp(newVal) {
      if (this.isOpen && newVal) {
        this.fetchForwarders(newVal, this.idKg);
      }
    },
    idMst(newVal) {
      if (this.isOpen && newVal) {
        this.fetchStations(newVal);
      }
    },
    dateBg(newVal) {
      if (this.isOpen && newVal) {
        this.DateAndNote(newVal, this.dateEnd, this.note);
      }
    },
    dateEnd(newVal) {
      if (this.isOpen && newVal) {
        this.DateAndNote(this.dateBg, newVal, this.note);
      }
    },
    note(newVal) {
      if (this.isOpen && newVal) {
        this.DateAndNote(this.dateBg, this.dateEnd, newVal);
      }
    },
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
    resetForm() {
      this.form = {
        auto: '',
        trailer: '',
        driver: '',
        forwarder: '',
        departure: '',
        arrival: '',
        station: '',
        note: ''
      };
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
            
            const exists = this.cars.some(car => car.id === idTrs);
            
            if (exists) {
              this.form.auto = idTrs;
            } else {
              this.form.auto = this.cars.length ? this.cars[0].id : '';
            }
          }
        } catch (error) {
          console.error('Ошибка при загрузке автомобилей:', error);
          alert('Не удалось загрузить список авто');
        }
      },
      
      
      async fetchTrailers(idTrsPric) {
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
              ID_TRS: idTrsPric,
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
            
            const exists = this.trailers.some(trailer => trailer.id === idTrsPric);
            
            if (exists) {
              this.form.trailer = idTrsPric;
            } else {
              this.form.trailer = this.trailers.length ? this.trailers[0].id : '';
            }
          }
        } catch (error) {
          console.error('Ошибка при загрузке прицепов:', error);
          alert('Не удалось загрузить список прцепов');
        }
      },


      async fetchDrivers(idSotr, idKg) {
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
              ID_SOTR1: idSotr,
              ID_KG: idKg,
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
        const exists = this.drivers.some(driver => driver.id === idSotr);
        
        if (exists) {
          this.form.driver = idSotr;
        } else {
          this.form.driver = this.drivers.length ? this.drivers[0].id : '';
        }

      } catch (error) {
        console.error('Ошибка при загрузке водителей:', error);
        alert('Не удалось загрузить список водителей');
      }
    },

    async fetchForwarders(idExp, idKg) {
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
              ID_SOTR1: idExp,
              ID_KG: idKg,
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

        this.forwarders = data
        .filter(item => item.VID_SOTR && item.VSOTR_FULLNAME)
        .map(item => ({
          id: item.VID_SOTR,
          name: item.VSOTR_FULLNAME
        }));

        this.form.forwarder = this.forwarders.length ? this.forwarders[0].id : '';
        const exists = this.forwarders.some(forwarder => forwarder.id === idExp);
        
        if (exists) {
          this.form.forwarder = idExp;
        } else {
          this.form.forwarder = this.forwarders.length ? this.forwarders[0].id : '';
        }

      } catch (error) {
        console.error('Ошибка при загрузке экспедиторов:', error);
        alert('Не удалось загрузить список экспедиторов');
      }
    },


    async fetchStations(idMst) {
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
              "ID_MST": idMst
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
            const exists = this.stations.some(station => station.id === idMst);
            
            if (exists) {
              this.form.station = idMst;
            } else {
              this.form.station = this.stations.length ? this.stations[0].id : '';
            }
          }
      } catch (error) {
        console.error('Ошибка при загрузке станций:', error);
        alert('Не удалось загрузить список станций');
      }
    },


    DateAndNote(dateBg, dateEnd, note) {      
      // console.log('dateBg:', dateBg, 'dateEnd:', dateEnd, 'note:', note);
      this.form.note = note || '';
      this.form.departure = this.formatDateTimeLocal(dateBg);
      this.form.arrival = this.formatDateTimeLocal(dateEnd);
    },

    formatDateTimeLocal(dateStr) {
      if (!dateStr) return '';
      const match = /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{1,2}):(\d{2})/.exec(dateStr);
      if (!match) return '';
      const [_, day, month, year, hour, minute] = match;
      return `${year}-${month}-${day}T${hour.padStart(2, '0')}:${minute}`;
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
              "ID_AEX_TRIP": this.idTask,                    //Код задания
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
        alert('Задание успешно отредактировано!');
        this.$emit('updated');
        this.isOpen = false;       
      
      } catch (error) {
        console.error('Ошибка при редактировании задания:', error);
        alert('Ошибка при редактировании задания');
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
