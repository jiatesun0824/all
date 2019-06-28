import lrz from 'lrz';
import toast from 'components/Toast';

function filterImageSize(size) {
  if ((size / (1024 * 1024)) >= 1) {
    toast('不能上传大于1M的图片！');
    return false;
  }
  return true;
}

export default async function(image) {
  if (Object.prototype.toString.call(image).indexOf('File') > -1) {
    return filterImageSize(image.size) ? {file: image, fileName: image.name} : false;
  };

  return lrz(image).then(rst => {
    return filterImageSize(rst.file.size) ? {file: rst.file, fileName: 'fileName.jpg'} : false;
  });
}
