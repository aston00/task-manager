/********************************* Local Storage manipulations *********************************/

const StorageCtrl = (function(){

    return {
        /****** Getting inner of Local Storage ******/
        getStorageInner: function(){
            let tasksTODO;

            if(localStorage.getItem('tasksTODO') === null) {
                tasksTODO = [];
            } else {
                tasksTODO = JSON.parse(localStorage.getItem('tasksTODO'));
            }
            return tasksTODO;
        },

        /****** Passing new task into Local Storage******/
        addToLocalStorage: function(task){
            let tasksTODO = this.getStorageInner();
            tasksTODO.push(task);
            localStorage.setItem('tasksTODO', JSON.stringify(tasksTODO));
        },

        /****** Renaming existing item inside Local Storage ******/
        renameItemInStorage: function(newTask) {
            let data = this.getStorageInner();

            //For each item in storage replace old task with new one
            data.forEach((task, index) => {
                if(task.id == newTask.id) {
                    data.splice(index, 1, newTask);
                }
            });

            //Pass changes into Storage
            localStorage.setItem('tasksTODO', JSON.stringify(data));
        },

        /****** Removing item from Local Storage ******/
        deleteFromLocalStorage: function(id){
            let data = this.getStorageInner();
            
            //Remove item task from array if ID-s are equal
            data.forEach((task, index) => {
                if(task.id == id) {
                    data.splice(index, 1);
                }
            });

            //Passing changes to the Storage
            localStorage.setItem('tasksTODO', JSON.stringify(data));
        },

        /****** Changing index of each element in the task array after task was deleted ******/
        updateIndexValues: function(){
            let tasks = this.getStorageInner();

            //Changing identifiers according to the element index in the array
            tasks.forEach((task, index) => {
                task.id = index + 1;
            });

            //Passing changes to the Storage
            localStorage.setItem('tasksTODO', JSON.stringify(tasks));
        }
    }
})()