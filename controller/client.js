var React = require('react')
var hx = hyperx(React.createElement)
var t = require('tcomb-form')

var Type = require('./')

var App = React.createClass({

  onSubmit(evt) {
    evt.preventDefault()
    var v = this.refs.form.getValue()
    if (v) {
      console.log(v)
    }
  },

  render() {
    return hx`<form onSubmit=${this.onSubmit}>
      ${(t.form.Form, { ref: 'form', type: Type })}
      <div className="form-group">
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>`
  }
})
