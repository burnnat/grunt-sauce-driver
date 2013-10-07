var Harness = Siesta.Harness.Browser

Harness.configure({
    title     : 'Awesome Test Suite',
    autoCheckGlobals : true,

    // no files to preload
    preload : [
    ]
})


Harness.start(
    // plain strings - urls
    '010_basic_assertions.t.js',
    '020_async_code.t.js',
    
    // and object with `url` property and its own "preload" option
    {
        url : '030_global_variables.t.js',
        preload : [
            // Jquery CDN
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'
        ]
    },
    
    '040_todo_tests.t.js',

    '050_wait_for.t.js',

    '060_bdd.t.js'
)

