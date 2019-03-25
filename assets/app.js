// Initialize Firebase
var config = {
    apiKey: "AIzaSyDW7gvQ_jWkZDTGn_o4haPprIWKlGq4ZAg",
    authDomain: "train-scheduler-d6b28.firebaseapp.com",
    databaseURL: "https://train-scheduler-d6b28.firebaseio.com",
    projectId: "train-scheduler-d6b28",
    storageBucket: "train-scheduler-d6b28.appspot.com",
    messagingSenderId: "507546598954"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // ADD A TRAIN WHEN CLICKING SUBMIT
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainPlatform = $("#platform-input").val().trim();
    var trainFirst= $("#first-train-input").val().trim();
    var trainFrequency= $("#frequency-input").val().trim();

  // THIS STORES THE TRAINS
    var newTrain = {
      train: trainName,
      destination: trainDestination,
      platform: trainPlatform,
      firstTrain: trainFirst,
      frequency: trainFrequency
    };
  // THIS WILL UPLOAD A NEW TRAIN
  database.ref().push(newTrain);
  // console.log(newTrain);
  alert("Your train has been added!");

  // Clear fields so new train can be added  
  
  $("#train-input").val("")
  $("#destination-input").val("")
  $("#platform-input").val("")
  $("#first-train-input").val("")
  $("#frequency-input").val("")

  });

  // CALCULATES THE NEXT TRAIN TIME
function getTrainTime(t, f) {

  var now = moment();
  // console.log(now);
  // This next variable fixes the bug that happens with the blue Line
  var first = moment(t, "HH:mm").subtract(1, 'years');
  // console.log(first);

  
  if (moment(now).isBefore(first)) {
    return [first.format("HH:mm"), (first.diff(now, 'minutes'))];
  }

  while (moment(now).isAfter(first)) {
    first.add(f, 'm');
  } 

  return [first.format("HH:mm"), (first.diff(now, 'minutes'))];
};

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {


  var trainName = childSnapshot.val().train;
  var trainDestination = childSnapshot.val().destination;
  var trainPlatform = childSnapshot.val().platform;
  var trainFirst = childSnapshot.val().firstTrain;
  var trainFrequency = childSnapshot.val().frequency;

  var trainArrival = getTrainTime(trainFirst, trainFrequency)[0];
  var trainMinutesAway = getTrainTime(trainFirst, trainFrequency)[1];


  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainPlatform + "</td><td>" + trainFirst + "</td><td>" + trainFrequency + "</td><td>" + trainArrival + "</td><td>" + trainMinutesAway + "</td></tr>");

  
  });
//THIS FUNCTION SHOWS US THE CURRENT TIME
function timeNow(){
    var now = moment().format('HH:mm')
    $("#current-time").text(now)
}
timeNow();