import React, { useState, useEffect, useRef, useCallback } from 'react'
import { TextContent } from '../types'
import './TypingPractice.css'

interface TypingPracticeProps {
  textContent: TextContent
  onBack: () => void
}

const TypingPractice: React.FC<TypingPracticeProps> = ({ textContent, onBack }) => {
  const [currentPosition, setCurrentPosition] = useState(0)
  const [typedMap, setTypedMap] = useState<Map<number, string>>(new Map())
  const [isStarted, setIsStarted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  
  const textDisplayRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const hiddenInputRef = useRef<HTMLDivElement>(null)
  const charPositionsRef = useRef<Map<number, { left: number; top: number }>>(new Map())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isComposingRef = useRef(false)
  const compositionBufferRef = useRef('')

  const VERTICAL_ADJUST_PX = 8
  const TYPED_CHAR_ADJUST_PX = -2

  const updateCharPositions = useCallback(() => {
    if (!textDisplayRef.current) return
    const charPositions = new Map<number, { left: number; top: number }>()
    const chars = textDisplayRef.current.querySelectorAll('.remaining-char')
    chars.forEach((char, index) => {
      const rect = (char as HTMLElement).getBoundingClientRect()
      const containerRect = textDisplayRef.current!.getBoundingClientRect()
      charPositions.set(index, {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top
      })
    })
    charPositionsRef.current = charPositions
  }, [])

  useEffect(() => {
    if (isStarted && startTime > 0) {
      intervalRef.current = setInterval(() => {
        const timeElapsed = Date.now() - startTime
        const minutes = timeElapsed / 60000
        if (minutes > 0) setWpm(Math.round(typedMap.size / minutes))
        const totalTyped = typedMap.size
        const errorCount = Array.from(typedMap.entries()).filter(([idx, ch]) => ch !== textContent.content[idx]).length
        setErrors(errorCount)
        if (totalTyped > 0) setAccuracy(Math.round(((totalTyped - errorCount) / totalTyped) * 100))
      }, 120)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isStarted, startTime, typedMap, textContent.content])

  useEffect(() => { hiddenInputRef.current?.focus() }, [])

  useEffect(() => {
    const onResize = () => updateCharPositions()
    const onScroll = () => updateCharPositions()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [updateCharPositions])

  const processInput = useCallback((text: string) => {
    if (!text) return
    if (!isStarted) { setIsStarted(true); setStartTime(Date.now()) }

    let pos = currentPosition
    const next = new Map(typedMap)

    for (const rawCh of text) {
      if (pos >= textContent.content.length) break
      const srcCh = textContent.content[pos]
      const ch = rawCh === '\r' ? '' : rawCh
      if (!ch) continue
      // 仅当空白与原文匹配时才接受
      if (ch === ' ' || ch === '\n' || ch === '\t') {
        if (srcCh !== ch) {
          // 跳过与原文不一致的空白输入
          continue
        }
      }
      next.set(pos, ch)
      pos += 1
    }

    setTypedMap(next)
    setCurrentPosition(pos)
    setTimeout(updateCharPositions, 0)
  }, [currentPosition, isStarted, textContent.content.length, typedMap, updateCharPositions, textContent.content])

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true
    compositionBufferRef.current = ''
    if (hiddenInputRef.current) hiddenInputRef.current.textContent = ''
  }, [])

  const handleCompositionUpdate = useCallback((e: React.CompositionEvent<HTMLDivElement>) => {
    compositionBufferRef.current = e.data
    if (hiddenInputRef.current) hiddenInputRef.current.textContent = ''
  }, [])

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLDivElement>) => {
    isComposingRef.current = false
    if (e.data && e.data.trim() !== '') {
      setTimeout(() => {
        processInput(e.data)
        if (hiddenInputRef.current) hiddenInputRef.current.textContent = ''
      }, 10)
    }
    compositionBufferRef.current = ''
  }, [processInput])

  const handleBeforeInput = useCallback((e: React.FormEvent<HTMLDivElement> & { nativeEvent: InputEvent }) => {
    const ne = e.nativeEvent
    const { inputType, data } = ne
    if (isComposingRef.current) { e.preventDefault(); return }
    if (inputType && inputType.startsWith('insert')) {
      e.preventDefault()
      if (inputType === 'insertFromPaste' && (ne as any).clipboardData) {
        const pasted = (ne as any).clipboardData.getData('text/plain')
        if (pasted) processInput(pasted)
      } else if (inputType === 'insertParagraph') {
        // 仅当原文当前位置是换行才接受回车
        const srcCh = textContent.content[currentPosition]
        if (srcCh === '\n') processInput('\n')
      } else if (typeof data === 'string' && data.length > 0) {
        // 过滤空白：仅当原文匹配时允许
        const srcCh = textContent.content[currentPosition]
        const d = data === '\r' ? '' : data
        if (!d) return
        if (d === ' ' || d === '\n' || d === '\t') {
          if (srcCh !== d) return
        }
        processInput(d)
      }
      if (hiddenInputRef.current) hiddenInputRef.current.textContent = ''
    }
  }, [processInput, currentPosition, textContent.content])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (isComposingRef.current) return
    const target = e.target as HTMLDivElement
    const text = target.textContent || ''
    if (text) {
      processInput(text)
      target.textContent = ''
    }
  }, [processInput])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isComposingRef.current) {
      if (e.key === 'Backspace') return
      e.preventDefault(); return
    }
    if (e.key === 'Backspace') { e.preventDefault(); if (currentPosition > 0) { const np = currentPosition - 1; const next = new Map(typedMap); next.delete(np); setTypedMap(next); setCurrentPosition(np); setTimeout(updateCharPositions, 0) } return }
    if (e.key === 'Delete') { e.preventDefault(); if (currentPosition < textContent.content.length) { const next = new Map(typedMap); next.delete(currentPosition); setTypedMap(next); setTimeout(updateCharPositions, 0) } return }
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (currentPosition > 0) setCurrentPosition(p => p - 1); return }
    if (e.key === 'ArrowRight') { e.preventDefault(); if (currentPosition < textContent.content.length) setCurrentPosition(p => p + 1); return }
    if (e.key === 'Home') { e.preventDefault(); setCurrentPosition(0); return }
    if (e.key === 'End') { e.preventDefault(); setCurrentPosition(textContent.content.length); return }
  }, [currentPosition, textContent.content.length, typedMap, updateCharPositions])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('remaining-char')) {
      const index = parseInt(target.getAttribute('data-index') || '0')
      setCurrentPosition(index)
    }
    hiddenInputRef.current?.focus()
  }, [])

  const getDisplayText = useCallback(() => {
    const { content } = textContent
    const charPositions = charPositionsRef.current
    let html = ''
    let overlayHtml = ''
    for (let i = 0; i < content.length; i++) {
      const ch = content[i]
      const hasTyped = typedMap.has(i)
      const typedChar = hasTyped ? typedMap.get(i)! : null
      const isError = hasTyped && typedChar !== content[i]
      const visibilityStyle = hasTyped ? 'visibility: hidden;' : ''
      html += `<span class="remaining-char" data-index="${i}" style="${visibilityStyle}">${ch}</span>`
      if (hasTyped && charPositions.has(i)) {
        const { left, top } = charPositions.get(i)!
        const cls = isError ? 'error-char' : 'correct-char'
        overlayHtml += `<span class="${cls} typed-char" data-index="${i}" style="left: ${left}px; top: ${top + TYPED_CHAR_ADJUST_PX}px;">${typedChar}</span>`
      }
    }
    // 光标层：自定义竖线光标 + 指示器
    if (charPositions.size > 0) {
      if (currentPosition < content.length && charPositions.has(currentPosition)) {
        const { left, top } = charPositions.get(currentPosition)!
        overlayHtml += `<span class="current-char" style="left: ${left}px; top: ${top + VERTICAL_ADJUST_PX}px;"></span>`
        // 添加光标指示器
        overlayHtml += `<div class="cursor-indicator" style="left: ${left - 2}px; top: ${top + VERTICAL_ADJUST_PX}px;"></div>`
      } else if (content.length > 0) {
        const lastIndex = content.length - 1
        const last = charPositions.get(lastIndex)
        if (last) {
          overlayHtml += `<span class="current-char" style="left: ${last.left + 16}px; top: ${last.top + VERTICAL_ADJUST_PX}px;"></span>`
          // 末尾位置的光标指示器
          overlayHtml += `<div class="cursor-indicator" style="left: ${last.left + 14}px; top: ${last.top + VERTICAL_ADJUST_PX}px;"></div>`
        }
      }
    }
    return { html, overlayHtml }
  }, [textContent.content, currentPosition, typedMap])

  useEffect(() => { updateCharPositions() }, [updateCharPositions])

  const { html, overlayHtml } = getDisplayText()

  return (
    <div className="typing-practice">
      <div className="practice-header">
        <div>
          <h2>{textContent.title}</h2>
          <p>来源: {textContent.source}</p>
        </div>
        <div className="practice-controls">
          <button className="btn btn-secondary" onClick={onBack}>← 返回</button>
        </div>
      </div>

      <div className="practice-content">
        <div className="typing-stats">
          <div className="stat-item"><span className="stat-label">WPM</span><span className="stat-value">{wpm}</span></div>
          <div className="stat-item"><span className="stat-label">准确率</span><span className="stat-value">{accuracy}%</span></div>
          <div className="stat-item"><span className="stat-label">进度</span><span className="stat-value">{Math.round((typedMap.size / textContent.content.length) * 100)}%</span></div>
          <div className="stat-item"><span className="stat-label">错误</span><span className="stat-value">{errors}</span></div>
        </div>

        <div className="typing-instructions">
          <h3>打字说明</h3>
          <ul>
            <li><strong>直接打字：</strong>点击原文任意位置开始输入</li>
            <li><strong>中文输入：</strong>支持拼音输入法，输入完成后按空格确认</li>
            <li><strong>光标移动：</strong>使用 ← → 或 Home/End</li>
            <li><strong>删除回退：</strong>Backspace 删除前一位，Delete 删除当前位置</li>
          </ul>
        </div>

        <div className="text-container" onClick={handleClick}>
          <div ref={textDisplayRef} className="text-display">
            <div className="background-layer" dangerouslySetInnerHTML={{ __html: html }} />
            <div ref={overlayRef} className="overlay-layer" dangerouslySetInnerHTML={{ __html: overlayHtml }} />
          </div>
          <div
            ref={hiddenInputRef}
            className="hidden-input"
            contentEditable
            suppressContentEditableWarning
            onBeforeInput={handleBeforeInput}
            onCompositionStart={handleCompositionStart}
            onCompositionUpdate={handleCompositionUpdate}
            onCompositionEnd={handleCompositionEnd}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  )
}

export default TypingPractice
