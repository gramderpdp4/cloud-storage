<template>
  <div class="w-full overflow-auto sm:flex md:h-screen md:flex">
    <div class="bg-primary lg:fixed md:h-full sm:w-1/3 md:w-2/12 z-10 fixed sm:relative w-full h-26 shadow-md panel">
     <sidebarMenu :name="user.name"/>
    </div>
    <div class="bg-primary h-full overflow-auto md:h-full lg:ml-16% sm:w-8/12 md:w-5/6 z-0 sm:pt-5 pt-40 absolute sm:relative w-full">
      <div class="mx-4 grid lg:flex md:h-full">
        <div class="flex order-last lg:w-2/3 lg:order-first flex-col h-full">
          <div class="categories">
            <h2 class="text-black text-xl my-6 lg:mt-2 font-semibold">Categorias</h2>
            <div class="flex max-w-95vw md:overflow-hidden sm:flex-wrap md:grid-cols-4 md:flex-auto sm:w-full overflow-auto gap-2">
              <a v-for="(category, index) in categories" :key="index"
                class="border-gray-300 md:flex-1">
                <div :style="category.bg_color" class="rounded-2xl md:w-full sm:w-30vw w-36 p-4 text-white">
                  <span class="material-symbols-outlined">
                    {{ category.icon }}
                  </span>
                  <p class="mt-1 font-bold text-sm">{{ category.title }}</p>
                  <p class="text-sm">{{ countFiles(category) }} </p>
                </div>
              </a>
            </div>
          </div>
          <h2 class="my-6 text-black font-semibold text-xl">Arquivos recentes</h2>
          <div class="recent-files md:overflow-auto overflow-x-scroll max-h-screen">
            <TransitionGroup name="list-files" tag="ul">
              <ul v-if="files.length > 0">
                <li v-for="(file, index) in files" :key="index" @click="fileActions(file.name, file.id, file.fullname)"  class="flex justify-between p-4 mb-3
                bg-white cursor-pointer w-full md:max-w-md rounded-xl border-inherit shadow-sm">
                  <div class="file-media">
                    <span class="material-symbols-outlined">
                      {{ file.icon }}
                    </span>
                  </div>
                  <div class="file-name font-semibold overflow-hidden max-w-40 whitespace-nowrap text-ellipsis"
                    v-text="file.name"></div>
                  <small class="file-type uppercase" v-text="file.type"></small>
                  <small class="file-size capitalize" v-text="file.size"></small>
                </li>
              </ul>
              <div v-else class="flex flex-col items-center mx-auto justify-center mt-5">
                <img :src="empty_icon" alt="" width="120" />
                <span class="text-center font-semibold mt-3" style="color: var(--color-secondary)">Nenhum arquivo</span>
              </div>
            </TransitionGroup>
          </div>
        </div>
        <div class="container-top sm:items-center lg:h-fit lg:p-5 lg:justify-normal lg:mt-2 lg:grid lg:ml-5 lg:w-1/3 sm:gap-3 sm:flex rounded-xl shadow h-full relative p-4 justify-around">
          <div class="upload-file rounded-xl 
           w-auto relative">
            <input type="file" class="hidden" multiple id="file" @input="newFile($event)">
            <label for="file" class="flex flex-col items-center mx-auto justify-center cursor-pointer 
            md:duration-300 md:ease-in-out md:transform md:transition-transform md:hover:scale-110">
              <img :src="upload_icon" alt="" />
              <span class="text-center font-semibold sm:text-sm" style="color: var(--color-secondary-700)">Carregar arquivos</span>
            </label>
          </div>
          <Divider type="solid" class="sm:hidden lg:block"/>
          <Divider type="solid" class="hidden sm:block lg:hidden" layout="vertical" />
          <div class="storage rounded-xl">
            <div class="grid">
              <div class="flex justify-between">
                <strong class="text-xs" style="color: var(--color-secondary)">Seu armazenamento</strong>
                <small class="font-semibold sm:ml-4 inline-block text-xs" style="color: var(--color-secondary-700)">Restam {{ lack_percent }}%</small>
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
  </div>
</template>
<script>
import { listFiles } from '../scripts/list-files.js';
import { fileType } from '../scripts/type-file.js'
import { usedStorage } from '../stores/storage.js';
import { userStore } from '../stores/user-store.js';
import loadingUploadVue from '../components/loading-upload.vue'
import upload_icon from '../assets/upload.svg'
import empty_icon from '../assets/empty.svg'
import SkeletonFiles from '../components/skeleton-files.vue';
import sidebarMenu from '../components/sidebar-menu.vue';
import dialogActions from '../components/dialog-actions.vue';

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
    },
    'files': {
      handler(newFiles, oldFiles){
        console.log({ newFiles, oldFiles })
        if ( newFiles !== oldFiles ) {
          const file_removed = oldFiles.filter(file => !newFiles.includes(file));

          console.log('file removed', file_removed)
        }
      },
      deep: true,
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

    fileActions(filename, id, fullname) {
      const fileIndex = this.files.findIndex(find => find.id == id);
      const fullname_split = fullname.split('.');
      const { type } = fileType(fullname_split[fullname_split.length - 1]);
      const category_index = this.categories.findIndex(category => category.type == type);
      
      if (fileIndex !== -1) {
        const dialog = this.$dialog.open(dialogActions, {
        props: {
          header: fullname,
          modal: true,
          style: {
              width: '350px',
            },
            breakpoints: {
              '500px': '93vw'
          },
        },
        data: {
          fullname: fullname,
          filename: filename,
          updated: () => {
            this.files.splice(fileIndex, 1)  
            this.getFiles()

            if ( category_index !== -1 ) {
              this.categories[category_index].count -= 1
            }

            dialog.close()
          }
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
          const fullname = metadata.name;
          const size = metadata.size;
          const fullpath = metadata.fullPath;
          const id = metadata.generation;

          if (name[1]) {
            const { type, icon } = fileType(name[name.length - 1])

            const index = this.categories.findIndex(find => find.type == type);

            if (this.files.filter(filter => filter.id == id).length == 0) {
              this.files.push({
                fullname: fullname, name: name.slice(0, -1).join('.'), type: name[name.length - 1], 
                size: custom.sizeCustom, icon: icon, id: id 
              })
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