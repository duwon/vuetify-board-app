<template>
  <v-container>
    <v-card
      elevation="10"
      outlined
      width="100%"
      class="mx-auto"
    >
      <v-card-title>
        Board
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-data-table
              v-if="$vuetify.breakpoint.xsOnly"
              dense
              class="elevation-1"
              :headers="headers_mobile"
              :items="document"
              :options.sync="options"
              :server-items-length="totalCount"
              :footer-props="footerOptions"
              :loading="loading"
              hide-default-header
              hide-default-footer
              @click:row="onClickRow"
            />
            <v-data-table
              v-if="!$vuetify.breakpoint.xsOnly"
              dense
              class="elevation-1"
              :headers="headers"
              :items="document"
              :page.sync="options.page"
              :items-per-page="options.itemsPerPage"
              :options.sync="options"
              :server-items-length="totalCount"
              :footer-props="footerOptions"
              :loading="loading"
              hide-default-footer
              @click:row="onClickRow"
            >
              <template v-slot:[`header.title`]="{ header }">
                {{ header.text.toUpperCase() }}
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination
                v-model="options.page"
                :length="options.pageCount"
                :total-visible="10"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-fab-transition>
      <Button
        color="blue-grey darken-1"
        fab
        left
        bottom
        fixed
        icon-name="mdi-pencil"
        @click="movePage('/write')"
      />
    </v-fab-transition>
  </v-container>
</template>

<script>
import { getBoardListAPI } from '@/api/board'

export default {
  data() {
    return {
      headers: [
        // { text: '글 번호', align: 'center', value: 'document_srl' },
        { text: '제목', align: 'start', value: 'title' },
        { text: '작성자', align: 'center', value: 'nick_name' },
        { text: '작성일시', align: 'center', value: 'date' },
        { text: '조회수', align: 'center', value: 'readed_count' },
        { text: '댓글수', align: 'center', value: 'comment_count' },
      ],
      headers_mobile: [{ text: '제목', align: 'start', value: 'title' }],
      document: [],
      options: {
        multiSort: true,
        sortBy: [],
        sortDesc: [],
        page: 1,
        pageCount: 0,
        itemsPerPage: 20,
      },
      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50, 100],
      },
      totalCount: 0,
      loading: false,
      conditions: [
        { text: '글 번호', value: 'document_srl' },
        { text: '제목', value: 'title' },
        { text: '작성자', value: 'nick_name' },
      ],
      schType: '',
      schVal: '',
    }
  },
  watch: {
    options: {
      handler() {
        this.getBoardList()
      },
      deep: true,
    },
  },
  mounted() {
    this.getBoardList()
  },
  methods: {
    getBoardDataFromAPI(page, itemsPerPage, sort) {
      return getBoardListAPI({
        params: {
          schType: this.schType,
          schVal: this.schVal,
          page: page,
          rows: itemsPerPage,
          sort: encodeURIComponent(sort),
        },
      })
        .then(response => {
          return response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getBoardList() {
      const vm = this
      this.loading = true
      // eslint-disable-next-line
			return new Promise((resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        let sort = []

        if (sortBy.length > 0) {
          // eslint-disable-next-line
					sortBy.forEach((value, index) => {
            sort.push(
              value
                .replace(/[A-Z]/g, function(str) {
                  return '_' + str[0]
                })
                .toUpperCase() +
								' ' +
								(sortDesc[index] ? 'desc' : 'asc'),
            )
          })
        } else {
          sort.push('DOC_NO desc')
        }

        let items = this.getBoardDataFromAPI(page, itemsPerPage, sort).then(
          response => {
            items = response.data
            const total = response.total

            // console.log(items)
            for (var idx = 0; idx < items.length; idx++) {
              items[idx].date = items[idx].regdate.substr(0, 8)
            }

            setTimeout(() => {
              vm.loading = false
              this.document = items
              this.totalCount = total
              this.options.pageCount = Math.floor(
                total / this.options.itemsPerPage,
              )
            }, 1)
          },
        )
      })
    },
    onClickRow(event, data) {
      this.movePage('/detail?docNo=' + data.item.document_srl)
    },
  },
}
</script>
