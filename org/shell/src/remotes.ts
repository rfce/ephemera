export const production = import.meta.env.PROD;

const loadPixels = async () => {
  if (production) {
    return import(/* @vite-ignore */ 'pixels-remote/PixelsApp');
  }

  return import('@pixels');
};

const loadCreatePixels = async () => {
  if (production) {
    return import(/* @vite-ignore */ 'create-pixels-remote/CreatePixelsApp');
  }

  return import('@profile');
};

const loadUpload = async () => {
  if (production) {
    return import(/* @vite-ignore */ 'profile/ProfileApp');
  }

  return import('@profile');
};

const loadView = async () => {
  if (production) {
    return import(/* @vite-ignore */ 'profile/ProfileApp');
  }

  return import('@profile');
};

export { loadPixels, loadCreatePixels, loadUpload, loadView };
