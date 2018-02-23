/********************************* Data manipulations *********************************/

const DataCtrl = (function () {

    /****** Task Constructor ******/
    function Task(id, name, expDate) {
        this.id = id;
        this.name = name;
        this.expDate = expDate;
    }

    /****** Tasks from the Local Storage ******/
    let taskCollection = {
        tasksTODO: StorageCtrl.getStorageInner()
    };

    return {

        /****** Adding new task into collection of tasks ******/
        addTaskToCollection: function (task) {

            //Array of all tasks from the Local Storage
            let data = taskCollection.tasksTODO;

            //Creating identifier for new task
            let ID;
            if (data == '') {
                ID = 1;
            } else {
                ID = +data[data.length - 1].id + 1;
            }

            //Appending expand time to expand date
            let newExpDate = task.expTime + ' ' + task.expDate;
            
            //Creating new Task instance based on the input values(task) and ID
            let newTask = new Task(ID, task.task, newExpDate);

            //Array with new Task
            taskCollection.tasksTODO.push(newTask);

            
            return {
                //Array with all tasks, including newly added one
                collection: taskCollection.tasksTODO,
                //New task object
                newTask: newTask
            }
        },
       
        /****** Changing task in the collection as a rename consequence ******/
        applyRenamedTask: function (newTask) {
            let collection = taskCollection.tasksTODO;
            
            //Replacing oldTask with newTask if there is coincidence between ID's
            collection.forEach((task, index) => {
                if (task.id == newTask.id) {
                    taskCollection.tasksTODO.splice(index, 1, newTask);
                }
            });

            //Returning updated collection of tasks
            return taskCollection.tasksTODO;
        },

        /****** Creating new task instance ******/
        createTskInstance: function (id, newName, newExpDate) {
            return new Task(id, newName, newExpDate);
        }
    }
})();