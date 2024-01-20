<template>
  <div class="sm:grid sm:gap-8 flex h-full w-full md:overflow-hidden">
    <div class="h-screen sm:shadow-md md:fixed sm:bg-primary sm:h-fit sm:z-10 sm:fixed sm:top-0 sm:w-full sm:order-last hrink panel md:bg-secondary xl:w-1/6 md:w-1/6">
     <sidebarMenu :name="user.name"/>
    </div>
    <div class="grow lg:grid xl:flex md:ml-1/6 sm:top-24 sm:relative sm:z-1 sm:order-last sm:max-w-p-100 shrink h-full panel-content sm:flex sm:flex-col md:grid sm:p-0 p-5 md:w-3/4 xl:w-3/4">
      <div class="flex xl:order-first md:order-last flex-col xl:w-3/4 sm:order-last">
        <div class="categories">
          <h2 class="ml-4 mb-4 font-extrabold text-xl" style="color: var(--color-secondary)">Categorias</h2>
          <div class="xl:flex sm:flex sm:gap-4 touch-pan-x sm:overflow-x-auto sm:max-w-vw-100 md:grid md:grid-cols-4 lg:grid-cols-4 md:gap-3 xl:gap-0">
            <a v-for="(category, index) in categories" :key="index"
              class="sm:min-w-36 border-gray-300 md:duration-300 md:ease-in-out md:transform md:transition-transform md:hover:scale-110">
              <div :style="category.bg_color" class="rounded-2xl sm:w-full mx-4 p-4 text-white xl:w-36 md:w-full">
                <span class="material-symbols-outlined">
                  {{ category.icon }}
                </span>
                <p class="mt-1 font-bold xl:text-md md:text-sm">{{ category.title }}</p>
                <p class="text-sm">{{ countFiles(category) }} </p>
              </div>
            </a>
          </div>
        </div>
        <h2 class="ml-4 mb-4 mt-10 font-extrabold text-xl" style="color: var(--color-secondary)">Arquivos recentes</h2>
        <div class="recent-files overflow-x-scroll sm:max-h-screen md:h-screen">
          <TransitionGroup name="list-files" tag="ul">
            <div v-if="files.length > 0">
              <li v-for="(file, index) in files" :key="index" class="flex justify-between
              p-4 ml-4 mb-3 xl:max-w-md sm:w-3/4 lg:w-3/4 md:w-3/4 bg-white cursor-pointer rounded-xl border-inherit shadow-sm
              duration-300 ease-in-out transform transition-transform hover:scale-105
              ">
                <div class="file-media">
                  <span class="material-symbols-outlined">
                    {{ file.icon }}
                  </span>
                </div>
                <div class="file-name font-semibold overflow-hidden lg:max-w-40 whitespace-nowrap text-ellipsis"
                  v-text="file.name"></div>
                <small class="file-type uppercase" v-text="file.type"></small>
                <small class="file-size capitalize" v-text="file.size"></small>
              </li>
            </div>
            <div v-else class="flex flex-col items-center mx-auto justify-center mt-5">
              <img :src="empty_icon" alt="" width="120" />
              <span class="text-center font-semibold mt-3" style="color: var(--color-secondary)">Nenhum arquivo</span>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div class="container-top shadow lg:justify-center xl:grid xl:bg-white md:justify-between md:gap-2 md:items-center md:h-fit md:flex sm:h-fit sm:bg-none xl:ml-4 rounded-xl h-full relative sm:px-1 p-6 xl:w-1/3">
        <div class="upload-file md:border-slate-300 md:border-2 xl:order-first xl:mb-6 xl:py-12 md:p-4 md:order-first rounded-xl 
         w-auto sm:shadow-2xl h-auto py-14 px-12 sm:py-4 sm:px-4 relative sm:fixed sm:bottom-2 sm:right-2">
          <input type="file" class="hidden" multiple id="file" @input="newFile($event)">
          <label for="file" class="flex flex-col items-center mx-auto justify-center cursor-pointer 
          md:duration-300 md:ease-in-out md:transform md:transition-transform md:hover:scale-110">
            <img :src="upload_icon" alt="" />
            <span class="text-center font-semibold sm:text-sm" style="color: var(--color-secondary-700)">Carregar arquivos</span>
          </label>
        </div>
        <div class="storage sm:border-slate-300 sm:mx-2 sm:border-2 md:border-slate-300 md:border-2 md:mt-0 mt-8 bg-gray-100 p-3 rounded-xl">
          <div class="grid">
            <div class="flex justify-between">
              <strong class="text-xs" style="color: var(--color-secondary)">Seu armazenamento</strong>
              <small class="font-semibold md:ml-4 inline-block text-xs" style="color: var(--color-secondary-700)">Restam {{ lack_percent }}%</small>
            </div>
            <p class="text-xs mb-2 mt-4" style="color: var(--color-secondary)">{{ used_storage }} de 100MB já usados</p>
            <ProgressBar :value="used_percent" :pt="{
              value: { style: { background: 'linear-gradient(to right, #2b75b3, #45b3ee)', fontSize: '0.8rem' } }
            }">
            </ProgressBar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { listFiles } from '../scripts/list-files.js';
