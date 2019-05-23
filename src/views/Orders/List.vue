<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-dialog
      :value="loadingDialog"
      persistent
      max-width="320px"
    >
      <v-list>
        <v-list-tile
          v-for="(item, index) in loadingData"
          :key="index"
          avatar
          :color="(item.error) ? 'red' : item.color"
        >
          <v-list-tile-avatar>
            <v-progress-circular
              :value="100"
              :size="30"
              :color="(item.error) ? 'red' : item.color"
              :indeterminate="item.loading"
            ></v-progress-circular>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-dialog>
    <template v-if="!loadingDialog">
      <v-card>
        <v-card-title>
          <v-dialog
            v-model="dialogForm"
            persistent
            :max-width="(editStatus) ? '420px' : '1200px'"
          >
            <v-btn slot="activator" color="primary" dark class="mb-2">Добавить</v-btn>
            <change-status
              v-if="editStatus"
              :id="editedId"
              @cancel="closeDialog()"
            ></change-status>
            <order-edit
              v-if="editedId && !editStatus"
              :id="editedId"
              :copy="copyElem"
              @cancel="closeDialog()"
            ></order-edit>
            <order-add
              v-if="!editedId && !editStatus"
              @cancel="closeDialog()"
            ></order-add>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-layout
            row
            wrap
          >
            <v-flex
              xs2
              class="px-3"
            >
              <v-text-field
                v-model="search"
                prepend-icon="search"
                label="Поиск"
                hide-details
              ></v-text-field>
            </v-flex>
            <v-flex
              xs2
              class="px-3"
            >
              <v-select
                label="Статус"
                :items="[{id: '', name: 'Все'}].concat(statusList)"
                item-text="name"
                item-value="id"
                v-model="filter.status"
                hide-details
              ></v-select>
            </v-flex>
            <v-flex
              xs2
              class="px-3"
            >
              <v-autocomplete
                label="Клиент"
                :items="[{id: '', name: 'Все', phone: ''}].concat(clientsList)"
                :filter="clientsFilter"
                item-text="name"
                item-value="id"
                v-model="filter.client"
                hide-details
                class="mb-4"
                no-data-text="Не надено"
              ></v-autocomplete>
            </v-flex>
            <v-flex
              xs2
              class="px-3"
            >
              <v-select
                label="Тип клиента"
                :items="[{id: '', name: 'Все'}].concat(typeClient)"
                item-text="name"
                item-value="id"
                v-model="filter.typeClient"
                hide-details
              ></v-select>
            </v-flex>
            <v-flex
              xs2
              class="px-3"
            >
              <v-menu
                :close-on-content-click="false"
                v-model="dataStartPicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                class="mb-4"
              >
                <v-text-field
                  slot="activator"
                  label="Начальная дата"
                  v-model="filter.dateStart"
                  prepend-icon="event"
                  hide-details
                  readonly
                  clearable
                ></v-text-field>
                <v-date-picker
                  v-model="filter.dateStart"
                  @input="dataStartPicker = false"
                  no-title
                  scrollable
                  locale="ru-ru"
                  first-day-of-week="1"
                  :max="(!!filter.dateEnd) ? filter.dateEnd : undefined"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex
              xs2
            >
              <v-menu
                :close-on-content-click="false"
                v-model="dataEndPicker"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                class="mb-4"
              >
                <v-text-field
                  slot="activator"
                  label="Конечная дата"
                  v-model="filter.dateEnd"
                  prepend-icon="event"
                  hide-details
                  readonly
                  clearable
                ></v-text-field>
                <v-date-picker
                  v-model="filter.dateEnd"
                  @input="dataEndPicker = false"
                  no-title
                  locale="ru-ru"
                  scrollable
                  first-day-of-week="1"
                  :min="(!!filter.dateStart) ? filter.dateStart : undefined"
                ></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-data-table
          :headers="headersTable"
          :items="ordersList"
          hide-actions
          no-data-text="Заказов не найдено"
          no-results-text="Заказов не найдено"
          :search="search"
          :custom-filter="customFilter"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <tr
              :class="props.item.orderStatus.color"
            >
              <td>{{ props.item.createdAt.split('T')[0] }}</td>
              <td style="width: 30px;">{{ props.item.id }}</td>
              <td>
                {{ props.item.clientName }}
                <br>{{ props.item.clientPhone }}
              </td>
              <td>{{ props.item.description }}</td>
              <td>{{ props.item.deliveryType.name }}</td>
              <td>
                {{ props.item.deliveryDate }}
                <br>{{ props.item.deliveryTime }}
              </td>
              <td>{{ props.item.orderCost }}</td>
              <td
                @click="changeStatus(props.item.id)"
                style="cursor: pointer"
              >
                {{ props.item.orderStatus.name }}
                <br>{{ (props.item.courier) ? props.item.courier.name : '' }}
              </td>
              <td class="text-xs-right" style="width: 180px;">
                <v-icon
                  class="mr-2"
                  @click="createdBouquet(props.item)"
                  v-if="props.item.orderStatus.id === 1"
                >
                  playlist_add
                </v-icon>
                <v-icon
                  class="mr-2"
                  @click="editItem(props.item.id, true)"
                >
                  add_to_photos
                </v-icon>
                <v-icon
                  class="mr-2"
                  @click="editItem(props.item.id)"
                >
                  edit
                </v-icon>
                <v-menu
                  style="vertical-align: top;"
                >
                  <v-icon
                    slot="activator"
                  >insert_drive_file</v-icon>

                  <v-list>
                    <v-list-tile
                      @click.prevent="printDoc(props.item.id, 'florist')"
                      target="_blank"
                    >
                      <v-list-tile-title>Печать бланка флориста</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      @click.prevent="printDoc(props.item.id, 'delivery')"
                      target="_blank"
                      v-if="props.item.courier && props.item.deliveryType.id === 2"
                    >
                      <v-list-tile-title>Печать бланка заказа на доставку</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <v-btn
        fab
        color="info"
        class="mx-4"
        @click="dialogForm = true"
      >
        <v-icon dark>add</v-icon>
      </v-btn>
    </template>
  </v-container>
