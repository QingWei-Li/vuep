var fs = require('fs')
var cssnano = require('cssnano').process
var resolve = require('path').resolve
var postcss = require('postcss')

var file = 'vuep.css'
var processor = postcss([require('postcss-salad')])

var save = function (file, content) {
  fs.writeFileSync(resolve(__dirname, '../dist/', file), content)
}
var load = function (file) {
  return fs.readFileSync(resolve(__dirname, '../src/style/', file)).toString()
}
var loadDist = function (file) {
  return fs.readFileSync(resolve(__dirname, '../dist/', file)).toString()
}

processor.process(load(file), { from: resolve(__dirname, '../src/style/', file) })
  .then(function (result) {
    save(file, result.css)
    console.log('salad - ' + file)
    cssnano(loadDist(file))
      .then(function (result) {
        save('vuep.min.css', result.css)
        console.log('cssnao - vuep.min.css')
      })
  }).catch(function (err) {
    console.log(err)
  })
