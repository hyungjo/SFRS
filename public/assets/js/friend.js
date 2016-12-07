function showFriendTable(){
  alert('friend List');
  var friendData;

  $.ajax({
    url: "/friend/read",
    method: "get",
    async: false,
    success: function(result){
      friendData = result;
    },error: function(err){
      alert(err);
      console.log(err);
    }
  });

  for(var i = 0; i < friendData.length; i++){
    $.ajax({
      url: "/interest/compare/" + friendData[i].username,
      method: "get",
      async: false,
      success: function(result){
        friendData[i].interestSimilarity = result.sim.toFixed(2) * 100;
      },error: function(err){
          console.log(err);
      }
    });
  }

  for(var i = 0; i < friendData.length; i++){
    $.ajax({
      url: "/friend/read/" + friendData[i].username,
      method: "get",
      async: false,
      success: function(result){
        friendData[i].isFriend = result.status;
      },error: function(err){
          console.log(err);
      }
    });
  }

  for(var i = 0; i < friendData.length; i++){
    $.ajax({
      url: "/user/activity/compare/" + friendData[i].username,
      method: "get",
      async: false,
      success: function(result){
        friendData[i].activitySimilarity = result.score;
      },error: function(err){
          console.log(err);
      }
    });
  }

  for(var i = 0; i < friendData.length; i++){
    $.ajax({
      url: "/posting/count/" + friendData[i].username,
      method: "get",
      async: false,
      success: function(result){
        friendData[i].postingCount = result.count;
      },error: function(err){
          console.log(err);
      }
    });
  }

  for(var i = 0; i < friendData.length; i++){
    friendData[i].totalSimilarity =
              (friendData[i].interestSimilarity) * 0.6 +
              (friendData[i].activitySimilarity * 100) * 0.4;
  }

  $('#friendTable').bootstrapTable({
    data: friendData
  });
}
