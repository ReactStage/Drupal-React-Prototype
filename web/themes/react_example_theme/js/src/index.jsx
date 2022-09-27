import React from 'react';
import ReactDOM from 'react-dom';
window.React1 = require('react');
import { hot } from 'react-hot-loader/root';
import NodeListOnly from "./components/NodeListOnly";
import NodeReadWrite from "./components/NodeReadWrite";

ReactDOM.render(<NodeReadWrite />, document.getElementById('react-app'));
