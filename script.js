// var jcontent = {
//   firstName: "YIn",
//   secondName: "Mon",
// };

// var output = document.getElementById("output");
// output.innerHTML = jcontent.firstName;

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "selfreporting.json", true); //'data.json' is the relative path of the .json file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

(function () {
  loadJSON(function (response) {
    var actual_JSON = JSON.parse(response); //Now you can use the actual_JSON variable to build your table
    console.log(JSON.stringify(actual_JSON, null, 2));
  });
})();
