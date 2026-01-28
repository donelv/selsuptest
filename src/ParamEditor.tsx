import React from 'react'

export interface Param {
  id: number
  name: string
  type: 'string'
}

export interface ParamValue {
  paramId: number
  value: string
}

export interface Model {
  paramValues: ParamValue[]
  // colors: Color[] // это к чему вообще
}

export interface Props {
  params: Param[]
  model: Model
  onSave?: (model: Model) => void
}

interface State {
  values: Record<number, string>
}

type ParamRendererProps = {
  id: string
  param: Param
  value: string
  onChange: (value: string) => void
}

// Для текстовых инпутов, для селекта или других типов пишутся такие же рендереры
const StringParamRenderer: React.FC<ParamRendererProps> = ({
  id,
  param,
  value,
  onChange,
}) => (
  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
    <label htmlFor={id} style={{ display: 'block' }}>
      {param.name}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: 6 }}
    />
  </div>
)

/**
 * Для расширения новых типов параметров
 * string -> StringParamRenderer
 * number -> NumberParamRenderer
 * select -> SelectParamRenderer
 */
const paramRenderers: Record<Param['type'], React.FC<ParamRendererProps>> = {
  string: StringParamRenderer,
}

export class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    // Инициализация значений из model
    const values: Record<number, string> = {}

    props.params.forEach((param) => {
      const existingValue = props.model.paramValues.find(
        (pv) => pv.paramId === param.id,
      )
      values[param.id] = existingValue?.value ?? ''
    })

    this.state = { values }
  }

  private handleChange = (paramId: number, value: string) => {
    this.setState((prev) => ({
      values: {
        ...prev.values,
        [paramId]: value,
      },
    }))
  }

  private save = () => {
    const model = this.getModel()
    console.log('SAVED MODEL:', model)
    this.props.onSave?.(model)
  }
  /**
   * Метод для получения полной модели
   */
  public getModel(): Model {
    const paramValues: ParamValue[] = this.props.params.map((param) => ({
      paramId: param.id,
      value: this.state.values[param.id] ?? '',
    }))

    return {
      ...this.props.model,
      paramValues,
    }
  }

  render() {
    const { params } = this.props
    const { values } = this.state

    return (
      <div>
        {params.map((param) => {
          const Renderer = paramRenderers[param.type]
          const inputId = `param-${param.id}`

          return (
            <Renderer
              id={inputId}
              key={param.id}
              param={param}
              value={values[param.id] ?? ''}
              onChange={(value) => this.handleChange(param.id, value)}
            />
          )
        })}
        <button onClick={this.save} style={{ marginTop: '10px' }}>
          Save
        </button>
      </div>
    )
  }
}
