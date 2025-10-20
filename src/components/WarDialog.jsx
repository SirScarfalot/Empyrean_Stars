"use client";

// This components handles the review dialog and uses a next.js feature known as Server Actions to handle the form submission

import { useEffect, useLayoutEffect, useRef } from "react";
import { handleWarFormSubmission } from "@/src/app/actions.js";

const WarDialog = ({
  isOpen,
  handleClose,
  id,
}) => {
  const dialog = useRef();

  // dialogs only render their backdrop when called with `showModal`
  useLayoutEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen, dialog]);

  const handleClick = (e) => {
    // close if clicked outside the modal
    if (e.target === dialog.current) {
      handleClose();
    }
  };

  return (
    <dialog ref={dialog} onMouseDown={handleClick}>
      <form
        action={handleWarFormSubmission}
        onSubmit={() => {
          handleClose();
        }}
      >
        <header>
          <h3>Go to war?</h3>
          <input type="hidden" name="starId" value={id} />
        </header>
        <footer>
          <menu>
            <button
              autoFocus
              type="reset"
              onClick={handleClose}
              className="button--cancel"
            >
              Cancel
            </button>
            <button type="submit" value="confirm" className="button--confirm">
              Confirm
            </button>
          </menu>
        </footer>
      </form>
    </dialog>
  );
};

export default WarDialog;