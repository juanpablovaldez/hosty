import { expect } from 'chai'

function isPastDate(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

function isValidCapacityRange(min: number, max: number): boolean {
  if (max === 0) return true
  return min <= max
}

describe('isPastDate', () => {
  it('detecta correctamente una fecha pasada', () => {
    expect(isPastDate('2002-02-02')).to.be.true
  })

  it('no detecta como pasada una fecha futura', () => {
    expect(isPastDate('2099-12-31')).to.be.false
  })
})

describe('isValidCapacityRange', () => {
  it('retorna false cuando el mínimo es mayor al máximo', () => {
    expect(isValidCapacityRange(120, 100)).to.be.false
  })

  it('retorna true cuando el rango es válido', () => {
    expect(isValidCapacityRange(50, 200)).to.be.true
  })
})