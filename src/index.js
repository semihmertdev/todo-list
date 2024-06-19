import './styles.css';
import DOM from './modules/dom';

document.addEventListener('DOMContentLoaded', () => {
  const dom = new DOM();

  // Get the modal element
  const modal = document.getElementById('modal');

  // Get the close button (X)
  const closeButton = document.getElementsByClassName('close')[0];

  // When the user clicks the close button or anywhere outside the modal, close it
  closeButton.onclick = () => {
    dom.closeModal();
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      dom.closeModal();
    }
  };
});
