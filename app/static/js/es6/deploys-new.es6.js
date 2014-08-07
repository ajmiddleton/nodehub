/* jshint unused:false */
/* global io */
(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#inputName').change(checkDomain);
    $('#new').submit(submitStatus);
    initializeSocketIo();
  }

  var socket;

  function initializeSocketIo(){
    socket = io.connect('/app');
    socket.on('deployed', deployed);
  }

  function deployed(data){
    console.log('DEPLOY SUCCESSFUL');
    console.log(data);
    window.location.replace(`http://nodehub.ajmiddleton.net/deploy/${data._id}/show`);
  }

  function submitStatus(event){
    if($('#inputName').parent().hasClass('has-success')){
      $('#loading').show();
      $('#submit').hide();
      var form = $(this).serializeArray();
      var obj = {};
      form.forEach(o=>{
        obj[o.name] = o.value;
      });
      console.log(obj);
      socket.emit('deploy', obj);
      // $.ajax({
      //   url: '/deploy',
      //   type: 'POST',
      //   data: form,
      //   dataType: 'json',
      //   timeout: 600000,
      //   error: (jqXHR, textStatus, err)=>{
      //     console.log(jqXHR);
      //     console.log('AJAX TEXTSTATUS======');
      //     console.log(textStatus);
      //     console.log('AJAX ERROR==========');
      //     console.log(err);
      //   },
      //   success: res=>{
      //     console.log('INSIDE SUCCESS');
      //     console.log(res.html);
      //     $(window).html(res.html);
      //   }
      // });
    }
    event.preventDefault();
  }

  function checkDomain(){
    var subdomain = $('#inputName').val();
    $.ajax({
      type: 'GET',
      url: `/deploy/${subdomain}/check`,
      data: {},
      success: res=>{
        $('#inputName').parent().removeClass('has-success');
        $('#inputName').parent().removeClass('has-error');
        if(res.status){
          $('#inputName').parent().addClass('has-success');
          $('#status').text('Subdomain available!');
        }else{
          $('#inputName').parent().addClass('has-error');
          $('#status').text('Subdomain taken :(');
        }
      },
      dataType: 'json'
    });
  }

})();