</template>

<script>
import OrderEdit from './edit.vue';
import OrderAdd from './add.vue';
import ChangeStatus from './changeStatus.vue';

export default {
  name: 'Orders',
  components: {
    OrderEdit,
    OrderAdd,
    ChangeStatus,
  },
  data() {
    return {
      filter: {
        status: '',
        client: '',
        typeClient: '',
        dateStart: null,
        dateEnd: null,
      },
      loadingData: [
        {
          title: 'Получение заказов',
          error: false,
          loading: true,
          color: 'amber',
          id: 'orders',
        },
      ],
      dataStartPicker: false,
      dataEndPicker: false,
      search: '',
      headersTable: [
        {
          text: 'Дата',
          align: 'left',
          value: 'createdAt',
        },
        {
          text: '№ заказа',
          align: 'left',
          value: 'id',
        },
        {
          text: 'Клиент',
          align: 'left',
          value: 'client.clientName',
        },
        {
          text: 'Состав заказа',
          align: 'left',
          value: 'description',
        },
        {
          text: 'Тип доставки',
          align: 'left',
          value: 'deliveryType.name',
        },
        {
          text: 'Дата доставки',
          align: 'left',
          value: 'deliveryDate',
        },
        {
          text: 'Сумма',
          align: 'left',
          value: 'orderCost',
        },
        {
          text: 'Статус',
          align: 'left',
          value: 'orderStatus.name',
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'action',
        },
      ],
      dialogForm: false,
      ordersList: [],
      statusList: [],
      clientsList: [],
      typeClient: [],
      editedId: 0,
      copyElem: false,
      editStatus: false,
    };
  },
  computed: {
    loadingDialog() {
      const loadData = this.loadingData.filter(item => !item.error && !item.loading);
      return (loadData.length === this.loadingData.length) ? 0 : 1;
    },
  },
  methods: {
    printDoc(id, type) {
      const { protocol, hostname } = window.location;
      const url = `${protocol}//${hostname}/print/order/${id}/${type}`;
      window.open(url, '_blank');
    },
    customFilter(items) {
      const filterProps = this.filter;
      let itemsFind = [];

      itemsFind = items.filter((item) => {
        let find = false;
        if (+item.orderStatus.id === filterProps.status || filterProps.status === '') {
          find = true;
        }

        return find;
      });

      itemsFind = itemsFind.filter((item) => {
        let find = false;
        if (+item.clientType.id === filterProps.typeClient || filterProps.typeClient === '') {
          find = true;
        }

        return find;
      });

      itemsFind = itemsFind.filter((item) => {
        let find = false;
        if (+item.client.id === filterProps.client || filterProps.client === '') {
          find = true;
        }

        return find;
      });

      itemsFind = itemsFind.filter((item) => {
        let find = false;
        if (
          (item.createdAt >= filterProps.dateStart || filterProps.dateStart === null)
          && (item.createdAt <= filterProps.dateEnd || filterProps.dateEnd === null)
        ) {
          find = true;
        }

        return find;
      });

      return itemsFind;
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1;
    },
    getOrdersList() {
      const itemParams = {
        type: 'orders',
      };

      const successData = 'Заказы получены!';
      const errorData = 'Ошибка получения заказов!';

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.ordersList = response;

        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = successData;
        loadData.loading = false;
      }).catch(() => {
        const loadData = this.loadingData.find(item => item.id === itemParams.type);
        loadData.title = errorData;
        loadData.error = true;
      });
    },
    getStatusList() {
      const itemParams = {
        type: 'order-status',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.statusList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    getClientsList() {
      const itemParams = {
        type: 'clients',
        filter: {
          active: true,
        },
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.clientsList = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    getClientTypeList() {
      const itemParams = {
        type: 'client-type',
      };

      this.$store.dispatch('getItemsList', itemParams).then((response) => {
        this.typeClient = response.map((item) => {
          item.id = +item.id;
          return item;
        });
      }).catch(() => {
        console.log('error');
      });
    },
    closeDialog() {
      this.getOrdersList();
      this.dialogForm = false;
      this.copyElem = false;
      this.editedId = 0;
      setTimeout(() => {
        this.editStatus = false;
      }, 300);
    },
    editItem(id, copy = false) {
      this.editedId = +id;
      this.copyElem = copy;
      this.dialogForm = true;
    },
    changeStatus(id) {
      this.editedId = +id;
      this.editStatus = true;
      this.dialogForm = true;
    },
    createdBouquet: function createdBouquet(item) {
      let cardsList = JSON.parse(localStorage.getItem('cardsList'));
      cardsList = (cardsList !== null) ? cardsList : [];

      const index = cardsList.findIndex(card => card.props.order === item.id);
      if (index === -1) {
        cardsList.push({
          sum: 0,
          success: false,
          props: {
            floristId: null,
            orderId: item.id,
            clientId: item.client.id,
            decorPercent: 10,
            deliveryCost: 0,
            salePercent: 0,
          },
          goods: [],
        });
      } else {
        cardsList[index].props.clientId = item.client.id;
      }
      localStorage.setItem('cardsList', JSON.stringify(cardsList));
      this.$router.push({ path: '/', query: { selectOrder: item.id } });
    },
  },
  mounted() {
    this.getOrdersList();
    this.getStatusList();
    this.getClientsList();
    this.getClientTypeList();
    if (this.$route.query.client !== undefined) {
      this.filter.client = +this.$route.query.client;
    }
  },
};
</script>
