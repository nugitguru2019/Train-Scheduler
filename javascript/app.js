// Initialize Firebase
var config = {
  apiKey: "AIzaSyBXVzr3D5yjoBbNSuoLA7a1mt057b-AlSQ",
  authDomain: "thetrain2019.firebaseapp.com",
  databaseURL: "https://thetrain2019.firebaseio.com",
  projectId: "thetrain2019",
  storageBucket: "thetrain2019.appspot.com",
  messagingSenderId: "317333660802"
};
firebase.initializeApp(config);
//Reference database
const database = firebase.database();
$("#submit").on("click", function (event) {
  //Prevents submit from refreshing page
  event.preventDefault();
  //Captures Name of Train
  let train = $("#train-name").val().trim();
  //Captures destination of train
  let destination = $("#destination").val().trim();
  //Captures time of first train
  let firstTime = $("#first-train-time").val().trim();
  //Captures frequency of train
  let frequency = $("#frequency").val().trim();
  //Temporary object for the data
  let trainData = {
    trainName: train,
    trainDestination: destination,
    firstTrain: firstTime,
    trainFrequency: frequency,
  };
  //Adding the data to firebase
  database.ref("/train-data").push(trainData);
  //Clears the texboxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");
});
/* Trying to loop through firebase with these 
let query = database.ref("train-data").orderByKey();
query.once("child_added").then
snapshot.forEach(function (childSnapshot) {
    let key = childSnapshot.key;
    let childData = childSnapshot.val();
/*Function that runs whenever database values change
and adds new table row with calculated data*/
//Interval that runs every second checking for database changes, updates every minute as calculations change
let snapshotInterval = setInterval(function () {
  //Clears the table of duplicates before reappending them below each time the snapshot runs
  $(".tables-body").empty();
      /*Function that runs whenever database a child is added to train-data directory in firebase 
      and adds new table row with calculated data*/
      database.ref("/train-data").on("child_added", function(snapshot) {
          //Captures the snapshotted data in variables again
          let trainName = snapshot.val().trainName;
          let trainDestination = snapshot.val().trainDestination;
          let firstTrain = snapshot.val().firstTrain;
          let trainFrequency = snapshot.val().trainFrequency;
          //Converts the time so it comes before current time
          let timeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
          //Captures current time in a variable
          let currentTime = moment();
          //Calculates the difference between current time and first train time
          let timeDiff = currentTime.diff(moment(timeConverted), "minutes");
          //Calculates time between trains
          let tRemaining = timeDiff % trainFrequency;
          //Calculates minutes until next train
          let tMinutesTillTrain = trainFrequency - tRemaining;
          //Calculates time of next train
          let nextTrain = currentTime.add(tMinutesTillTrain, "minutes").format("hh:mm");
          //Creates the new table row for the calculated data
          let newRow = $("<tr>");
          //Creating table data with trainName variable
          let tName = $("<td>").text(trainName);
          //Attaching scope of "row" for bootstrap styling
          tName.attr("scope", "row");
          //Creates table data for trainDestination variable
          let tDestination = $("<td>").text(trainDestination);
          //Creates table data for trainFrequency variable
          let tFrequency = $("<td>").text(trainFrequency);
          //Creates table data for nextTrain variable
          let nextArrival = $("<td>").text(nextTrain);
          //Creates table data for tMinutesTillTrain variable
          let minutesAway = $("<td>").text(tMinutesTillTrain);
          //Appends the new <td> tags to the newRow variable
          newRow.append(tName);
          newRow.append(tDestination);
          newRow.append(tFrequency);
          newRow.append(nextArrival);
          newRow.append(minutesAway);
          //Appends the newRow with all the data inside to the table body.
          $(".tables-body").append(newRow);
        })
        //Runs the snapshot every second
      }, 1000);