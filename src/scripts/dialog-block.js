export const dialogSpinner = (condition) => {
    const dialogs = document.querySelectorAll(".p-dialog");
    
    if (dialogs) {
       if(condition) dialogs.forEach(dialog => dialog.classList.add("p-dialog-spinner"))
       else dialogs.forEach(dialog => dialog.classList.remove("p-dialog-spinner"))
    } 
    
    return
}