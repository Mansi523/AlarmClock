// Define your DOM element references outside the event handler
const currentTimeDisplay = document.getElementById("current-time");

// to display current time in the UI
function updateCurrentTime() {
  const currentTimeDisplay = document.getElementById("current-time");
  if (currentTimeDisplay) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = now.getHours() < 12 ? "AM" : "PM";
    currentTimeDisplay.innerText = `${hours}:${minutes}:${seconds} ${ampm}`;
  } else {
    console.error("Element with id 'current-time' not found.");
  }
}

window.addEventListener("DOMContentLoaded", function () {
  setInterval(updateCurrentTime, 1000);
});

let alarmList = [];

//for setting time in the alarm
const setAlarm = () => {
  //variables for storing the time after clicking the setAlarm function
  let hours = Number(document.querySelector("#setAlarm-hour").value);
  let mins = Number(document.querySelector("#setAlarm-min").value);
  let secs = Number(document.querySelector("#setAlarm-sec").value);
  let ampm = document.querySelector("#setAlarm-ampm").value;
  // if input box is empty.
  if (hours === "" || mins === "" || secs === "" || ampm === "") {
    alert("plz enter the Time!!");
    return;
  }
  //  if user put invalid time then show alert
  if (ampm === "AM" && hours > 12) {
    alert(`it shoud be PM.
    plz check and enter again!!`);
    return;
  } else if (ampm === "PM" && hours <= 12) {
    alert(`it shoud be AM.
    plz check and enter again!!`);
    return;
  }

  // if the input time already exist in the list then show alert

  let ifExist = alarmList.find(
    (ifexist) =>
      hours === ifexist.hours && mins === ifexist.mins && secs === ifexist.secs
  );
  console.log("ifexist", ifExist);
  if (ifExist !== undefined) {
    alert("Alarm already exist!!");
    document.querySelector("#setAlarm-hour").value = "";
    document.querySelector("#setAlarm-min").value = "";
    document.querySelector("#setAlarm-sec").value = "";
    return;
  }

  // negative values for time is taken cared and value for hour should be less than 12.
  if (
    hours > 23 ||
    hours < 0 ||
    mins > 59 ||
    mins < 0 ||
    secs > 59 ||
    secs < 0 ||
    ampm === "AM/PM"
  ) {
   

    alert("plz enter a valid Time");
    // console.log(typeof hours, mins, secs, ampm);
    return;
  }

 
  //created the new alarm object
  const Alarm = {
    id: Date.now(),
    hours,
    mins,
    secs,
    ampm,
    setime: null,
  };

  //addalarm to the alarmList

  alarmList.push(Alarm);

  // console.log(alarmList);
  //display the alarm in the UI
  HandleDisplay(alarmList);
  // calculate the time until the alarm
  const currtime = new Date();
  // console.log("**", currtime);


  const alarmtime = new Date(
    currtime.getFullYear(),
    currtime.getMonth(),
    currtime.getDate(),
    hours,
    mins,
    secs
  );
  // console.log(">>>", alarmtime);
  // getting the value of hours,mins and sec in currhours,currmins and currsecs.
  const currhours = currtime.getHours();
  const currmins = currtime.getMinutes();
  const currsecs = currtime.getSeconds();

  // calculate the time in miliseconds.
  const currentmilliseconds =
    (currhours * 60 * 60 + currmins * 60 + currsecs) *
    1000;
  // getting the value of hours,mins and sec in alarmhours,alarmmins and alarmsecs.
  const alarmtimehours = alarmtime.getHours();
  const alarmtimemins = alarmtime.getMinutes();
  const alarmtimesecs = alarmtime.getSeconds();

  // calculate the time in miliseconds.
  const alarmtimemilliseconds =
    (alarmtimehours * 60 * 60 +
      alarmtimemins * 60 +
      alarmtimesecs ) *
    1000;
  // calculate the time difference in miliseconds.

  let alarmring = alarmtimemilliseconds - currentmilliseconds;

  // console.log(alarmring);
  if(alarmring<=0){
    alarmring+=24*60*60*1000;
  }
  // setTimeout function for the alarm.
  Alarm.setime = setTimeout(() => {
    alert(`It's ${hours}:${mins}:${secs}${ampm}.
           press OK to Turn OFF the alarm!!
  `);
  }, alarmring);
  // clear the input field
  document.querySelector("#setAlarm-hour").value = "";
  document.querySelector("#setAlarm-min").value = "";
  document.querySelector("#setAlarm-sec").value = "";
};
// delete alarm function
function handleDelete(i) {
  const deletealarm = alarmList.find((alarm) => alarm.id === i);
  clearTimeout(deletealarm.setime);
  // Alarm.setime = null;
  const updateAlarm = alarmList.map((items)=>{
    if(items.id === i){
      return {...items,setime:null}
    }
   return items;
  })
  HandleDisplay(updateAlarm);
  let restalarms = alarmList.filter((alarm) => alarm.id !== i);
  alarmList = restalarms;
  // console.log("delete", deletealarm);
  HandleDisplay(alarmList);
}

//display the alarm in the UI.
const HandleDisplay = (alarmList) => {
  const setAlarmlist = document.querySelector("#setAlarm-list");
  setAlarmlist.innerHTML = "";
  setAlarmlist.innerHTML += alarmList.map((item) => {
    const { hours, mins, secs, id, ampm } = item;
    const hours1 = hours.toString().padStart(2, "0");
    const mins1 = mins.toString().padStart(2, "0");
    const secs1 = secs.toString().padStart(2, "0");
    return `
    <div class="parent">
    <div class="current-time-alarm-left" key=item.id>
      <div class="current-time-alarm">${hours1}:${mins1}:${secs1} ${ampm}</div>
    </div>
    <div class="current-time-alarm-right">
      <button onclick="handleDelete(${id})">DELETE</button>
    </div>
    </div>
    `;
  });
};

