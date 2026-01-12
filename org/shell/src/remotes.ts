export const production = import.meta.env.PROD;

const loadPixels = async () => {
  return import(/* @vite-ignore */ 'pixels/PixelsApp');
};

const loadCreatePixels = async () => {
  return import(/* @vite-ignore */ 'create-pixels/CreatePixelsApp');
};

const loadUpload = async () => {
  return import(/* @vite-ignore */ 'upload/UploadApp');
};

const loadView = async () => {
  return import(/* @vite-ignore */ 'view/ViewApp');
};

export { loadPixels, loadCreatePixels, loadUpload, loadView };
