/*
 * @Author: Shiqi Han
 * @Date: 2018-10-22 11:53:32
 * @Last Modified by: Shiqi Han
 * @Last Modified time: 2018-11-21 17:34:13
 */
import React, { Component } from 'react';
import {
  Input,
  Icon,
  Modal,
  message
} from 'antd';
import reactCss from 'reactcss';

/**
  * 直接将图片转换为base64
  * @param  {Object} file 上传的图片
  * @param  {Function} callback 回调函数
  */
function directToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

/**
   * 压缩图片并转成base64
   * @param  {Object} file 上传的图片
   * @param  {Object} obj 自定义配置
   * @param  {Function} callback 回调函数
   */
function compress(file, obj, callback) {
  // lrz(file)
  //   .then(function(rst){

  //     console.log(rst);
  //   })
  //   .catch(function(err){

  //   })
  if (typeof FileReader === 'undefined') {
    message.error('浏览器不支持FileReader', 2);
    directToBase64(file, callback);
  } else {
    try {
      const img = document.createElement('img');
      const reader = new FileReader();
      reader.onload = function readerload() {
        img.onload = function imgload() {
          window.URL.revokeObjectURL(this.src);
          const that = this;
          let w = that.width;
          let h = that.height;
          const scale = w / h;
          let q = 0.7;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let base64 = '';
          w = obj.width || w;
          h = obj.height || (w / scale);
          canvas.width = w;
          canvas.height = h;

          ctx.drawImage(this, 0, 0, w, h);
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            q = obj.quality;
          }
          base64 = canvas.toDataURL('image/jpeg', q);
          callback(base64);
        };
        img.src = window.URL.createObjectURL(file);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      message.error('图片压缩出错', 2);
      directToBase64(file, callback);
    }
  }
}

class Image extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      deleteDisplay: false
    };
    this.handleMouseEvent = this.handleMouseEvent.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
  }


  /** 鼠标移动事件 */
  handleMouseEvent(e) {
    e.preventDefault();
    const { imgSrc } = this.props;
    if (imgSrc && e.type === 'mouseenter') {
      this.setState({
        deleteDisplay: true
      });
    } else {
      this.setState({
        deleteDisplay: false
      });
    }
  }

  /** 删除本地上传或url访问的图片 */
  handleDeleteClick() {
    const { input } = this.fileInput.current;
    const { prop } = this.props;
    const self = this;
    Modal.confirm({
      title: '是否删除图片？',
      onOk() {
        input.value = '';
        self.setState({
          delete: false
        });
        self.props.onConfigChange(prop, '');
      },
      okText: '确定',
      onCancel() {
      },
      cancelText: '取消'
    });
  }

  /** 编辑url文本框 */
  handleUrlChange(e) {
    const { prop, onConfigChange } = this.props;
    onConfigChange(prop, e.target.value);
  }

  /**  将上传图片转成base64 */
  handleUploadImage() {
    const { input } = this.fileInput.current;
    const file = input.files[0];
    const { prop } = this.props;
    const self = this;
    if (!/image\/\w+/.test(file.type)) {
      message.warning('请确保文件为图像类型', 2);
      return false;
    }
    if ((file.size / 1024) > 1024) {
      message.warning('请上传小于1M的图片', 2);
      return false;
    }
    compress(file, {}, (imgBase64) => {
      self.props.onConfigChange(prop, imgBase64);
    });
    return true;
  }

  render() {
    const { imgSrc } = this.props;
    const styles = reactCss({
      default: {
        imageWrap: {
          position: 'relative'
        },
        urlInput: {
          width: '100%',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #405171'
        },
        urlIcon: {
          display: 'inline-block',
          paddingLeft: '8px',
          fontSize: '12px',
          paddingRight: '8px'
        },
        urlText: {
          height: '26px',
          border: 'none',
          boxShadow: 'none',
          paddingLeft: '8px'
        },
        fileInput: {
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid #405171',
          width: '100%',
          height: '124px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        uploadWrap: {
          display: imgSrc ? 'none' : 'block'
        },
        uploadIcon: {
          marginTop: '10px',
          fontSize: '36px',
          display: 'flex',
          justifyContent: 'center'
        },
        uploadSpan: {
          textAlign: 'center',
          maxHeight: '32px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        input: {
          position: 'absolute',
          left: '0',
          top: '0',
          opacity: '0',
          height: '100%',
          width: '100%',
          padding: '0px',
          border: '0px',
          cursor: 'pointer'
        },
        img: {
          maxWidth: '150px',
          maxHeight: '100px',
          display: imgSrc ? 'block' : 'none'
        },
        deleteCover: {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: '#d9d9d9',
          display: 'none'
        }
      },
      deleteDisplay: {
        deleteCover: {
          display: 'flex'
        }
      }
    }, this.state);

    return (
      <div style={styles.imageWrap}>
        <div style={styles.urlInput}>
          <Icon style={styles.urlIcon} type="link" theme="outlined" />
          <Input style={styles.urlText} type="text" value={imgSrc} onChange={this.handleUrlChange} />
        </div>
        <div
          style={styles.fileInput}
          onMouseEnter={this.handleMouseEvent}
          onMouseLeave={this.handleMouseEvent}
        >
          <div style={styles.uploadWrap}>
            <div style={styles.uploadIcon}>
              <Icon type="picture" theme="outlined" placeholder="请输入图片地址" />
            </div>
            <span style={styles.uploadSpan}>点击或拖拽上传文件</span>
          </div>
          <img style={styles.img} src={imgSrc} alt="图片" />
          <Input style={styles.input} ref={this.fileInput} type="file" accept="image/*" onChange={this.handleUploadImage} />
          <div
            style={styles.deleteCover}
            onClick={this.handleDeleteClick}
            onKeyDown={this.handleDeleteClick}
          >
            <Icon type="delete" theme="outlined" />
          </div>
        </div>
      </div>
    );
  }
}

export default Image;
