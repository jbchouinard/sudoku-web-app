import React from 'react';

function ModalWelcome({modalState, modalHandler}) {
    const cancelHandler = () => modalHandler('cancel');
    const showPasteHandler = () => modalHandler('show-paste-modal');
    return (
        <div className="modal no-initial-digits">
            <h1>Welcome to SudokuExchange</h1>
            <p>You can get started by entering a new puzzle into a blank grid:</p>
            <p style={{textAlign: 'center'}}><button className="primary new-puzzle" onClick={cancelHandler}>Enter a new puzzle</button></p>
            <p style={{textAlign: 'center'}}><button className="primary new-puzzle" onClick={showPasteHandler}>Paste a new puzzle</button></p>
        </div>
    );
}

export default ModalWelcome;
