
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Avatar from 'primevue/avatar';
import FileUpload from 'primevue/fileupload';
import DynamicDialog from 'primevue/dynamicdialog'
import ProgressBar from 'primevue/progressbar';
import Skeleton from 'primevue/skeleton';
import Divider from 'primevue/divider';
import Listbox from 'primevue/listbox'
import BlockUI from 'primevue/blockui';

export const addComponents = (app) => {
    app.component("InputText", InputText)
    app.component("Button", Button)
    app.component("Toast", Toast)
    app.component("FileUpload", FileUpload)
    app.component("DynamicDialog", DynamicDialog)
    app.component("ProgressBar", ProgressBar)
    app.component("Avatar", Avatar)
    app.component("Skeleton", Skeleton)
    app.component("Divider", Divider)
    app.component("Listbox", Listbox)
    app.component("BlockUI", BlockUI)
};