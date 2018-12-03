import React, { Component } from 'react';
import './index.less';

/* eslint-disable */
class EncodingPane extends Component {
  render() {
    return (
      <div className="encoding-wrap">
        <h2>Encoding</h2>
        <div className="encoding-shelf-group">
          <div className="encoding-shelf">
            <div className="shelf-label">
              <span>X</span>
            </div>
            <span className="shelf-placeholder">Drop a field here</span>
          </div>
          <div className="encoding-shelf">
            <div className="shelf-label">
              <span>Y</span>
            </div>
            <span className="shelf-placeholder">Drop a field here</span>
          </div>
        </div>
        <div className="encoding-shelf-group">
          <h3>Mark</h3>
          <div className="encoding-shelf">
            <div className="shelf-label">
              <span>size</span>
            </div>
            <span className="shelf-placeholder">Drop a field here</span>
          </div>
          <div className="encoding-shelf">
            <div className="shelf-label">
              <span>color</span>
            </div>
            <span className="shelf-placeholder">Drop a field here</span>
          </div>
          <div className="encoding-shelf">
            <div className="shelf-label">
              <span>shape</span>
            </div>
            <span className="shelf-placeholder">Drop a field here</span>
          </div>
        </div>
      </div>
    );
  }
}

export default EncodingPane;
