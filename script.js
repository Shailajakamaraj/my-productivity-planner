let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentDate = new Date();

function formatDate(date){
    return date.toISOString().split("T")[0];
}

// DISPLAY CURRENT DATE
function displayDate(){
    document.getElementById("currentDate").innerText = currentDate.toDateString();
    displayTasks();
}

// CHANGE DAY
function changeDay(step){
    currentDate.setDate(currentDate.getDate() + step);
    displayDate();
}

// ADD TASK
function addTask(){
    let text = document.getElementById("taskInput").value;
    let type = document.getElementById("taskType").value;
    if(text === "") return;

    tasks.push({
        text: text,
        type: type,        // "one-time", "daily", "weekly", "monthly"
        date: formatDate(currentDate),
        completed: false,
        reason: ""
    });

    save();
    displayTasks();
    document.getElementById("taskInput").value = "";
}

// DISPLAY TASKS
function displayTasks(){
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let today = new Date(currentDate);
    let todayDate = today.getDate();
    let todayMonth = today.getMonth();
    let todayYear = today.getFullYear();
    let todayWeek = getWeekNumber(today);

    tasks.forEach((task, i) => {
        let taskDate = new Date(task.date);
        let show = false;

        switch(task.type){
            case "one-time":
                show = (taskDate.getDate() === todayDate &&
                        taskDate.getMonth() === todayMonth &&
                        taskDate.getFullYear() === todayYear);
                break;

            case "daily":
                show = true; // always show
                break;

            case "weekly":
                show = (taskDate.getDay() === today.getDay()); // same weekday
                break;

            case "monthly":
                show = (taskDate.getDate() === todayDate); // same day of month
                break;
        }

        if(show){
            let li = document.createElement("li");
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${i})">
                <span class="${task.completed ? "completed" : ""}">${task.text}</span>
                <button onclick="deleteTask(${i})">❌</button>
                ${task.reason ? `<div class="reason">Reason: ${task.reason}</div>` : ""}
            `;
            list.appendChild(li);
        }
    });
}

// TOGGLE TASK
function toggleTask(i){
    if(tasks[i].completed){
        let reason = prompt("Why didn't you complete this task?");
        if(reason === null || reason.trim() === ""){
            alert("Please enter a reason before unchecking.");
            displayTasks();
            return;
        }
        tasks[i].completed = false;
        tasks[i].reason = reason;
    } else {
        tasks[i].completed = true;
        tasks[i].reason = "";
    }
    save();
    displayTasks();
}

// DELETE TASK
function deleteTask(i){
    tasks.splice(i,1);
    save();
    displayTasks();
}

// SAVE
function save(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// DARK MODE
function toggleDarkMode(){
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}
if(localStorage.getItem("darkMode") === "true"){
    document.body.classList.add("dark");
}

// SWIPE NAVIGATION
let startX = 0;
document.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
document.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if(startX - endX > 50) changeDay(1);
    if(endX - startX > 50) changeDay(-1);
});

// INIT
displayDate();

// ISO week number helper (for optional future use)
function getWeekNumber(d){
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}