import { fileType } from '../scripts/type-file.js'
import { usedStorage } from '../stores/used-storage.js';
import { userStore } from '../stores/user-store.js';
import loadingUploadVue from '../components/loading-upload.vue'
import upload_icon from '../assets/upload.svg'
import empty_icon from '../assets/empty.svg'
import SkeletonFiles from '../components/skeleton-files.vue';
import sidebarMenu from '../components/sidebar-menu.vue';

const store = usedStorage();
const storeUser = userStore();

export default {
  data() {
    return {
      upload_icon: upload_icon,
      empty_icon: empty_icon,
      used_storage: 0,
      lack_percent: 0,
      used_percent: 0,
      user: {},
      files: [],
      categories: [
        {
          title: 'Fotos',
          icon: 'imagesmode',
          bg_color: 'background-color: #6663FF',
          type: 'image',
          count: 0
        },
        {
          title: 'Documentos',
          icon: 'file_copy',
          bg_color: 'background-color: #00A1B6',
          type: 'document',
          count: 0
        },
        {
          title: 'Vídeos',
          icon: 'movie',
          bg_color: 'background-color: #E26C9F',
          type: 'movie',
          count: 0
        },
        {
          title: 'Audio',
          icon: 'mic',
          bg_color: 'background-color: var(--color-secondary-700)',
          type: 'audio',
          count: 0
        },
      ]
    }
  },

  components: {
    SkeletonFiles, loadingUploadVue, sidebarMenu
  },

  watch: {
    'storeUser.uid': {
      handler() {
        this.files.length = 0;
        this.getFiles()
        this.getUser()
      },
      immediate: true,
      deep: true
    }
  },

  computed: {
    firstName() {
      if (this.user.name)

        return this.user.name.split(' ').slice(0, 1).join()
    }
  },

  methods: {
    newFile(event) {
      const files = event.target.files

      if (files.length > 0) {
        const obj = Array.from(files);

        this.$dialog.open(loadingUploadVue, {
          props: {
            style: {
              width: '30vw',
            },
            breakpoints: {
              '640px': '90vw'
            },
            header: `Fazendo upload de ${obj.length} arquivos`,
            modal: true
          },
          data: {
            files: obj,
            updated: () => {
              this.getFiles()
            }
          },
          onClose: () => {
            event.target.value = ''
          }
        })
      }
    },

    countFiles(category) {
      return category.count > 1 ? `${category.count} arquivos` : `${category.count} arquivo`
    },

    async getUsedStorage() {
      const { used, percent, lack } = await store.returnStoredUsed()

      this.used_storage = used;
      this.used_percent = percent.toFixed(2)
      this.lack_percent = lack.toFixed(2)
    },

    async getFiles() {
      const { files } = await listFiles()

      if (files.length > 0) {
        files.forEach(file => {
          const metadata = file.metadata;
          const custom = metadata.customMetadata;
          const name = metadata.name.split('.');
          const size = metadata.size;
          const id = metadata.generation;
          
          if (name[1]) {
            const { type, icon } = fileType(name[1])

            const index = this.categories.findIndex(find => find.type == type);

            if (this.files.filter(filter => filter.id == id).length == 0) {
              this.files.push({ name: name[0], type: name[1], size: custom.sizeCustom, icon: icon, id: id })
              if (index !== -1) {
                this.categories[index].count += 1
              }
            }

          }
        })
      }

      this.getUsedStorage()
    },

    async getUser() {
      const user = await storeUser.returnUser();

      this.user.name = user.name;
      this.user.email = user.email;
    }
  },
}
</script>
<style scoped>

.panel-content,
.upload-file,
.storage {
  background-color: var(--color-primary);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}</style>