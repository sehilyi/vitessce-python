import { DOMWidgetView, DOMWidgetModel } from '@jupyter-widgets/base';
import React from 'react';
import ReactDOM from 'react-dom';
import extend from 'lodash/extend';
import { Vitessce } from 'vitessce';
import 'vitessce/dist/es/production/static/css/index.css';
import './widget.css';

// See widget.py for the kernel counterpart to this file.

class VitessceWidget extends React.Component {

    constructor(props) {
      super(props);

      const { model } = props;

      const initialConfig = model.get('config');

      this.state = {
        config: initialConfig
      };

      this.onConfigChange = this.onConfigChange.bind(this);
    }

    componentDidUpdate() {
      console.log("componentDidUpdate")
    }

    onConfigChange(config) {
      //this.setState({ config });
      const { model } = this.props;
      model.set('config', config);
      model.save_changes();
    }

    render() {
      const { onConfigChange } = this;
      const { config } = this.state;
      return React.createElement('div', { },
          React.createElement(Vitessce, { config, onConfigChange, height: 500, theme: 'dark' })
      );
    }
}

// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export const VitessceModel = DOMWidgetModel.extend({
    defaults: extend(DOMWidgetModel.prototype.defaults(), {
        _model_name : 'VitessceModel',
        _view_name : 'VitessceView',
        _model_module : 'vitessce-jupyter',
        _view_module : 'vitessce-jupyter',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        config : {},
    })
});

export class VitessceView extends DOMWidgetView {
    render() {
        super.render();
        ReactDOM.render(
            this._render(this.model, this),
            this.el,
        );
    }

    _render(model, view) {
        return React.createElement(VitessceWidget, { model, view });
    }
}