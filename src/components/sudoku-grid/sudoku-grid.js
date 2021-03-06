import React, { useState, useMemo } from 'react';

import './sudoku-grid.css';

import { SETTINGS } from '../../lib/sudoku-model.js';

import calculateGridDimensions from './grid-dimensions';

import SudokuCellPaused from './sudoku-cell-paused';
import SudokuCellBackground from './sudoku-cell-background';
import SudokuCellPencilMarks from './sudoku-cell-pencil-marks';
import SudokuCellDigit from './sudoku-cell-digit';
import SudokuCellCover from './sudoku-cell-cover';

import GridLines from './grid-lines.js';


function layerCellBackgrounds (cells, cellSize, dim, matchDigit, showPencilmarks) {
    return cells.map((cell, i) => {
        const cellDim = dim.cell[i];
        return (
            <SudokuCellBackground key={`bg${i}`}
                cell={cell}
                dim={cellDim}
                cellSize={cellSize}
                matchDigit={matchDigit}
                showPencilmarks={showPencilmarks}
            />
        );
    });
}

function layerCellPencilMarks (cells, cellSize, dim, outerPencilOffsets) {
    return cells.map((cell, i) => {
        const cellDim = dim.cell[i];
        return <SudokuCellPencilMarks key={`pm${i}`}
            cell={cell}
            dim={cellDim}
            cellSize={cellSize}
            outerPencilOffsets={outerPencilOffsets}
        />;
    });
}

function layerCellDigits (cells, cellSize, dim) {
    return cells.map((cell, i) => {
        const cellDim = dim.cell[i];
        return <SudokuCellDigit key={`dig${i}`} cell={cell} dim={cellDim} cellSize={cellSize} />;
    });
}

function layerCellCovers (cells, cellSize, dim, mouseDownHandler, mouseOverHandler) {
    return cells.map((cell, i) => {
        const cellDim = dim.cell[i];
        return <SudokuCellCover key={`cov${i}`}
            cell={cell}
            dim={cellDim}
            cellSize={cellSize}
            mouseDownHandler={mouseDownHandler}
            mouseOverHandler={mouseOverHandler}
        />;
    });
}

function layerCellPaused (cells, cellSize, dim) {
    return cells.map((cell, i) => {
        const cellDim = dim.cell[i];
        return <SudokuCellPaused key={`pau${i}`} cell={cell} dim={cellDim} />;
    });
}

function cellContentLayers(cells, cellSize, dim, matchDigit, showPencilmarks) {
    const backgrounds = layerCellBackgrounds(cells, cellSize, dim, matchDigit, showPencilmarks);
    const pencilMarks = showPencilmarks ? layerCellPencilMarks(cells, cellSize, dim, dim.outerPencilOffsets) : [];
    const digits      = layerCellDigits(cells, cellSize, dim);
    return <>
        {backgrounds}
        {pencilMarks}
        {digits}
    </>;
}

function indexFromTouchEvent (e) {
    const t = (e.touches || {})[0];
    if (t) {
        let index = t.target.dataset.cellIndex;
        if (t.pageX) {
            const el = document.elementFromPoint(t.pageX, t.pageY);
            if (el && el !== t.target) {
                index = el.dataset.cellIndex;
            }
        }
        if (index !== undefined) {
            return parseInt(index, 10);
        }
    }
    return;
}

function useCellTouch (inputHandler) {
    const [lastCellTouched, setLastCellTouched] = useState(false);
    return (e) => {
        e.preventDefault();
        e.stopPropagation();
        const eventType = e.type;
        if (eventType === 'touchend') {
            setLastCellTouched(undefined);
            return
        }
        const cellIndex = indexFromTouchEvent(e);
        if (cellIndex !== undefined && cellIndex !== lastCellTouched) {
            if (eventType === 'touchstart') {
                inputHandler({type: 'cellTouched', cellIndex, value: cellIndex, source: 'touch'});
            }
            else if (eventType === 'touchmove') {
                inputHandler({type: 'cellSwipedTo', cellIndex, value: cellIndex, source: 'touch'});
            }
            setLastCellTouched(cellIndex);
            // console.log(`${eventType} event on cell #${cellIndex}`);
        }
    };
}


function SudokuGrid({grid, gridId, dimensions, isPaused, mouseDownHandler, mouseOverHandler, inputHandler}) {
    const cellSize = 100;
    const marginSize = 50;
    const dim = useMemo(() => calculateGridDimensions(cellSize, marginSize), [cellSize, marginSize]);
    const settings = grid.get('settings');
    const highlightMatches = settings[SETTINGS.highlightMatches];
    const showPencilmarks = grid.get('showPencilmarks');
    const matchDigit = highlightMatches ? grid.get('matchDigit') : undefined;
    const rawTouchHandler = useCellTouch(inputHandler);
    const cells = grid.get('cells').toArray();
    const cellContents = isPaused
        ? layerCellPaused(cells, cellSize, dim)
        : cellContentLayers(cells, cellSize, dim, matchDigit, showPencilmarks);
    const cellCovers = layerCellCovers(cells, cellSize, dim, mouseDownHandler, mouseOverHandler);
    return (
        <div className="sudoku-grid"
            id={gridId || null}
            onTouchStart={rawTouchHandler}
            onTouchEnd={rawTouchHandler}
            onTouchMove={rawTouchHandler}
        >
            <svg version="1.1"
                style={{width: dimensions.gridLength}}
                viewBox={`0 0 ${dim.width} ${dim.height}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect className="grid-bg" width="100%" height="100%" />
                {cellContents}
                <GridLines cellSize={dim.cellSize} marginSize={dim.marginSize} />
                {cellCovers}
            </svg>
        </div>
    );
}

export default SudokuGrid;
