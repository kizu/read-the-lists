var _nsPageGo = ns.page.go;

ns.page.go = function(url) {
    var promise = new no.Promise();
    var args = arguments;

    var page = ns.router(url || ns.page.getCurrentUrl());

    if (page.page === 'month') {
        var postsModel = ns.Model.get('posts', page.params);
        if (postsModel.isValid()) {
            _nsPageGo.apply(ns.page, args).pipe(promise);
        } else {
            window.data.getPosts(page.params).done(function(posts) {
                postsModel.setData({ item: posts });
                _nsPageGo.apply(ns.page, args).pipe(promise);
            });
        }
    } else if (page.page === 'post') {
        var postModel = ns.Model.get('post', page.params);
        if (postModel.isValid()) {
            _nsPageGo.apply(ns.page, args).pipe(promise);
        } else {
            window.data.getPost(page.params).done(function(post) {
                postModel.setData(post);
                _nsPageGo.apply(ns.page, args).pipe(promise);
            });
        }
    } else {
        _nsPageGo.apply(ns.page, args).pipe(promise);
    }

    return promise;
};

// ----------------------------------------------------------------------------------------------------------------- //

/// Routing

ns.router.regexps['post-id'] = '[a-z0-9.]+';
ns.router.regexps['month'] = '\\d{4}[A-Za-z]{3}'; // !!! зачем-то нужен двойной искейпинг, это баг!

ns.router.routes = {
    route: {
        '/{month:month}/{post-id:post-id}': 'post',
        '/{month:month}': 'month',
        '/': 'index'
    }
};

/// Layouts

ns.layout.define('app', {
    'app': {
        'content@': {}
    }
});

ns.layout.define('index', {
    'app content@': 'index'
}, 'app');

ns.layout.define('month', {
    'app content@': 'posts'
}, 'app');

ns.layout.define('post', {
    'app content@': 'post'
}, 'app');

/// Models

ns.Model.define('posts', {
    params: {
        'month': null
    }
});

ns.Model.define('post', {
    params: {
        'month': null,
        'post-id': null
    }
});

/// Views

ns.View.define('app');

ns.View.define('index');

ns.View.define('posts', {
    models: [ 'posts' ]
});

ns.View.define('post', {
    models: [ 'post' ]
});

/// APP

var app = {};

app.init = function() {
    // Поскольку проект может лежать где угодно на файловой системе - инициализируем baseDir руками.
    // NOTE тут предполагается, что мы всегда попадаем на приложение через index страницу.
    ns.router.baseDir = location.pathname.substr(0, location.pathname.length - 1);

    ns.init();
    ns.page.go();
};

$(function() {
    app.init();
});
