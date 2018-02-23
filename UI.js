/********************************* User Interface manipulations *********************************/

const UICtrl = (function () {

    return {

        /****** Getting row collection as Array ******/
        getRowCollection: function () {
            return document.querySelectorAll('.tRow');
        },

        /****** Getting values of input fields ******/
        getInputValues: function () {

            return {
                task: document.querySelector('#nameInner').value,
                expDate: document.querySelector('#expDate').value,
                expTime: document.querySelector('#expTime').value
            }
        },

        /****** Clearing the input fields ******/
        clearInputValues: function () {
            document.querySelector('#nameInner').value = '';
            document.querySelector('#expDate').value = '';
            document.querySelector('#expTime').value = '00:00';
        },

        /****** Buttons behaviour when rename icon clicked ******/
        renameButtonsShown: function () {

            //Add task button hidden
            document.querySelector('#addTask').style.display = 'none';

            //Rename task button shown
            document.querySelector('#renameTask').style.display = 'inline-block';

            //Cancel rename button shown
            document.querySelector('#cancelRename').style.display = 'inline-block';
        },

        /****** Buttons behaviour after renaming process finished ******/
        renameButtonHidden: function () {
            //Add task button shown
            document.querySelector('#addTask').style.display = 'block';

            //Rename task button hidden
            document.querySelector('#renameTask').style.display = 'none';

            //Cancel rename button hidden
            document.querySelector('#cancelRename').style.display = 'none';
        },

        /****** Drawing row in the table ******/
        drawTasksInTable: function (data) {

            console.log(data);
            //Table body container
            let parentContainer = document.querySelector('#cont');

            //Container for all rows
            let output = '';

            //Passing actions for each task
            data.forEach(task => {

                //Changing date format to more readable(DD:MM:YYYY)
                let reversedExpDate = this.reverseDate(task.expDate.slice(5), task.expDate.substr(-3, 1));

                //Getting time
                let time = task.expDate.slice(0, 5);

                //Updated full expand date
                let updatedExpTime = time + ' ' + reversedExpDate;


                //Getting time-left 
                let timer = this.getTimerOnCreate(task.expDate);

                //Appending all rows to the row container
                output += `
                    <tr class="tRow row ${timer.classname}">
                    <td class="${timer.bg} col-md-1">${task.id}</td>
                    <td  class="${timer.bg} col-md-2">${timer.inner}</td>
                    <td  class="${timer.bg} col-md-6">${task.name}</td>
                    <td  class="${timer.bg} col-md-2">${updatedExpTime}</td>
                    <td  class="${timer.bg} col-md-1">
                    <span style="cursor:pointer" class="mr-2"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>
                    <span style="cursor:pointer" class="ml-2"><i class="fa fa-times" aria-hidden="true"></i></span>
                    </td>
                    </tr>
                `;
            });

            //Appending row-container to the table body container
            parentContainer.innerHTML = output;
        },

        /****** Displaying time-left in the DOM after new task created ******/
        getTimerOnCreate: function (expDate) {

            //Current time in ms
            let now = new Date().getTime();

            //Expand time in ms
            let exp = new Date(expDate).getTime();

            let difference = exp - now;

            //Checking if date is in the past. If not - getting time left
            if (difference <= 0) {

                //Passing message and class for red row
                return {
                    inner: `Expired!`,
                    classname: 'row tRow table-light text-muted',
                    bg: ''
                }

            } else {

                //Code for getting time left in usual style
                let sec = Math.floor(difference / 1000);
                let min = Math.floor(sec / 60);
                let hour = Math.floor(min / 60);
                let day = Math.floor(hour / 24);
                sec %= 60;
                min %= 60;
                hour %= 24;

                //More common displaying timer for btter user experience
                if (day == 0 && hour == 0) {
                    return {
                        inner: `${min}m-${sec}s`,
                        classname: 'row text-light table-danger tRow',
                        bg: 'bg-danger'
                    }
                } else if (day == 0) {
                    return {
                        inner: `${hour}h-${min}m`,
                        classname: 'row text-dark table-warning tRow',
                        bg: 'bg-warning'
                    }
                } else {
                    //Passing time-left and class for green row
                    return {
                        inner: `${day}d-${hour}h-${min}m`,
                        classname: 'row text-light table-success tRow',
                        bg: 'bg-success'
                    }
                }
            }
        },

        /****** Timer displaying time left in the DOM ******/
        startTimerCount: function () {

            //Getting row collection from the DOM
            let collection = UICtrl.getRowCollection();

            //Passing timer on each row
            collection.forEach(row => {

                //Creating timer 
                let interval;

                interval = setInterval(function () {

                    //Current time in ms
                    let now = new Date().getTime();

                    //Getting date from the DOM
                    let newDate = row.lastElementChild.previousElementSibling.textContent.slice(6);

                    //Getting time from the DOM
                    let newTimer = row.lastElementChild.previousElementSibling.textContent.slice(0, 5);

                    //Passing updated full expand date after changing the Format of date from the DOM
                    let updatedExpDate = newTimer + ' ' + UICtrl.reverseDate(newDate, row.lastElementChild.previousElementSibling.textContent.substr(-5, 1));

                    //Expand time in ms
                    let exp = new Date(updatedExpDate).getTime();


                    let difference = exp - now;

                    //Checking if date is in the past. If not - getting time left 
                    if (difference <= 0) {
                        clearInterval(interval);
                        row.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML = `Expired!`;
                        row.className = 'row table-light text-muted tRow';
                        Array.from(row.children).forEach(child => {
                            child.classList.replace('bg-danger', 'bg-light');
                        });


                    } else {

                        //Code for getting time left in usual style
                        let sec = Math.floor(difference / 1000);
                        let min = Math.floor(sec / 60);
                        let hour = Math.floor(min / 60);
                        let day = Math.floor(hour / 24);

                        sec %= 60;
                        min %= 60;
                        hour %= 24;

                        //Usual displaying of time left
                        if (day == 0 && hour == 0) {
                            
                            //Displaying time-left in DOM each second
                            row.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML = `${min}m-${sec}s`;
                            row.className = 'row text-light table-danger tRow';
                            Array.from(row.children).forEach(child => {
                                child.classList.replace('bg-warning', 'bg-danger');
                            });

                        } else if (day == 0) {
                            row.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML = `${hour}h-${min}m`;
                            row.className = 'row text-dark table-warning tRow';

                            Array.from(row.children).forEach(child => {
                                child.classList.replace('bg-success', 'bg-warning');
                            });

                        } else {
                            //Displaying time-left in DOM each second
                            row.lastElementChild.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML = `${day}d-${hour}h-${min}m`;
                            row.className = 'row text-light table-success tRow';
                            Array.from(row.children).forEach(child => {
                                child.classList.add('bg-success');
                            });


                        }
                    }
                }, 1000);
            });
        },

        /****** Changing index of each row in DOM after delete task occured ******/
        changeIndexAfterDelete: function () {

            //Getting tasks row collection as Array
            let collection = this.getRowCollection();

            //Changing identifier of each row in DOM according to it's index in task row collection
            collection.forEach((row, index) => {
                row.firstElementChild.textContent = index + 1;
            })
        },

        /****** Changing format of the Date ******/
        reverseDate: function (oldTimer, separator) {

            if (!!window.chrome) {


                //Container for changed date
                let newTimer;

                //Timer after changes
                if (separator == '-') {
                    newTimer = this.reversing(oldTimer, separator, '/')
                }
                if (separator == '/') {
                    newTimer = this.reversing(oldTimer, separator, '-')
                }


                // //If date is taken from the input value
                // if (oldTimer.indexOf('-') != -1) {
                //     let sth = oldTimer.split('-');
                //     newTimer = (sth[2] + '/' + sth[1] + '/' + sth[0]).replace(' ', '');
                // }

                // //If date is taken from the DOM
                // if (oldTimer.indexOf('/') != -1) {
                //     let sth = oldTimer.split('/');
                //     newTimer = (sth[2] + '-' + sth[1] + '-' + sth[0]).replace(' ', '');
                // }

                return newTimer;
            } else {
                return oldTimer;
            }

        },

        /****** Changing date format and separators ******/
        reversing: function (oldTimer, separator, newSeparator) {
            let newFormat;

            if (oldTimer.indexOf(separator) != -1) {
                let sth = oldTimer.split(separator);
                newFormat = (sth[2] + newSeparator + sth[1] + newSeparator + sth[0]).replace(' ', '');
            }

            return newFormat;
        },

        /****** DIsplaying error messages ******/
        showAlert: function (message, firstClass, secondClass) {

            //Popping out container for alert messages
            let inner = document.querySelector('#alert');

            //Hidden by default
            inner.style.opacity = '1';


            //Check and passing class name
            if (!inner.classList.contains(firstClass) && inner.classList.contains(secondClass)) {
                inner.classList.replace(secondClass, firstClass);
            }

            //Dynamically given alert message
            inner.innerHTML = message;

            //Function for fade-out effect
            setTimeout(function () {
                inner.style.opacity = '0';
            }, 2500);
        }
    }
})()