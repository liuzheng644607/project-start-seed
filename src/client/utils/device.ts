class Device {
  getBrowserScreen() {
    return new Promise<MediaStream>((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({
          audio: false,
          video: true,
        }).then((stream: MediaStream) => {
          resolve(stream);
        }).catch((err: Error) => {
          reject(err);
        });
      } else {
        reject(new Error('您的浏览器不支持分享屏幕'));
      }
    });
  }

  getUserMedia(opt: MediaStreamConstraints = {}) {
    return new Promise<MediaStream>((resolve, reject) => {
      const getUserMedia =
        window.navigator.getUserMedia ||
        window.navigator.webkitGetUserMedia ||
        window.navigator.mozGetUserMedia ||
        window.navigator.msGetUserMedia;
      if (!getUserMedia) {
        if (navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia(opt).then((stream) => {
            resolve(stream);
          }).catch((err) => {
            reject(err);
          });
          return;
        }
        return reject(new Error('您的浏览器不支持getUserMedia'));
      }
      getUserMedia.bind(navigator)(opt, (stream) => {
          resolve(stream);
        },
        reject
      );
    });
  }

  getScreenStream() {
    return this.getBrowserScreen();
  }
}

export default new Device();
