export const production = import.meta.env.PROD;

const loadPixels = async () => {
  if (production) {
    return import(/* @vite-ignore */ 'pixels/PixelsApp');
  }

  return import('@pixels');
};

const loadCreatePixels = async () => {
  if (production) {
    return import(/* @vite-ignore */ 'create-pixels/CreatePixelsApp');
  }

  return import('@create-pixels');
};

const loadUpload = async () => {
  if (production) {
    return import(/* @vite-ignore */ 'upload/UploadApp');
  }

  return import('@upload');
};

const loadView = async () => {
  if (production) {
    return import(/* @vite-ignore */ 'view/ViewApp');
  }

  return import('@view');
};

export { loadPixels, loadCreatePixels, loadUpload, loadView };
