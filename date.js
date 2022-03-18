// module.exports = getDate; //bound getDate function to this module
//
// function getDate(){
// let today = new Date();
//
// let options = {
//   weekday: "long",
//   day: "numeric",
//   month: "long"
// };
// return today.toLocaleDateString("en-US",options);
// }

module.exports.getDate = function(){
  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US",options);
}

module.exports.getDay = function(){
  const today = new Date();

  const options = {
    weekday: "long"
  };

  return today.toLocaleDateString("en-US",options);
}
