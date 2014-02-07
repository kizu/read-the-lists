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


window.data = {
  getPosts: function(params) {
    return this._get(
      'http://lists.w3.org/Archives/Public/www-style/' + params.month + '/thread.html',
      function() {
        return get_all_threads($('#cached > .messages-list > ul > li > a[href]'));
      }
    );
  },

  getPost: function(params) {
    return this._get(
      'http://lists.w3.org/Archives/Public/www-style/' + params.month + '/' + params['post-id'],
      function() {
        return get_post($('#cached'));
      }
    );
  },

  _get: function(url, parser) {
    var promise = new no.Promise();

    var xhr = createCORSRequest('GET', url);
    xhr.onload = function(result) {
      var response = result.srcElement.response.replace(/^[\s\S]+<body>/, '').replace(/<\/body>[\s\S]+$/, '');
      document.getElementById('cached').innerHTML = response;
      promise.resolve(parser());
    };

    xhr.onerror = function() {
      promise.reject();
    };

    xhr.send();
    return promise;
  }
};
