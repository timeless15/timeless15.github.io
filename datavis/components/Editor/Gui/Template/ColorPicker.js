/*
 * @Author: ruqichen
 * @Date: 2018-10-25 11:19:05
 * @Last Modified by: ruqichen
 * @Last Modified time: 2018-10-31 15:49:48
 * @Description: 颜色选择器组件
 */

import React, { Component } from 'react';
import { Input } from 'antd';
import reactCss from 'reactcss';
import { ChromePicker } from 'react-color';

function convertToRGBAstring(rgb) {
  let RGBA = rgb;
  if (Object.prototype.toString.call(rgb) === '[object Object]') {
    const {
      r,
      g,
      b,
      a = 1
    } = rgb;
    RGBA = `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return RGBA;
}

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false
    };
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    const { displayColorPicker } = this.state;
    this.setState({
      displayColorPicker: !displayColorPicker
    });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  handleChange(e) {
    const { prop, onConfigChange } = this.props;
    onConfigChange(prop, e.target.value);
  }

  handleColorChange(color) {
    const { prop, onConfigChange } = this.props;
    const clr = convertToRGBAstring(color.rgb);
    onConfigChange(prop, clr);
  }

  render() {
    const { color } = this.props;
    const { displayColorPicker } = this.state;
    const styles = reactCss({
      default: {
        color: {
          display: 'inline-block',
          position: 'absolute',
          width: '16px',
          height: '16px',
          top: '50%',
          left: '50%',
          marginLeft: '-8px',
          marginTop: '-8px',
          borderRadius: '2px',
          background: `${color}`
        },
        colorWrapper: {
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '17%',
          height: '100%'
        },
        swatch: {
          position: 'relative',
          borderRadius: '1px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px',
          backgroundColor: '#000f1b',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          top: '40x',
          zIndex: '9',
          right: '0'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });
    return (
      <div className="gui-color-picker">
        <div style={styles.swatch} onClick={this.handleClick} onKeyDown={this.handleClick}>
          <div className="gui-color-picker-left" style={styles.colorWrapper}>
            <span style={styles.color} />
          </div>
          <Input
            style={{
              width: '83%', height: '38px', marginLeft: '17%', border: 'none'
            }}
            value={color}
            onChange={this.handleChange}
          />
        </div>
        {
          displayColorPicker ? (
            <div style={styles.popover}>
              <div style={styles.cover} onClick={this.handleClose} onKeyDown={this.handleClose} />
              <ChromePicker color={color} onChangeComplete={this.handleColorChange} />
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default ColorPicker;
