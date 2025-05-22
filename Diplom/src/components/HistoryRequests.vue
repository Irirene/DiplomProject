<template>
    <div>
        <h5>История</h5>
        <ag-grid-vue class="history-list" :rowData="rowData" :columnDefs="columnDefs" rowSelection="multiple">
        </ag-grid-vue>

    </div>
</template>

<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import { ref, onMounted } from 'vue';
import "ag-grid-community/styles/ag-theme-alpine.css"

ModuleRegistry.registerModules([AllCommunityModule]);



export default {
    components: {
        AgGridVue,
    },
    setup() {
        const columnDefs = ref([]);
        const rowData = ref([]);

        onMounted(async () => {
            try {
                const response = await fetch("/requests.json");
                const data = await response.json();
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
                                backgroundColor: '#FFF9EF'
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
        });

        return {
            columnDefs,
            rowData,
        };
    },
};
</script>

<style scoped>
.ag-cell {
    background-color: #FFF9EF;
}

.history-list {
    width: 100;
    height: 250px;
}
</style>