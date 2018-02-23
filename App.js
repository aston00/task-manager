/********************************* Application manipulations *********************************/

const AppCtrl = (function () {

    /****** Creating event listeners ******/
    const loadEventListeners = function () {
        document.querySelector('#addTask').addEventListener('click', addTaskToTable);
        document.querySelector('#cancelRename').addEventListener('click', cancelRename);
        document.querySelector('#cont').addEventListener('click', deleteTaskFromTable);
        document.querySelector('#cont').addEventListener('click', renameTaskInTable);
        document.addEventListener('DOMContentLoaded', drawTableAfterLoad);
    }

    /****** Draw table after DOM-content loaded ******/
    function drawTableAfterLoad() {

        //If Storage is turned off
        if (typeof window.Storage === 'undefined') {
            alert('Storage turned off...');
        }
        //Updating indexes in storage
        StorageCtrl.updateIndexValues();

        //Getting Storage data
        let collection = StorageCtrl.getStorageInner();

        //Drawing table rows based on the data from Storage
        UICtrl.drawTasksInTable(collection);

        //Starting timer in TimeLeft section
        UICtrl.startTimerCount();
    }

    /****** Adding new task to the table ******/
    function addTaskToTable(e) {

        //Getting input values
        let values = UICtrl.getInputValues();

        //Prevent empty values of input fields
        if (values.task == '' || values.expDate == '' || values.expTime == '') {

            //Showing alert message
            UICtrl.showAlert('Please fill the fields!!!', 'alert-danger', 'alert-success');
        } else {

            //Creating new Task instance and passing ot to the collection of other tasks
            let newData = DataCtrl.addTaskToCollection(values);

            //Redrawing table with new task
            UICtrl.drawTasksInTable(newData.collection);

            //Adding new task to the LocalStorage
            StorageCtrl.addToLocalStorage(newData.newTask);

            //Clearing input fields
            UICtrl.clearInputValues();

            //Showing alert about successfull adding 
            UICtrl.showAlert('New task successfully added!', 'alert-success', 'alert-danger');
        }

        //Starting timer in TimeLeft section
        UICtrl.startTimerCount();

        //Preventing default behaviour of the 'submit' input type
        e.preventDefault();
    }

    /****** Actions when rename icon clicked ******/
    function renameTaskInTable(e) {
        let indentifier = '';
        //Passing actions on rename-icon
        if (e.target.classList.contains('fa-pencil-square-o')) {

            //Clearing inputs for values-for-rename 
            UICtrl.clearInputValues();

            //Unique identifier for future manipulations
            identifier = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;

            //Displaying rename button and hiding AddTask button
            UICtrl.renameButtonsShown();

            //Passing value into TaskName input field
            document.querySelector('#nameInner').value = e.target.parentElement.parentElement.parentElement.lastElementChild.previousElementSibling.previousElementSibling.textContent;

            //Passing value into Date input field
            document.querySelector('#expDate').value = UICtrl.reverseDate(e.target.parentElement.parentElement.parentElement.lastElementChild.previousElementSibling.textContent.slice(6), e.target.parentElement.parentElement.parentElement.lastElementChild.previousElementSibling.textContent.substr(-5, 1));

            //Passing value into Time input field
            document.querySelector('#expTime').value = e.target.parentElement.parentElement.parentElement.lastElementChild.previousElementSibling.textContent.substring(5, 0);
        }

        //Saving rename changes
        document.getElementById('renameTask').addEventListener('click', () => { saveRenameChanges(identifier) });

    }

    /****** Apply rename changes ******/
    function saveRenameChanges(identifier) {

        //Values of input fields after changing is done
        let newName = document.querySelector('#nameInner').value;
        let newDate = document.querySelector('#expTime').value + ' ' + document.querySelector("#expDate").value;
        let newTime = document.querySelector('#expTime').value;


        //Prevent empty values of input fields
        if (newName == '' || newDate == '' || newTime == '') {
            //Showing alert message 
            UICtrl.showAlert('Please fill the fields!!!', 'alert-danger', 'alert-success');
        } else {

            //Creating new Task based on new input values
            let changedTask = DataCtrl.createTskInstance(identifier, newName, newDate);

            //Promise to prevent getting wrong info if delay occurs
            let promise = new Promise((resolve, reject) => {

                //Rename item in local storage
                StorageCtrl.renameItemInStorage(changedTask)
            })
                .then(resolve =>
                    //get updated local storage inner
                    resolve(StorageCtrl.getStorageInner()))
                .then(res =>
                    UICtrl.drawTasksInTable(res));

            //Clearing input fields
            UICtrl.clearInputValues();

            //Hiding rename button and showing addTask button
            UICtrl.renameButtonHidden();

            //Showing alert about success in renaming
            UICtrl.showAlert('Task successfully changed!', 'alert-success', 'alert-danger');
        }

        //Refreshing timer in TimeLeft section 
        UICtrl.startTimerCount();
    }

    /****** Cancel rename ******/
    function cancelRename(e) {

        //Clearing input values
        UICtrl.clearInputValues();

        //Hiding Rename button/showing Addtask button
        UICtrl.renameButtonHidden();

        //Preventing default behaviour of 'submit' type
        e.preventDefault();
    }

    /****** Removing task from the table ******/
    function deleteTaskFromTable(e) {
        //Passing actions on delete-icon
        if (e.target.classList.contains('fa-times')) {

            //Removing task from the LocalStorage with passing unique identifier
            StorageCtrl.deleteFromLocalStorage(e.target.parentElement.parentElement.parentElement.firstElementChild.textContent);

            //Removing task from DOM
            e.target.parentElement.parentElement.parentElement.remove();

            //Updating index of each row in DOM
            UICtrl.changeIndexAfterDelete();

            //Updating index of each row in the LocalStorage
            StorageCtrl.updateIndexValues();

            //Clear input fields(to prevent deleted values be in inputs)
            UICtrl.clearInputValues();

            //Displaying message about success deleting
            UICtrl.showAlert('Task successfully deleted!', 'alert-success', 'alert-danger');
        }
    }

    return {

        //Load all event listeners
        init: function () {
            
            loadEventListeners();
        }
    }
})();

//Launching app
AppCtrl.init();

