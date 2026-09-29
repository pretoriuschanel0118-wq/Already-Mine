let selectedGoals = [];
let selectedEnergy = "";
let selectedTheme = {};

let currentUser = null;


// ==========================
// SCREEN CONTROL
// ==========================

function openScreen(id){

document
.querySelectorAll(".screen")
.forEach(screen=>{
screen.classList.remove("active");
});


document
.getElementById(id)
.classList.add("active");

window.scrollTo(0,0);

}



// ==========================
// SIGN UP
// ==========================

async function signup(){


const name =
document.getElementById("signupName").value;


const email =
document.getElementById("signupEmail").value;


const password =
document.getElementById("signupPassword").value;



if(!name || !email || !password){

alert("Please complete all fields ✨");
return;

}



const {
data,
error
}=

await supabaseClient.auth.signUp({

email:email,

password:password

});



if(error){

alert(error.message);
return;

}



await supabaseClient
.from("profiles")
.insert({

id:data.user.id,

name:name,

goals:[],

energy:"",

future:""

});



alert(
"Account created ✨"
);



openScreen("onboarding");


}





// ==========================
// LOGIN
// ==========================

async function login(){


const email =
document.getElementById("loginEmail").value;


const password =
document.getElementById("loginPassword").value;



const {
data,
error
}=

await supabaseClient.auth.signInWithPassword({

email,

password

});



if(error){

alert(error.message);

return;

}



currentUser=data.user;


loadProfile();


}





// ==========================
// GOALS
// ==========================


function chooseGoal(button){


button.classList.toggle(
"selected"
);


let value =
button.innerText;



if(selectedGoals.includes(value)){


selectedGoals =
selectedGoals.filter(
x=>x!==value
);


}

else{

selectedGoals.push(value);

}


}





// ==========================
// ENERGY
// ==========================


function chooseEnergy(button){


document
.querySelectorAll(".energy")
.forEach(btn=>{

btn.classList.remove(
"selected"
);

});



button.classList.add(
"selected"
);



selectedEnergy =
button.innerText;


}






// ==========================
// SAVE PROFILE
// ==========================

async function saveProfile(){


const {

data:{
user

}

}=

await supabaseClient.auth.getUser();



await supabaseClient

.from("profiles")

.update({

goals:selectedGoals,

energy:selectedEnergy,

future:
document
.getElementById("future")
.value


})

.eq(

"id",

user.id

);



openScreen("themes");


}








// ==========================
// THEMES
// ==========================


function setTheme(light,dark){


document.documentElement
.style.setProperty(
"--light",
light
);


document.documentElement
.style.setProperty(
"--dark",
dark
);



selectedTheme={

light,

dark

};


}




async function finishTheme(){


localStorage.setItem(
"theme",
JSON.stringify(selectedTheme)
);



loadProfile();


}





// ==========================
// LOAD PROFILE
// ==========================


async function loadProfile(){


const {

data:{
user

}

}=

await supabaseClient.auth.getUser();



if(!user)return;



currentUser=user;



const {

data

}=

await supabaseClient

.from("profiles")

.select("*")

.eq(
"id",
user.id
)

.single();



if(!data)return;



document
.getElementById("userName")
.innerText =
data.name;



document
.getElementById("profileName")
.innerText =
data.name;



document
.getElementById("profileGoals")
.innerText =
data.goals.join(", ");



document
.getElementById("profileEnergy")
.innerText =
data.energy;



document
.getElementById("userVision")
.innerText =
data.future;



openScreen("home");


generateAffirmation();


}






// ==========================
// AFFIRMATIONS
// ==========================


async function generateAffirmation(){


const {

data:{
user

}

}=

await supabaseClient.auth.getUser();



if(!user)return;



const {

data

}=

await supabaseClient

.from("profiles")

.select("*")

.eq(
"id",
user.id
)

.single();



let goal =
data.goals.join(", ");



let messages=[


`I am becoming the person who naturally achieves ${goal}.`,

`I trust my journey and my growth.`,

`I am disciplined enough to create my dream life.`,

`Everything I desire begins with the choices I make today.`,

`I am confident, worthy and capable.`

];



let text =
messages[
Math.floor(
Math.random()
*
messages.length
)
];



document
.getElementById("affirmation")
.innerText =
text;


}





async function saveAffirmation(){


const {

data:{
user

}

}=

await supabaseClient.auth.getUser();



let text =
document
.getElementById("affirmation")
.innerText;



await supabaseClient

.from("affirmations")

.insert({

user_id:user.id,

text:text

});


alert(
"Saved ❤️"
);


}






// ==========================
// JOURNAL
// ==========================


async function saveJournal(){


const {

data:{
user

}

}=

await supabaseClient.auth.getUser();



let text =
document
.getElementById("journalInput")
.value;



if(!text)return;



await supabaseClient

.from("journals")

.insert({

user_id:user.id,

content:text

});



document
.getElementById("journalInput")
.value="";



alert(
"Saved 📖"
);


}







// ==========================
// VISION BOARD
// ==========================


function uploadImage(event){


let file =
event.target.files[0];


let reader =
new FileReader();



reader.onload=function(e){


let img =
document.createElement("img");


img.src =
e.target.result;



document
.getElementById("visionGallery")
.appendChild(img);



};



reader.readAsDataURL(file);


}







// ==========================
// LOGOUT
// ==========================


async function logout(){


await supabaseClient.auth.signOut();


location.reload();


}





window.onload=function(){

loadProfile();

};
