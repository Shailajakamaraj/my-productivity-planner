// DARK MODE

function toggleDarkMode(){

document.body.classList.toggle("dark")

localStorage.setItem("darkMode",
document.body.classList.contains("dark"))

}

if(localStorage.getItem("darkMode") === "true"){

document.body.classList.add("dark")

}



// DATE SYSTEM

let tasks=[]

let currentDate=new Date()

function formatDate(date){

return date.toISOString().split("T")[0]

}

function displayDate(){

document.getElementById("currentDate").innerText=currentDate.toDateString()

displayTasks()

}

function changeDay(step){

currentDate.setDate(currentDate.getDate()+step)

displayDate()

}



// FIREBASE CLOUD SYNC

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_PROJECT.appspot.com",

messagingSenderId: "XXXX",

appId: "XXXX"

}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()



// ADD TASK

function addTask(){

let text=document.getElementById("taskInput").value

let type=document.getElementById("taskType").value

if(text==="") return

let task={

text,

type,

date:formatDate(currentDate),

completed:false

}

tasks.push(task)

saveToCloud(task)

displayTasks()

}



// SAVE TO CLOUD

function saveToCloud(task){

db.collection("tasks").add(task)

}



// LOAD FROM CLOUD

function loadTasks(){

db.collection("tasks").get().then(snapshot=>{

tasks=[]

snapshot.forEach(doc=>{

tasks.push(doc.data())

})

displayTasks()

})

}



// DISPLAY TASKS

function displayTasks(){

let list=document.getElementById("taskList")

list.innerHTML=""

let date=formatDate(currentDate)

tasks.forEach((task,i)=>{

if(task.date===date){

let li=document.createElement("li")

li.innerHTML=`

<input type="checkbox"

${task.completed?"checked":""}

onclick="toggleTask(${i})">

${task.text}

`

list.appendChild(li)

}

})

}



// COMPLETE TASK

function toggleTask(i){

tasks[i].completed=!tasks[i].completed

displayTasks()

}



displayDate()

loadTasks()



// SWIPE NAVIGATION

let startX=0

document.addEventListener("touchstart",e=>{

startX=e.touches[0].clientX

})

document.addEventListener("touchend",e=>{

let endX=e.changedTouches[0].clientX

if(startX-endX>50) changeDay(1)

if(endX-startX>50) changeDay(-1)

})



// SERVICE WORKER

if("serviceWorker" in navigator){

navigator.serviceWorker.register("service-worker.js")

}