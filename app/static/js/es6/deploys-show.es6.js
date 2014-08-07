(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $.ajax({
      url: '/deploy/restartProxy',
      type: 'GET',
      success: ()=>{}
    });
  }
})();
