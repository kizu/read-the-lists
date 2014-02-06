var get_all_threads = function($threads) {
  var parsed_threads = [];
  $threads.each(function() {
      $thread = $(this);
      $messages = $thread.closest('li').find('a[href]');
      parsed_messages = []
      $messages.each(function() {
          $message = $(this);
          parsed_message = {
              'author': $message.next('a').text(),
              'title': $message.text(),
              'date': $message.siblings('em').text(),
              'link': $message.attr('href')
          };
          parsed_messages.push(parsed_message);
      });

      parsed_thread = {
          'title': $thread.text(),
          'messages': parsed_messages,
          'messages_count': parsed_messages.length
      };

      parsed_threads.push(parsed_thread);
  });
  return parsed_threads;
};

var get_post = function($post) {
  var parsed_post = {
      'title': $post.find('.head > h1').text(),
      'received': $post.find('.mail > #received').text().replace('Received on ', ''),
      'author': $post.find('.mail > .headers > #from').text(),
      'date': $post.find('.mail > .headers > #date').text().replace('Date: ', ''),
      'body': $post.find('.mail > pre').html(),
      'meta': 'Here would be a list of replies, so we could link them into thread'
  };
  return parsed_post;
};


var createCORSRequest = function(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // Most browsers.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // IE8 & IE9
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
};

var posts = createCORSRequest('GET', 'http://lists.w3.org/Archives/Public/www-style/2014Feb/thread.html');
posts.onload = function(result) {
  var response = result.srcElement.response.replace(/^[\s\S]+<body>/, '').replace(/<\/body>[\s\S]+$/, '')

  document.getElementById('cached').innerHTML = response;
  console.log('');
  console.log('');
  console.log('List of threads');
  console.log(get_all_threads($('#cached > .messages-list > ul > li > a[href]')));
};

posts.onerror = function() {
  // Error code goes here.
};

posts.send();



var post = createCORSRequest('GET', 'http://lists.w3.org/Archives/Public/www-style/2014Feb/0032.html');
post.onload = function(result) {
  var response = result.srcElement.response.replace(/^[\s\S]+<body>/, '').replace(/<\/body>[\s\S]+$/, '')

  document.getElementById('cached_message').innerHTML = response;
  console.log('');
  console.log('');
  console.log('Post');
  console.log(get_post($('#cached_message')));
};

post.onerror = function() {
  // Error code goes here.
};

post.send();
