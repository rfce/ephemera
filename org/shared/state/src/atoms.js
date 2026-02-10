import { atom } from 'jotai'

export const userAtom = atom(null)
export const themeAtom = atom('light')
export const tokenAtom = atom(localStorage.getItem('token') || null)

export const stepsAtom = atom(0)
export const navigateAtom = atom(null)
