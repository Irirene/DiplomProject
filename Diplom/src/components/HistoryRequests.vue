<template>
    <div>
    <h5>История</h5>
    <ag-grid-vue
        class="history-list"
        :rowData="rowData.value"
        :columnDefs="columnDefs.value"
        rowSelection="multiple"             
    >
    </ag-grid-vue>

    </div>
</template>

<script>
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridVue } from "ag-grid-vue3";
import { reactive, onMounted } from 'vue';
import "ag-grid-community/styles/ag-theme-alpine.css"

ModuleRegistry.registerModules([AllCommunityModule]);



export default {
    components: {
        AgGridVue,
    },
    setup() {        
            let columnDefs = reactive({ 
                value:[
                    {
                        headerName: "Задание",
                        children: [
                            { headerName: "ID", field: "ID_AEX_TRIP" },
                    ]
                    },
                { headerName: "ID_KG", field: "AEX_TRIP_ID_KG" },
            ],
        });
            let rowData = reactive({ value: []});

            return {
                columnDefs, rowData,
        };
    },
};
</script>

<style scoped>

.ag-cell{
    background-color: #FFF9EF;
}

.history-list{
    width: 100;
    height: 250px;
}

</style>