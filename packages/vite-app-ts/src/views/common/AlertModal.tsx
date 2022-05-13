import React from 'react';
interface IAlertModal {
  openModal: boolean;
}

const AlertModal: React.FC<IAlertModal> = ({ openModal }) => {
  return (
    <div>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" checked={openModal} />
      <label htmlFor="my-modal-4" className=" cursor-pointer modal ">
        <label className="relative border-4 border-warning modal-box" htmlFor="">
          <h3 className="text-lg font-bold">Ooops server down!</h3>
          <p className="py-4">Look like backend server down to process transcactions :) </p>
          <p>contact maas-x team</p>
          <p>refresh page to check connection !!</p>
        </label>
      </label>
    </div>
  );
};
export default AlertModal;
