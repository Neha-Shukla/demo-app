import closeIcon from "../../assets/closeIcon.png";

function GeneralModal({ title, message, setShow }) {
  const closeModal = () => {
    setShow(false);
  };

  return (
    <div>
      <section className="x-nft-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div>
              <div onClick={closeModal} className="modal-close">
                <img src={closeIcon} alt="icon" className="cursor-pointer" />
                <h1 className="text-theme text-center font-weight-bold">
                  {title}
                </h1>
              </div>
              <div>
                <div className="text-muted text-center ln-2 mt-3">
                  {message}
                </div>
              </div>
              <br />
              <div className="text-center">
                <button onClick={closeModal} className="btn btn-warning">
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GeneralModal;
