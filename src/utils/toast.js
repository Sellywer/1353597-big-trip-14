const SHOW_TIME = 3000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);
toastContainer.style.position = 'fixed';
toastContainer.style.top = '50%';
toastContainer.style.left = '50%';
toastContainer.style.transform = 'translate(-50%, -50%)';

export const toast = (message) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');
  toastItem.style.boxSizing = 'border-box';
  toastItem.style.width = '450px';
  toastItem.style.minHeight = '40px';
  toastItem.style.padding = '5px';
  toastItem.style.borderRadius = '20px';
  toastItem.style.fontSize = '25px';
  toastItem.style.textAlign = 'center';
  toastItem.style.backgroundColor = 'red';
  toastItem.style.color = 'white';
  toastItem.style.marginBottom = '20px';

  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};
