import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.scss';
import Shell from './shell/Shell';


declare let module: any;

ReactDOM.render(
    (
        <Shell />
    ),
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
}