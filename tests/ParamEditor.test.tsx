import { render, screen, fireEvent } from '@testing-library/react'
// import { ParamEditor, type Model, type Param } from './Editor'
import { describe, test, expect } from 'vitest'
import { Model, Param, ParamEditor } from '../src/ParamEditor'
import { vi } from 'vitest'
// import { ParamEditor, type Model, type Param } from '../src/ParamEditor'

// import { ParamEditor, Param, Model } from './ParamEdito'

/* ===== Test data ===== */

const params: Param[] = [
  { id: 1, name: 'Назначение', type: 'string' },
  { id: 2, name: 'Длина', type: 'string' },
]

const model: Model = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'макси' },
  ],
}

/* ===== Tests ===== */

describe('ParamEditor', () => {
  test('1. отображает поля согласно params', () => {
    render(<ParamEditor params={params} model={model} />)

    expect(screen.getByLabelText('Назначение')).toBeInTheDocument()
    expect(screen.getByLabelText('Длина')).toBeInTheDocument()
  })

  test('2. инициализирует значения из model.paramValues', () => {
    render(<ParamEditor params={params} model={model} />)

    const purposeInput = screen.getByLabelText('Назначение') as HTMLInputElement
    const lengthInput = screen.getByLabelText('Длина') as HTMLInputElement

    expect(purposeInput.value).toBe('повседневное')
    expect(lengthInput.value).toBe('макси')
  })

  test('3. getModel возвращает актуальные значения после изменений', () => {
    const onSave = vi.fn()

    render(<ParamEditor params={params} model={model} onSave={onSave} />)

    // меняем поля
    fireEvent.change(screen.getByLabelText('Назначение'), {
      target: { value: 'спортивное' },
    })
    fireEvent.change(screen.getByLabelText('Длина'), {
      target: { value: 'мини' },
    })

    // жмем save
    fireEvent.click(screen.getByText('Save'))

    expect(onSave).toHaveBeenCalledWith({
      paramValues: [
        { paramId: 1, value: 'спортивное' },
        { paramId: 2, value: 'мини' },
      ],
    })
  })
})
