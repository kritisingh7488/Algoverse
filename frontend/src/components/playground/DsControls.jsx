import React, { useState } from 'react';
import { Plus, Trash2, Search, ArrowLeftRight, Eye, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export const DsControls = ({ structureKey, onExecuteOp, items = [] }) => {
  const [valInput, setValInput] = useState('');
  const [idxInput, setIdxInput] = useState('');

  const getVal = (opName) => {
    const parsed = parseInt(valInput);
    if (!isNaN(parsed)) return parsed;
    if (opName === 'search' && items && items.length > 0) {
      return items[Math.floor(Math.random() * items.length)];
    }
    return Math.floor(Math.random() * 90) + 10;
  };

  const getIdx = () => {
    if (!idxInput.trim()) return undefined;
    const parsed = parseInt(idxInput);
    return !isNaN(parsed) ? parsed : undefined;
  };

  const handleOp = (opName, customArgs = {}) => {
    const specifiedIdx = getIdx();
    onExecuteOp(opName, { val: getVal(opName), idx: specifiedIdx, ...customArgs });
    setValInput('');
    setIdxInput('');
  };

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-4 shadow-soft space-y-3 font-body">
      <div className="flex flex-wrap items-center gap-3">
        {/* Input Fields */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Val"
            value={valInput}
            onChange={(e) => setValInput(e.target.value)}
            className="w-20 px-3 py-2 rounded-input bg-surface border-2 border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary"
          />
          {structureKey === 'array' && (
            <input
              type="number"
              placeholder="Index"
              value={idxInput}
              onChange={(e) => setIdxInput(e.target.value)}
              className="w-24 px-3 py-2 rounded-input bg-surface border-2 border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary"
              title="Leave empty to insert/delete at Tail by default"
            />
          )}
        </div>

        {/* Dynamic Array Controls */}
        {structureKey === 'array' && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => handleOp('insert')}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Insert
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('delete')}>
              <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Delete
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('update')}>
              Update
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('reverse')}>
              Reverse
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('rotate', { dir: 'left' })}>
              ← Rot
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('rotate', { dir: 'right' })}>
              Rot →
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('sort')}>
              Sort
            </Button>
          </div>
        )}

        {/* Stack Controls */}
        {structureKey === 'stack' && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => handleOp('push')}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Push Top
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('pop')}>
              <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Pop Top
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('peek')}>
              <Eye className="w-3.5 h-3.5 mr-1" /> Peek Top
            </Button>
          </div>
        )}

        {/* Queue & Circular Queue Controls */}
        {(structureKey === 'queue' || structureKey === 'cqueue') && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => handleOp('enqueue')}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Enqueue
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('dequeue')}>
              <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Dequeue
            </Button>
          </div>
        )}

        {/* Linked Lists Controls */}
        {(structureKey === 'singlylist' || structureKey === 'doublylist' || structureKey === 'circularlist') && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => handleOp('insertHead')}>
              + Head
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('insertTail')}>
              + Tail
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('deleteHead')}>
              - Head
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('deleteTail')}>
              - Tail
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('reverse')}>
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1" /> Reverse
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('findMid')}>
              Find Mid
            </Button>
          </div>
        )}

        {/* Deque Controls */}
        {structureKey === 'deque' && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => handleOp('pushFront')}>
              + Front
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleOp('pushBack')}>
              + Back
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('popFront')}>
              - Front
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('popBack')}>
              - Back
            </Button>
          </div>
        )}

        {/* Priority Queue & Heap Controls */}
        {(structureKey === 'priorityqueue' || structureKey === 'minheap' || structureKey === 'maxheap') && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => handleOp('insert')}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Insert Node
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleOp('extract')}>
              <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Extract Root
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleOp('heapify')}>
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Heapify (Build Heap)
            </Button>
          </div>
        )}

        {/* Search Action */}
        <Button variant="outline" size="sm" onClick={() => handleOp('search')}>
          <Search className="w-3.5 h-3.5 mr-1" /> Search
        </Button>
        <Button variant="secondary" size="sm" onClick={() => handleOp('traverse')} title="Traverse all elements step by step">
          Traverse (Play)
        </Button>
      </div>
    </div>
  );
};

export default DsControls;
